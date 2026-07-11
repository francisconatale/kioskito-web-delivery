# Design Memory: Admin Dashboard (Storefront Manager)

## 1. Alcance y Objetivo
*   **Alcance:** Componente / Página completa (Admin Dashboard).
*   **Tipo:** Nuevo diseño (Página de gestión de catálogo).
*   **Ruta Destino:** `app/(routes)/dashboard/storefront/page.tsx`
*   **Tareas Principales:** 
    1. Ver la lista completa de productos provenientes del POS físico.
    2. Activar/Desactivar visibilidad en la app ("Mostrar en App").
    3. Asignar o modificar la "Categoría Delivery" de cada producto.

## 2. Usuario y Contexto
*   **Usuario Principal:** Dueño del kiosco / Administrador / Equipo de Gestión.
*   **Contexto de Uso:** Principalmente Desktop (Desktop-first), gestión administrativa.
*   **Tono de Marca (Adjetivos):** Premium, Utilitario, Minimalista, Eficiente.
*   **Densidad de Información:** Cómoda (Permitir ver suficientes productos pero sin sobrecargar la vista, facilitando la edición rápida).

## 3. Problemas a Evitar (Pain Points)
*   **Evitar flujos lentos:** No debe requerir clicks excesivos para actualizar un producto (ej. evitar tener que abrir un modal completo solo para activar un switch). Debe soportar *Inline Editing* o actualizaciones optimistas.
*   **Evitar desorden:** La información debe estar claramente jerarquizada.

## 4. Restricciones Técnicas y Backend
*   **Dependencias:** Utilizar el ecosistema existente (Next.js App Router, Tailwind CSS, Lucide Icons, Shadcn UI si aplica).
*   **Endpoints Integrados:**
    *   `GET /api/productos-delivery?adminView=true` (Retorna lista completa con campos: `id`, `nombre`, `precioVenta`, `stock`, `mostrarEnApp`, `categoriaDeliveryId`).
    *   `PUT /api/productos-delivery/{id}` (Actualiza configuraciones).
    *   `GET /api/categorias-delivery` (Obtiene categorías disponibles para el selector).

## 5. Inspiración Funcional
*   Tablas/Listas al estilo Stripe o Linear (enfocado a power users, atajos de teclado o edición rápida en línea).
*   Feedbacks visuales inmediatos (Optimistic updates).
