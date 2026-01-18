import { FUEL_OPTIONS } from '../services/fuelApi.js'

function toNumber(value) {
  if (value == null) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const cleaned = value.trim().replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

function toCoord(value) {
  // En esta API a veces vienen con coma decimal.
  return toNumber(value)
}

export function normalizeStation(raw) {
  const lat = toCoord(
    raw.Latitud ||
    raw.lat ||
    raw.latitude
  );

  const lon = toCoord(
    raw["Longitud (WGS84)"] ||
    raw.Longitud ||
    raw.lon ||
    raw.longitude
  );

  const prices = {};
  for (const opt of FUEL_OPTIONS) {
    prices[opt.key] = toNumber(raw[opt.key]);
  }

  return {
    id: String(raw.IDEESS || raw.ID || raw.id || `${lat},${lon},${raw.Direccion || ''}`),
    brand: (raw["Rótulo"] || raw.Rotulo || raw.Marca || raw.brand || "").toString().trim(),
    address: (raw.Direccion || raw.address || '').toString().trim(),
    town: (raw.Municipio || raw.town || '').toString().trim(),
    province: (raw.Provincia || raw.province || '').toString().trim(),
    schedule: (raw.Horario || raw.schedule || '').toString().trim(),
    lat,
    lon,
    prices,
    raw
  };
}

export function normalizeStationList(rawList) {
  if (!Array.isArray(rawList)) return []
  return rawList
    .map(normalizeStation)
    .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lon))
}
