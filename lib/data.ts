export type Product = {
    id: number
    nombre: string
    descripcion: string
    precioVenta: number
    categoria: string
    image?: string
}

export type CartItem = {
    id: number
    name: string
    price: number
    quantity: number
}

export const CATEGORIES = [
    { id: "all", name: "Todos", icon: "🍽️" },
    { id: "GOLOSINAS", name: "Golosinas", icon: "🍬" },
    { id: "BEBIDAS", name: "Bebidas", icon: "🥤" },
    { id: "SNACKS", name: "Snacks", icon: "🥨" },
    { id: "TABACO", name: "Tabaco", icon: "🚬" },
    { id: "ALMACEN", name: "Almacen", icon: "🛒" },
]
