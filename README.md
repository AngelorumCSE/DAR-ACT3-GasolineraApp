# Actividad 3 - Uso de una API en aplicacion por componentes

App web (React + Vite) que consume la API REST de precios de carburantes y muestra gasolineras cercanas a una posicion (coordenadas manuales o GPS).

## Requisitos
- Node.js 18+ (o 20+)

## Arranque
```bash
npm install
npm run dev
```
Abrir: http://localhost:5173

## Como funciona
- **Entrada**: latitud/longitud manual o boton *Usar mi ubicacion* (Geolocation API). Filtros por carburante, radio, max resultados, lista blanca y lista negra de marcas.
- **Salida**: lista de gasolineras ordenadas por distancia. Se destacan:
  - Gasolinera mas cercana.
  - Gasolinera mas barata dentro del radio para el carburante seleccionado.

## API y CORS
La app hace la peticion con `fetch` a `.../EstacionesTerrestres/` usando AJAX (asincrono). Si la API no permite CORS directo desde el navegador, se usa un **proxy de desarrollo** configurado en `vite.config.js`.

- Ruta local usada por el cliente:
  - `GET /api/EstacionesTerrestres/`

- Proxy Vite:
  - `'/api' -> https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes`

Si en tu caso la ruta base cambia, crea un `.env` con:
```
VITE_FUEL_API_BASE=https://.../PreciosCarburantes
```

## Estructura
```
src/
  components/
    InputSection.jsx
    ResultsSection.jsx
    StationCard.jsx
  services/
    fuelApi.js
  utils/
    haversine.js
    normalize.js
    ranking.js
  App.jsx
  main.jsx
  styles.css
```

## Notas de datos
- Latitud/Longitud y precios pueden venir con coma decimal. Se normalizan (`,` -> `.`) antes de convertir a numero.
- El campo de marca suele venir como `Rotulo`.

