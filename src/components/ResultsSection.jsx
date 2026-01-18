import React from 'react'
import StationCard from './StationCard.jsx'

export default function ResultsSection({ stations, fuelKey, loading, lastUpdatedAt, highlights, hasSearched }) {
  if (loading) {
    return <div className="spinner"></div>
  }

  if (!stations.length) {
    return (
      <div>
        {!hasSearched ? (
          <>
            <p className="muted">Aun no hay resultados. Introduce coordenadas y pulsa Buscar.</p>
            <p className="muted">
              Se mostraran las gasolineras mas cercanas y se destacara la mas barata dentro del radio.
            </p>
          </>
        ) : (
          <>
            <p className="muted">Busqueda realizada, pero no hay resultados para esos filtros.</p>
            <p className="muted">Prueba a aumentar el radio o borrar la lista blanca/negra de marcas.</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      {stations.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <iframe
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: "8px" }}
            loading="lazy"
            src={`https://maps.google.com/maps?q=${stations[0].lat},${stations[0].lon}&z=13&output=embed`}
          ></iframe>
        </div>
      )}

      <div className="summary">
        <div>
          <div className="kpi-title">Carburante</div>
          <div className="kpi-value">{fuelKey}</div>
        </div>

        <div>
          <div className="kpi-title">Resultados</div>
          <div className="kpi-value">{stations.length}</div>
        </div>

        <div>
          <div className="kpi-title">Actualizado</div>
          <div className="kpi-value">{lastUpdatedAt || '-'}</div>
        </div>
      </div>

      <div className="highlights">
        {highlights?.nearest ? (
          <div className="highlight">
            <strong>Mas cercana:</strong> {highlights.nearest.brand || 'Sin marca'} - {highlights.nearest.address}
            <span className="badge">{highlights.nearest.distanceKm.toFixed(2)} km</span>
          </div>
        ) : null}

        {highlights?.cheapestInRadius ? (
          <div className="highlight">
            <strong>Mas barata en el radio:</strong> {highlights.cheapestInRadius.brand || 'Sin marca'} - {highlights.cheapestInRadius.address}
            <span className="badge">{highlights.cheapestInRadius.selectedFuelPrice.toFixed(3)} EUR/L</span>
          </div>
        ) : (
          <div className="highlight muted">No hay precios disponibles dentro del radio para ese carburante.</div>
        )}
      </div>

      <div className="list">
        {stations.map((s) => (
          <StationCard key={s.id} station={s} />
        ))}
      </div>
    </div>
  )
}
