# API Reference: Categorías y Productos

Endpoints para el catálogo de productos y categorías, tanto para POS (ventas) como para Delivery (app).

---

## 📁 Categorías (Ventas - POS)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/categoria` | Listar categorías |
| `PUT` | `/api/categoria` | Actualizar categoría (margen) |
| `DELETE` | `/api/categoria/{id}` | Eliminar categoría |
| `GET` | `/api/categoria/export-bundle` | Exportar bundle |
| `POST` | `/api/categoria/import-bundle` | Importar bundle |

---

## 📱 Categorías Delivery (App)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/categorias-delivery` | Listar categorías |
| `GET` | `/api/categorias-delivery/{id}` | Obtener por ID |
| `POST` | `/api/categorias-delivery` | Crear categoría |
| `PUT` | `/api/categorias-delivery/{id}` | Actualizar categoría |
| `DELETE` | `/api/categorias-delivery/{id}` | Eliminar categoría |

---

## 📦 Productos (Ventas - POS)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/productos` | Listar productos (paginado, con filtros) |
| `GET` | `/api/productos/{id}` | Obtener por ID |
| `GET` | `/api/productos/buscar` | Buscar productos |
| `GET` | `/api/productos/{id}/historial-precios` | Historial de precios |
| `GET` | `/api/productos/codigo-barra/{codigoBarra}` | Buscar por código barras |
| `GET` | `/api/productos/stock-bajo` | Productos con stock bajo |
| `POST` | `/api/productos` | Crear producto |
| `PUT` | `/api/productos/{id}` | Actualizar producto |
| `DELETE` | `/api/productos/{id}` | Eliminar producto |
| `DELETE` | `/api/productos/uuid/{uuid}` | Eliminar por UUID |
| `POST` | `/api/productos/bulk-update-prices` | Actualización masiva de precios |

---

## 🛵 Productos Delivery (App)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/productos-delivery` | Listar productos (paginado) |
| `GET` | `/api/productos-delivery/{id}` | Obtener por ID |
| `POST` | `/api/productos-delivery/{id}` | Crear/habilitar en delivery |
| `PUT` | `/api/productos-delivery/{id}` | Actualizar configuración |
| `PATCH` | `/api/productos-delivery/{id}` | Actualización parcial |
| `DELETE` | `/api/productos-delivery/{id}` | Eliminar configuración |

---

## 🎯 Filtros Disponibles

| Endpoint | Filtro | Tipo | Descripción |
|----------|--------|------|-------------|
| `/api/productos` | `q` | String | Término de búsqueda |
| `/api/productos` | `categoria` | String | Nombre o ID de categoría |
| `/api/productos` | `minPrice` | BigDecimal | Precio mínimo |
| `/api/productos` | `maxPrice` | BigDecimal | Precio máximo |
| `/api/productos` | `negocioId` | Long | ID del negocio |
| `/api/productos` | `page` | int | Número de página (default: 0) |
| `/api/productos` | `size` | int | Tamaño de página (default: 10, -1 para todos) |
| `/api/productos/buscar` | `q` | String | Término de búsqueda (requerido) |
| `/api/productos/buscar` | `negocioId` | Long | ID del negocio |
| `/api/productos/stock-bajo` | `threshold` | Integer | Umbral de stock (default: 10) |
| `/api/productos-delivery` | `negocioId` | Long | ID del negocio |
| `/api/productos-delivery` | `categoriaDeliveryId` | Long | ID de categoría delivery |
| `/api/productos-delivery` | `search` | String | Búsqueda por nombre |
| `/api/productos-delivery` | `page` | int | Número de página (default: 0) |
| `/api/productos-delivery` | `size` | int | Tamaño de página (default: 15) |
| `/api/categorias-delivery` | `negocioId` | Long | ID del negocio |

---

## 📋 Ejemplos de Uso

### Listar productos de una categoría

```bash
# Por nombre
GET /api/productos?categoria=bebidas

# Por ID
GET /api/productos?categoria=123
```

### Filtrar por rango de precios

```bash
GET /api/productos?minPrice=100&maxPrice=500
```

### Combinar categoría + precios

```bash
GET /api/productos?categoria=bebidas&minPrice=50&maxPrice=200
```

### Búsqueda de texto + categoría

```bash
GET /api/productos?q=coca&categoria=bebidas
```

### Filtrar por negocio

```bash
GET /api/productos?negocioId=5&categoria=lacteos
```

### Paginación personalizada

```bash
GET /api/productos?page=2&size=20&minPrice=100&maxPrice=1000
```

### Traer todos los productos (sin paginación)

```bash
GET /api/productos?size=-1
```

### Productos delivery por categoría

```bash
GET /api/productos-delivery?categoriaDeliveryId=45
```

### Productos delivery con búsqueda

```bash
GET /api/productos-delivery?search=pizza
```

### Combinar filtros en delivery

```bash
GET /api/productos-delivery?negocioId=2&categoriaDeliveryId=10&search=hamburguesa
```

---

## 📝 Notas para Frontend

1. **Paginación**: Los endpoints de listado devuelven `Page<T>` con estructura:
   ```json
   {
     "content": [...],
     "totalElements": 100,
     "totalPages": 10,
     "size": 10,
     "number": 0
   }
   ```

2. **Respuesta estándar**: Todos los endpoints devuelven `ApiResponse<T>`:
   ```json
   {
     "success": true,
     "data": {...},
     "message": "Operación exitosa"
   }
   ```

3. **Filtros opcionales**: Todos los parámetros de query son opcionales a menos que se indique lo contrario.

4. **Búsqueda**: El parámetro `q` en `/api/productos` busca por nombre, código de barras o descripción.

5. **Size = -1**: Para traer todos los resultados sin paginación, usar `size=-1`.
