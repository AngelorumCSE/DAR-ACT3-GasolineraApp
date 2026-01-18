// API de precios de carburantes (Ministerio). Se usa el proxy /api configurado en Vite.
// Nota: si cambian la ruta base, ajusta VITE_FUEL_API_BASE o vite.config.js.

export const FUEL_OPTIONS = [
  { key: 'Precio Gasolina 95 E5', label: 'Gasolina 95 E5' },
  { key: 'Precio Gasolina 98 E5', label: 'Gasolina 98 E5' },
  { key: 'Precio Gasoleo A', label: 'Gasoleo A' },
  { key: 'Precio Gasoleo B', label: 'Gasoleo B' },
  { key: 'Precio Gasoleo Premium', label: 'Gasoleo Premium' },
  { key: 'Precio GLP', label: 'GLP' },
  { key: 'Precio GNC', label: 'GNC' },
  { key: 'Precio GNL', label: 'GNL' }
]

export async function fetchStations() {
  // Endpoint habitual: /EstacionesTerrestres/
  const url = '/api/EstacionesTerrestres/'

  const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status} al llamar a la API.`)
  }

  const data = await res.json()

  // La respuesta suele traer ListaEESSPrecio. Devolvemos lista "cruda".
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.ListaEESSPrecio)) return data.ListaEESSPrecio

  // Por si el portal devuelve otro envoltorio
  const maybe = data?.resultado || data?.result || data?.data
  if (Array.isArray(maybe)) return maybe
  if (Array.isArray(maybe?.ListaEESSPrecio)) return maybe.ListaEESSPrecio

  throw new Error('Formato inesperado de respuesta JSON. Revisa la API y el parseo.')
}
