# Pagos App – Frontend

SPA en React (Vite) para tienda con flujo de pago por tarjeta. Integración con API propia y tokenización de tarjeta vía API externa (sandbox).

## Flujo de negocio (5 pasos)

1. **Página de productos** – Listado de productos con descripción, precio y stock (desde API).
2. **Pago con tarjeta** – Botón “Pagar con tarjeta” abre un modal con:
   - Datos de tarjeta (número, vencimiento, CVV, titular) con validación y detección VISA/MasterCard.
   - Datos de entrega (dirección, ciudad, teléfono).
3. **Resumen de pago** – Backdrop con: monto producto(s), tarifa base, envío y botón “Pagar”.
4. **Estado final** – Modal con resultado de la transacción (éxito/fallo) e ID/estado del proveedor de pago.
5. **Vuelta a productos** – Al cerrar el resultado se refresca la lista de productos (stock actualizado).

## Tecnologías

- React 19, Vite 7
- Redux Toolkit (Flux)
- Jest + React Testing Library (pruebas unitarias)
- CSS (flexbox/grid), diseño responsive y orientado a móvil

## Requisitos previos

- Node.js 18+
- Backend de la API corriendo (por defecto se espera en `http://localhost:4567` vía proxy `/api`).

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abrir la URL que indique Vite (ej. `http://localhost:5173`).

## Scripts

| Comando            | Descripción              |
|--------------------|--------------------------|
| `npm run dev`      | Servidor de desarrollo   |
| `npm run build`    | Build de producción      |
| `npm run preview`  | Vista previa del build   |
| `npm test`         | Ejecutar pruebas (Jest)  |
| `npm run test:watch`   | Pruebas en modo watch   |
| `npm run test:coverage`| Pruebas con cobertura   |
| `npm run lint`     | ESLint                   |

## Pruebas unitarias (Jest)

Las pruebas están en archivos `*.test.js` / `*.test.jsx` junto a los módulos o en carpetas `__tests__`.

- **Cobertura:** ejecutar `npm run test:coverage` y revisar la carpeta `coverage/` (o el reporte en consola).
- **Objetivo:** mantener cobertura > 80% (requisito del proyecto). Añadir aquí el resultado de cobertura tras ejecutar:

```bash
npm run test:coverage
```

*(Incluir en este README la salida de cobertura o una captura una vez cumplido el 80%.)*

## Resiliencia

- El estado de checkout (ítems y datos de entrega, **nunca datos de tarjeta**) se persiste en `localStorage`. En caso de refresco, se recuperan ítems y dirección para no perder el progreso del cliente.

## API / Backend

- Base URL en desarrollo: proxy `/api` → `http://localhost:4567` (configurable con `VITE_API_URL`).
- Endpoints esperados:
  - `GET /api/products` – Lista de productos (con stock).
  - `POST /api/payments` – Crear pago (PENDING). Body: `product_id`, `quantity`, `card_number`. Respuesta: número/ID de transacción.
  - `PATCH /api/transactions/:id/complete` – Completar transacción tras tokenización. Body: `wompi_id`, `wompi_status` (u otros que defina el backend). El backend debe actualizar transacción, asignar entrega y actualizar stock.

*(Añadir aquí enlace a Postman Collection o Swagger del backend si está público.)*

## Diseño

- Orientado a móvil; referencia mínima: iPhone SE (375×667).
- Viewport y estilos base en `index.html` y `src/styles/globals.css`.

## Checklist para completar la prueba

### Frontend (este repo)

| Requisito | Estado |
|-----------|--------|
| UI con productos, descripción, precio, stock | ✅ |
| Botón "Pagar con tarjeta" que abre modal | ✅ |
| Modal: tarjeta (validación, VISA/MasterCard) + entrega | ✅ |
| Resumen en backdrop (producto, tarifa base, envío, botón Pagar) | ✅ |
| Al pagar: crear transacción PENDING en backend y obtener número | ✅ |
| Llamar a API externa (tokenización tarjeta) | ✅ |
| Tras pago: mostrar resultado y volver a productos con stock actualizado | ✅ |
| Notificar al backend resultado (confirmar transacción) | ✅ (endpoint `PATCH /transactions/:id/complete`) |
| Recuperar progreso tras refresh (localStorage, sin datos de tarjeta) | ✅ |
| Flujo 5 pasos: Productos → Tarjeta/Entrega → Resumen → Resultado → Productos | ✅ |
| Redux (Flux), estado de pago en store | ✅ |
| Diseño responsive / móvil (iPhone SE) | ✅ |
| Pruebas unitarias con Jest | ✅ |
| Cobertura > 80% | ⬜ Ejecutar `npm run test:coverage` y añadir resultado aquí |

### Backend (tu API)

- Exponer **`PATCH /transactions/:id/complete`** (o equivalente) con body `{ wompi_id, wompi_status }` para que, tras la tokenización en front, el backend actualice la transacción, asigne entrega y actualice stock. Si usas otro path/body, cambia `completePayment` en `src/services/api.js`.

## Licencia

Privado / uso interno del proyecto.
