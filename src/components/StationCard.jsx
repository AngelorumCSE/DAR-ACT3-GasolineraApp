import React from 'react'

function buildMapsLink(lat, lon) {
  const q = encodeURIComponent(`${lat},${lon}`)
  return `https://www.google.com/maps?q=${q}`
}

export default function StationCard({ station }) {
  const maps = buildMapsLink(station.lat, station.lon)

  return (
    <article className={"station " + (station.withinRadius ? '' : 'out')}>
      <div className="station-top">
        <div>
          <div className="station-brand">{station.brand || 'Sin marca'}</div>
          <div className="station-address">{station.address}</div>
          <div className="station-meta">
            {station.town ? `${station.town} (${station.province || '-'})` : null}
            {station.schedule ? ` - Horario: ${station.schedule}` : ''}
          </div>
        </div>

        <div className="station-right">
          <div className="price">
            {station.selectedFuelPrice != null ? (
              <>
                <div className="price-value">{station.selectedFuelPrice.toFixed(3)} EUR/L</div>
                <div className="muted small">Precio seleccionado</div>
              </>
            ) : (
              <>
                <div className="price-value muted">-</div>
                <div className="muted small">Sin precio</div>
              </>
            )}
          </div>
          <div className="dist">
            <span className="badge">{station.distanceKm.toFixed(2)} km</span>
          </div>
        </div>
      </div>

      <div className="station-actions">
        <a className="link" href={maps} target="_blank" rel="noreferrer">
          Ver en Maps
        </a>
        {station.withinRadius ? <span className="ok">Dentro del radio</span> : <span className="muted">Fuera del radio</span>}
      </div>
    </article>
  )
}
