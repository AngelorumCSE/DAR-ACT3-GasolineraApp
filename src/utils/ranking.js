import { haversineKm } from './haversine.js'

function normalizeList(str) {
  if (!str || typeof str !== 'string') return []
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toUpperCase())
}



function brandMatches(brand, items) {
  if (!items.length) return true
  const b = (brand || '').toUpperCase()
  return items.some((i) => b.includes(i))
}

export function filterAndRankStations(stations, { origin, fuelKey, radiusKm, maxResults, includeBrands, excludeBrands }) {
const include = normalizeList(includeBrands);
const exclude = normalizeList(excludeBrands);



  const processed = stations
    .map((s) => {
      const distanceKm = haversineKm(origin, { lat: s.lat, lon: s.lon })
      const selectedFuelPrice = s.prices ? s.prices[fuelKey] : null
      return {
        ...s,
        distanceKm,
        selectedFuelPrice,
        withinRadius: Number.isFinite(radiusKm) ? distanceKm <= radiusKm : true
      }
    })
    //FILTRADO REAL POR RADIO
  .filter(s => s.withinRadius)

  // Filtrado por marcas
  .filter((s) => {
    const b = s.brand || ''
    if (include.length && !brandMatches(b, include)) return false
    if (exclude.length && brandMatches(b, exclude)) return false
    return true
  })

  .sort((a, b) => a.distanceKm - b.distanceKm)

  const limited = Number.isFinite(maxResults) ? processed.slice(0, Math.max(1, maxResults)) : processed
  return limited
}
