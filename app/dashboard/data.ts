export const adminStats = {
  activeProducts: 145,
  categories: 8,
  status: "Abierto",
  ordersToday: 24
};

export const adminMenu = [
  { id: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
  { id: 'products', name: 'Productos', icon: 'Package', href: '/dashboard/productos' },
  { id: 'categories', name: 'Categorías', icon: 'ListTree', href: '/dashboard/categorias' },
  { id: 'hours', name: 'Horarios', icon: 'Clock', href: '/dashboard/horarios' },
  { id: 'settings', name: 'Configuración', icon: 'Settings', href: '/dashboard/configuracion' }
];

export const mockContent = {
  products: [
    { id: 1, name: "Coca Cola 2.25L", price: 2500, stock: 12, visible: true },
    { id: 2, name: "Lays Clásicas", price: 1800, stock: 5, visible: true },
    { id: 3, name: "Alfajor Jorgito", price: 500, stock: 0, visible: false },
  ]
};
