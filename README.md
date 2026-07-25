# Mi registro de chorizos

App personal para llevar el registro de tu tienda de chorizos:

- **Ventas** — paquetes vendidos a una persona (ej. Carlos compró 3), con pago sí/no
- **Envíos** — lotes que mandas a alguien para que venda; luego marcas cuántos vendió (cualquier día) y si ya te pagó
- **Receta** — cálculo de ingredientes según la cantidad a producir

## Setup

1. `npm install`
2. Copia `.env.example` a `.env` y pon tu URL/anon key de Supabase
3. En el SQL Editor de Supabase, ejecuta `supabase/schema.sql`
4. `npm run dev`

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run lint` — ESLint
