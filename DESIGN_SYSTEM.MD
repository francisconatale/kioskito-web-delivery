# Design System — Variante "Azul Sutil"
Basado en el flujo de referencia (splash, home, listado, modal, detalle) reemplazando el rojo/magenta de marca por un azul calmado y de confianza, sin perder la energía comercial (promos, badges, ratings).

---

## 1. Concepto

El rojo original comunica urgencia y apetito. El azul sutil comunica **confianza, orden y rapidez sin ansiedad** — se acerca al lenguaje de apps de banca/fintech pero conservando calidez a través de un acento ámbar para promociones, para que las ofertas sigan "saltando" sobre un fondo más calmo.

Elemento firma: **"Arco de calma"** — el semicírculo sólido y saturado del splash rojo se reemplaza por un arco de degradé suave (Azul 700 → Azul 300 con opacidad decreciente), usado en el splash, en estados vacíos y como fondo sutil detrás del header de categorías.

---

## 2. Paleta de color

| Token | Hex | Uso |
|---|---|---|
| `blue-900` (Ink Blue) | `#16283A` | Texto de máximo contraste, headers sobre fondo claro |
| `blue-700` (Primary) | `#2E5C82` | Color de marca: CTA primario, splash, iconografía activa |
| `blue-500` (Primary Mid) | `#4C86B0` | Estados hover/pressed, íconos secundarios, links |
| `blue-200` (Sky Mist) | `#C9DFEC` | Bordes activos, contornos de chips seleccionados |
| `blue-100` (Sky Fog) | `#E7F0F7` | Fondos suaves, chips inactivos, badges informativos |
| `neutral-900` | `#1F2429` | Texto principal |
| `neutral-600` | `#5B6670` | Texto secundario, metadatos (tiempos, envío) |
| `neutral-200` | `#E4E8EB` | Bordes, divisores |
| `neutral-50` | `#F7F9FA` | Fondo general de la app |
| `white` | `#FFFFFF` | Cards, modales |
| `amber-500` (Promo) | `#E3A542` | Descuentos, "% OFF", badges de campaña — el único acento cálido, reservado para ofertas |
| `success-500` | `#2F9E62` | Confirmaciones, "Más vendido", check de entrega |
| `error-500` | `#D6524A` | Errores, "restaurante cerrado", validaciones — uso semántico, nunca decorativo |

**Regla de oro:** el azul es el color de la marca y la estructura; el ámbar es el único color que "grita" (promos); el rojo queda reservado exclusivamente a estados de error/alerta, nunca a UI regular — esto invierte el uso original, donde el rojo era a la vez marca y alerta, lo cual generaba ruido visual.

---

## 3. Tipografía

| Rol | Familia | Peso/uso |
|---|---|---|
| Display | **Sora** | 600–700, wordmark del splash, títulos de sección ("Restaurantes populares"), precios grandes |
| UI / Body | **Inter** | 400–500, texto de interfaz, descripciones, botones |
| Data / Utilitaria | **IBM Plex Mono** | 500, precios en línea (S/21.9), tiempos de entrega (25–40 min), códigos de descuento — aporta una sensación "operativa" de logística/recibo |

Escala tipográfica (base 16px, ratio 1.25):
`12 / 13 / 16 / 20 / 25 / 31 / 39`

---

## 4. Layout y espaciado

- Unidad base: **4px**
- Espaciados estándar: 4 · 8 · 12 · 16 · 24 · 32
- Radios: `sm 8px` (chips, badges) · `md 12px` (cards, inputs) · `lg 16px` (modales) · `full` (avatares, botones pill)
- Elevación: sombras suaves en vez de bloques de color saturado — `0 2px 8px rgba(22,40,58,0.08)` para cards, `0 8px 24px rgba(22,40,58,0.16)` para modales. Esto refuerza la sensación "calma" frente al flat-color intenso del original.

---

## 5. Componentes clave (mapeados a las 5 pantallas de referencia)

### Pantalla 1 — Splash / Login
- Fondo: arco de degradé `blue-700 → blue-500` sobre `neutral-50`, no bloque sólido a pantalla completa.
- Wordmark en blanco, tipografía Sora 700.
- Botones sociales: fondo blanco, borde `neutral-200`, texto `neutral-900`, ícono a la izquierda.
- CTA texto "Continuar de otra forma": `blue-500`, sin subrayado, peso 500.

### Pantalla 2 — Home
- Barra de búsqueda: fondo `neutral-50`, borde `neutral-200`, ícono de lupa en `blue-700` sobre círculo `blue-100`.
- Banner "Ser Plus te conviene": fondo `blue-900`, texto blanco, ícono destacado en `amber-500` solo si hay beneficio económico.
- Tiles de categoría (Restaurantes, Market, Supermercados...): fondo `blue-100`, ícono/imagen centrada, texto `neutral-900` 500.
- Banners promocionales ("Costo de envío S/2"): fondo `blue-700` o `amber-500` alternando, nunca ambos rojo como en el original — separar "informativo de marca" (azul) de "oferta" (ámbar).

### Pantalla 3 — Listado de restaurantes
- Chips de filtro ("Retiro en local", "Descuentos"): inactivo `white` + borde `neutral-200`; activo `blue-100` + borde `blue-500` + texto `blue-700`.
- Banner de campaña ("10% OFF con retiro"): fondo `amber-500`, texto `neutral-900`, ilustración integrada.
- Card de restaurante: `white`, borde `neutral-200`, radio `md`. Rating con estrella en `amber-500` (mantiene el patrón universal de rating), tiempo de entrega en `neutral-600` con tipografía mono.
- Etiqueta "Patrocinado": `neutral-100` texto `neutral-600`, minúscula visual, no compite con la marca.

### Pantalla 4 — Modal de estado
- Overlay: `neutral-900` a 60% opacidad.
- Card modal: `white`, radio `lg`, sombra elevada.
- Ícono/título en `blue-900`.
- Botón primario ("Aceptar"): fondo `blue-700`, texto blanco, radio `full`. *(Antes rojo saturado — aquí se conserva la jerarquía pero con la marca, no con alerta, ya que aceptar no es un error).* Si el modal fuera de error crítico, el botón usaría `error-500`.

### Pantalla 5 — Detalle de producto/restaurante
- Header con imagen: overlay de gradiente inferior en `blue-900` a 40% para legibilidad de íconos.
- Íconos flotantes (favorito, compartir, buscar): fondo `white` circular, ícono `blue-700`.
- Info de entrega (tiempo, envío, mínimo): tarjeta `neutral-50`, valores en Plex Mono, etiquetas en `neutral-600`.
- Tabs de categoría de menú ("Pollo a la Brasa", "Bebidas"): tab activa `blue-700` fondo sólido + texto blanco; inactiva `white` + borde `neutral-200`.
- Badge "Más vendido": `success-500` fondo suave (`#E7F5EC`) texto `success-500`.
- Precio de producto: Sora 600, `neutral-900`.

---

## 6. Accesibilidad

- Contraste mínimo AA: `blue-700` sobre blanco = 5.2:1 ✅ (apto para texto y botones).
- `amber-500` sobre blanco falla AA para texto pequeño (usar solo como fondo de badge con texto `neutral-900`, nunca como texto sobre blanco).
- Estados de foco: contorno `blue-500` 2px, offset 2px, visible en todos los controles interactivos.
- Nunca usar únicamente el color para indicar estado (ej. "cerrado"): siempre acompañar con texto/ícono, como en el modal original.

---

## 7. Resumen rápido de tokens (para Figma / código)

```
--color-primary-900: #16283A;
--color-primary-700: #2E5C82;
--color-primary-500: #4C86B0;
--color-primary-200: #C9DFEC;
--color-primary-100: #E7F0F7;
--color-neutral-900: #1F2429;
--color-neutral-600: #5B6670;
--color-neutral-200: #E4E8EB;
--color-neutral-50:  #F7F9FA;
--color-amber-500:   #E3A542;
--color-success-500: #2F9E62;
--color-error-500:   #D6524A;

--font-display: 'Sora', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'IBM Plex Mono', monospace;

--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-full: 999px;
```