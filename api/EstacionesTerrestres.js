module.exports = async (req, res) => {
  const url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/"\;

  try {
    const r = await fetch(url, {
      headers: { "Accept": "application/json" }
    });

    const text = await r.text();

    res.statusCode = r.status;
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json; charset=utf-8");
    // Mismo origen (tu vercel.app) ya evita CORS, pero no molesta:
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(text);
  } catch (e) {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Proxy error", details: String(e) }));
  }
};
