# Mi registro de chorizos

App personal para tu tienda de chorizos.

## Qué incluye

- **Pedidos** (`/pedidos`) — página pública para que te hagan pedidos cuando abres un ciclo
- **Ventas** — registro de ventas + abrir/cerrar pedidos
- **Envíos** — lotes a otra persona, reportes de “vendí N” y pago aparte
- **Receta** — ingredientes por tipo (normal / pimienta / picante)
- **Resumen** — totales por ciclo y ganancia aproximada

## Setup

1. `npm install`
2. Copia `.env.example` → `.env` con tu Supabase URL y anon key
3. En Supabase SQL Editor ejecuta `supabase/schema.sql`
4. `npm run dev`

## Preferencias

- **Idioma**: ES / EN (español por defecto)
- **Tema**: claro / oscuro — el modo oscuro usa carbón cálido (misma libreta, no un admin gris)
