export type Product = {
    id: number
    name: string
    description: string
    price: number
    category: string
    image: string
}

export type CartItem = {
    id: number
    name: string
    price: number
    quantity: number
}

export const CATEGORIES = [
    { id: "all", name: "Todos", icon: "🍽️" },
    { id: "bowls", name: "Bowls", icon: "🥗" },
    { id: "drinks", name: "Bebidas", icon: "🥤" },
    { id: "wraps", name: "Wraps", icon: "🌯" },
    { id: "desserts", name: "Postres", icon: "🍨" },
]

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Bowl de Proteína",
        description: "Quinoa, pollo, aguacate y vegetales",
        price: 12.99,
        category: "bowls",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=300&auto=format&fit=crop",
    },
    {
        id: 2,
        name: "Smoothie Verde",
        description: "Espinaca, manzana y pepino",
        price: 6.99,
        category: "drinks",
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=400&h=300&auto=format&fit=crop",
    },
    {
        id: 3,
        name: "Ensalada Mediterránea",
        description: "Lechuga, tomate, aceitunas y feta",
        price: 10.99,
        category: "bowls",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&h=300&auto=format&fit=crop",
    },
    {
        id: 4,
        name: "Bowl de Salmón",
        description: "Arroz, salmón, aguacate y edamame",
        price: 14.99,
        category: "bowls",
        image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?q=80&w=400&h=300&auto=format&fit=crop",
    },
    {
        id: 5,
        name: "Wrap de Pollo",
        description: "Tortilla integral con pollo y verduras",
        price: 9.99,
        category: "wraps",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=400&h=300&auto=format&fit=crop",
    },
    {
        id: 6,
        name: "Açaí Bowl",
        description: "Açaí con granola y frutas frescas",
        price: 8.99,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=400&h=300&auto=format&fit=crop",
    },
]
