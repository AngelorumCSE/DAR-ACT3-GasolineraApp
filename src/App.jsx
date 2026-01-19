import React, { useMemo, useState } from 'react'
import InputSection from './components/InputSection.jsx'
import ResultsSection from './components/ResultsSection.jsx'
import { fetchStations } from './services/fuelApi.js'
import { normalizeStationList } from './utils/normalize.js'
import { filterAndRankStations } from './utils/ranking.js'

export default function App() {
  const [coords, setCoords] = useState({ lat: '', lon: '' })
  const [filters, setFilters] = useState({
    fuelKey: 'Precio Gasolina 95 E5',
    radiusKm: 10,
    maxResults: 20,
    includeBrands: '',
    excludeBrands: ''
  })

  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdatedAt, setLastUpdatedAt] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  async function onSearch() {
    setError('')
    setHasSearched(true)

    const lat = Number(coords.lat)
    const lon = Number(coords.lon)

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setError('Introduce unas coordenadas validas (latitud y longitud).')
      return
    }

    setLoading(true)
    try {
      const raw = await fetchStations({
      lat,
      lon,
      radiusKm: filters.radiusKm,
      maxResults: filters.maxResults,
      includeBrands: filters.includeBrands,
      excludeBrands: filters.excludeBrands
    })

      const normalized = normalizeStationList(raw)
      
      const ranked = filterAndRankStations(normalized, { ...filters, origin: { lat, lon } })
      setStations(ranked)
      setLastUpdatedAt(new Date().toLocaleString())
      if (!ranked.length) {
        setError('No se han encontrado estaciones con esos filtros. Prueba ampliando el radio o quitando filtros de marcas.')
      }
    } catch (e) {
      setError(e?.message || 'Error al obtener/procesar los datos de la API.')
      setStations([])
    } finally {
      setLoading(false)
    }
  }

  const highlights = useMemo(() => {
    if (!stations.length) return { nearest: null, cheapestInRadius: null }

    const nearest = stations[0]
    const withinRadius = stations.filter((s) => s.withinRadius && s.selectedFuelPrice != null)
    const cheapestInRadius = withinRadius.length
      ? withinRadius.reduce((best, s) => (s.selectedFuelPrice < best.selectedFuelPrice ? s : best))
      : null

    return { nearest, cheapestInRadius }
  }, [stations])

  return (
    <div className="page">
      <header className="header">
        <h1>Gasolineras cercanas (API REST)</h1>
        <p className="sub">
          Actividad 3 - Uso de una API en una aplicacion desarrollada por componentes.
        </p>
      </header>

      <main className="grid">
        <section className="card">
          <h2>1) Entrada</h2>
          <InputSection
            coords={coords}
            onCoordsChange={setCoords}
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={onSearch}
            loading={loading}
          />
          {error ? <div className="alert">{error}</div> : null}
        </section>

        <section className="card">
          <h2>2) Salida</h2>
          <ResultsSection
            stations={stations}
            fuelKey={filters.fuelKey}
            loading={loading}
            lastUpdatedAt={lastUpdatedAt}
            highlights={highlights}
            hasSearched={hasSearched}
          />
        </section>
      </main>

      <footer className="footer">
        <small>
          Nota: si la API no responde por CORS, revisa el proxy sugerido en el README.
        </small>
      </footer>
    </div>
  )
}
