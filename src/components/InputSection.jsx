import React, { useState } from 'react'
import { FUEL_OPTIONS } from '../services/fuelApi.js'

export default function InputSection({ coords, onCoordsChange, filters, onFiltersChange, onSearch, loading }) {
  const [geoStatus, setGeoStatus] = useState('')

  function setCoordField(field, value) {
    onCoordsChange({ ...coords, [field]: value })
  }

  function setFilterField(field, value) {
    onFiltersChange({ ...filters, [field]: value })
  }


function resetAll() {
  onFiltersChange({
    fuelKey: 'Precio Gasolina 95 E5',
    radiusKm: 10,
    maxResults: 20,
    includeBrands: '',
    excludeBrands: ''
  })
  onCoordsChange({
    lat: null,
    lon: null
  })
  setGeoStatus('')
}

  async function onUseGeolocation() {
    setGeoStatus('')
    if (!('geolocation' in navigator)) {
      setGeoStatus('Este navegador no soporta geolocalizacion.')
      return
    }

    setGeoStatus('Obteniendo ubicacion...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6)
        const lon = pos.coords.longitude.toFixed(6)
        onCoordsChange({ lat, lon })
        setGeoStatus('Ubicacion obtenida correctamente. Pulsa "Buscar gasolineras".')
      },
      (err) => {
        setGeoStatus(`No se pudo obtener la ubicacion: ${err.message}`)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function onSubmit(e) {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="row">
        <div className="field">
          <label htmlFor="lat">Latitud</label>
          <input
            id="lat"
            type="number"
            inputMode="decimal"
            step="any"
            value={coords.lat ?? ''}
            onChange={(e) => setCoordField('lat', e.target.value)}
            placeholder="Ej: 40.416775"
          />
        </div>

        <div className="field">
          <label htmlFor="lon">Longitud</label>
          <input
            id="lon"
            type="number"
            inputMode="decimal"
            step="any"
            value={coords.lon ?? ''}
            onChange={(e) => setCoordField('lon', e.target.value)}
            placeholder="Ej: -3.703790"
          />
        </div>
      </div>

      <div className="row">
        <button type="button" className="button" onClick={onUseGeolocation} disabled={loading}>
          Usar mi ubicacion (GPS)
        </button>
        {geoStatus ? <div className="muted">{geoStatus}</div> : null}
      </div>

      <hr className="sep" />

      <div className="row">
        <div className="field">
          <label htmlFor="fuel">Carburante</label>
          <select
            id="fuel"
            value={filters.fuelKey}
            onChange={(e) => setFilterField('fuelKey', e.target.value)}
          >
            {FUEL_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="radius">Radio (km)</label>
          <input
            id="radius"
            type="number"
            min="1"
            step="1"
            value={filters.radiusKm}
            onChange={(e) => setFilterField('radiusKm', Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor="max">Max resultados</label>
          <input
            id="max"
            type="number"
            min="1"
            step="1"
            value={filters.maxResults}
            onChange={(e) => setFilterField('maxResults', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="include">Lista blanca de marcas (coma)</label>
          <input
            id="include"
            type="text"
            value={filters.includeBrands}
            onChange={(e) => setFilterField('includeBrands', e.target.value)}
            placeholder="Ej: REPSOL, BP"
          />
        </div>

        <div className="field">
          <label htmlFor="exclude">Excluir marcas (coma)</label>
          <input
            id="exclude"
            type="text"
            value={filters.excludeBrands}
            onChange={(e) => setFilterField('excludeBrands', e.target.value)}
            placeholder="Ej: CARREFOUR, ALCAMPO"
          />
        </div>
      </div>
      <div className="row">
        <button
          type="button"
          className="button secondary"
          onClick={resetAll}
          disabled={loading}
        >
          Limpiar filtros
        </button>
      </div>
      <div className="row">
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar gasolineras'}
        </button>
      </div>
    </form>
  )
}
