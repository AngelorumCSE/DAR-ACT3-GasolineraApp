const https = require('https');

const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'\;

function toNumber(value) {
  if (value == null) return null;
  const s = String(value).trim().replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sin1 = Math.sin(dLat / 2);
  const sin2 = Math.sin(dLon / 2);

  const h = sin1 * sin1 + Math.cos(lat1) * Math.cos(lat2) * sin2 * sin2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function normalizeList(str) {
  if (!str) return [];
  return String(str)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toUpperCase());
}

function brandMatches(brand, items) {
  if (!items.length) return true;
  const b = (brand || '').toUpperCase();
  return items.some((i) => b.includes(i));
}

function fetchRemoteJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { Accept: 'application/json', 'User-Agent': 'Vercel-Proxy' } }, (r) => {
        let data = '';
        r.on('data', (chunk) => (data += chunk));
        r.on('end', () => resolve({ status: r.statusCode || 500, body: data }));
      })
      .on('error', reject);
  });
}

module.exports = async (req, res) => {
  try {
    const lat = toNumber(req.query.lat);
    const lon = toNumber(req.query.lon);
    const radiusKm = toNumber(req.query.radiusKm) ?? 10;
    const maxResults = Math.max(1, Math.min(100, Number(req.query.maxResults || 20))); // max 100
    const includeBrands = normalizeList(req.query.includeBrands || '');
    const excludeBrands = normalizeList(req.query.excludeBrands || '');

    const remote = await fetchRemoteJSON(API_URL);
    if (remote.status < 200 || remote.status >= 300) {
      res.statusCode = remote.status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'API upstream error', status: remote.status }));
      return;
    }

    const json = JSON.parse(remote.body);
    const list = Array.isArray(json) ? json : (json.ListaEESSPrecio || []);

    // Si no me pasan coords, devuelvo un trocito pequeño para no reventar
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(list.slice(0, maxResults)));
      return;
    }

    const origin = { lat, lon };

    const filtered = list
      .map((s) => {
        const sLat = toNumber(s.Latitud || s.lat || s.latitude);
        const sLon = toNumber(s["Longitud (WGS84)"] || s.Longitud || s.lon || s.longitude);
        if (!Number.isFinite(sLat) || !Number.isFinite(sLon)) return null;

        const dist = haversineKm(origin, { lat: sLat, lon: sLon });
        return { s, dist, brand: (s["Rótulo"] || s.Rotulo || s.Marca || '').toString() };
      })
      .filter(Boolean)
      .filter((x) => x.dist <= radiusKm)
      .filter((x) => {
        if (includeBrands.length && !brandMatches(x.brand, includeBrands)) return false;
        if (excludeBrands.length && brandMatches(x.brand, excludeBrands)) return false;
        return true;
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, maxResults)
      .map((x) => x.s);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(filtered));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Function error', details: String(e) }));
  }
};
