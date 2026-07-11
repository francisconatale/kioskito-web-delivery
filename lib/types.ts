export interface ProductoMinimalDTO {
  id: number;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
}

export interface CategoriaDeliveryDTO {
  id: number;
  uuid: string;
  nombre: string;
  orden: number;
  iconoImagen: string;
  estiloVisual: string;
}
