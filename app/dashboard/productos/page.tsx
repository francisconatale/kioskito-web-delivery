"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, Edit2, X, Save, Plus, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function ProductosDeliveryPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [posSearch, setPosSearch] = useState("");
  const [posProducts, setPosProducts] = useState<any[]>([]);
  const [posCategorias, setPosCategorias] = useState<any[]>([]);
  const [selectedPosCategory, setSelectedPosCategory] = useState("");
  const [posLoading, setPosLoading] = useState(false);

  // Bulk Add state
  const [selectedPosProducts, setSelectedPosProducts] = useState<number[]>([]);
  const [isBulkConfigModalOpen, setIsBulkConfigModalOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalData, setModalData] = useState({
    mostrarEnApp: true,
    categoriaDeliveryId: "",
    precioVenta: 0,
    descripcion: ""
  });

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const fetchDeliveryData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        apiClient.get('/productos-delivery', { params: { negocioId: 1 } }), // Trae solo los de delivery
        apiClient.get('/categorias-delivery', { params: { negocioId: 1 } })
      ]);
      const pData = prodRes.data;
      const cData = catRes.data;
      
      setProductos(Array.isArray(pData) ? pData : (pData?.content || (pData as any)?.data || []));
      setCategorias(Array.isArray(cData) ? cData : (cData?.content || (cData as any)?.data || []));
    } catch (error) {
      console.error("Error fetching delivery data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchDelivery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (val.length > 2) {
      try {
        const { data } = await apiClient.get('/productos-delivery', { params: { search: val, negocioId: 1 } });
        setProductos(Array.isArray(data) ? data : (data?.content || (data as any)?.data || []));
      } catch (err) {}
    } else if (val.length === 0) {
      fetchDeliveryData();
    }
  };

  // --- POS Search (Add Modal) ---
  const handleOpenAddModal = async () => {
    setIsAddModalOpen(true);
    setPosSearch("");
    setSelectedPosCategory("");
    setSelectedPosProducts([]);
    // Fetch initial POS products & categories
    try {
      setPosLoading(true);
      const [prodRes, catRes] = await Promise.all([
        apiClient.get('/productos', { params: { size: 15, negocioId: 1 } }),
        apiClient.get('/categoria')
      ]);
      const pData = prodRes.data;
      const cData = catRes.data;
      setPosProducts(Array.isArray(pData) ? pData : (pData?.content || (pData as any)?.data || []));
      setPosCategorias(Array.isArray(cData) ? cData : (cData?.content || (cData as any)?.data || []));
    } catch (err) {} finally {
      setPosLoading(false);
    }
  };

  const fetchPosProductsFiltered = async (searchStr: string, categoryId: string) => {
    try {
      setPosLoading(true);
      const params: any = { negocioId: 1, size: 15 };
      if (categoryId) params.categoria = categoryId;
      if (searchStr.length > 2) params.q = searchStr;

      // We use /productos as it supports both q and categoria
      const { data } = await apiClient.get('/productos', { params });
      setPosProducts(Array.isArray(data) ? data : (data?.content || (data as any)?.data || []));
    } catch (err) {} finally {
      setPosLoading(false);
    }
  };

  const handlePosSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPosSearch(val);
    if (val.length > 2 || val.length === 0) {
      fetchPosProductsFiltered(val, selectedPosCategory);
    }
  };

  const handlePosCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPosCategory(val);
    fetchPosProductsFiltered(posSearch, val);
  };

  // --- Config Modal ---
  const openConfigModal = (prod: any) => {
    setIsAddModalOpen(false); // Close add modal if open
    setSelectedProduct(prod);
    setModalData({
      mostrarEnApp: prod.mostrarEnApp ?? true, // Default true when opening config
      categoriaDeliveryId: prod.categoriaDeliveryId || "",
      precioVenta: prod.precioVenta?.parsedValue ?? prod.precioVenta ?? 0,
      descripcion: prod.descripcion || ""
    });
  };

  const closeConfigModal = () => {
    setSelectedProduct(null);
  };

  const handleSaveDelivery = async () => {
    if (!selectedProduct) return;
    try {
      setModalLoading(true);
      
      const payload: any = {
        mostrarEnApp: modalData.mostrarEnApp
      };
      
      if (modalData.categoriaDeliveryId) payload.categoriaDeliveryId = Number(modalData.categoriaDeliveryId);
      if (modalData.precioVenta) payload.precioVenta = Number(modalData.precioVenta);
      if (modalData.descripcion) payload.descripcion = modalData.descripcion;

      // El endpoint hace upsert (crea si no existe, actualiza si existe) en POST
      await apiClient.post(`/productos-delivery/${selectedProduct.id}`, payload);
      
      await fetchDeliveryData(); // Refresh the main list
      closeConfigModal();
    } catch (error) {
      console.error("Error saving delivery config:", error);
      alert("No se pudo guardar la configuración.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleRemoveFromDelivery = async (id: number) => {
    if (!confirm("¿Seguro que deseas quitar este producto de la app de delivery?")) return;
    try {
      await apiClient.delete(`/productos-delivery/${id}`);
      await fetchDeliveryData();
    } catch (error) {
      alert("Error al eliminar del delivery.");
    }
  };

  const handleBulkEnable = async () => {
    if (selectedPosProducts.length === 0) return;
    
    try {
      setBulkLoading(true);
      const payload = {
        productoIds: selectedPosProducts,
        mostrarEnApp: true,
        categoriaDeliveryId: bulkCategory ? Number(bulkCategory) : null
      };
      
      await apiClient.post('/productos-delivery/bulk', payload);
      
      toast.success("Se están configurando los productos en segundo plano. Los cambios se reflejarán en breve.");
      
      setSelectedPosProducts([]);
      setIsBulkConfigModalOpen(false);
      setIsAddModalOpen(false);
      
      setTimeout(() => {
        fetchDeliveryData();
      }, 1000);
      
    } catch (error) {
      console.error("Error bulk enable", error);
      toast.error("Ocurrió un problema enviando los datos.");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="w-full bg-neutral-50 min-h-screen font-sans text-sm flex flex-col relative">
      <header className="bg-white px-4 md:px-8 py-4 border-b border-neutral-200 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-5xl mx-auto gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/dashboard" className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-neutral-900 truncate">Productos en App</h1>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Agregar Producto
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar en el catálogo de delivery..." 
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-transparent focus:bg-white focus:border-neutral-200 rounded-xl text-sm outline-none transition-all"
                value={search}
                onChange={handleSearchDelivery}
              />
            </div>
          </div>
          
          <div className="divide-y divide-neutral-100 min-h-[400px]">
            {loading ? (
              <div className="p-8 text-center text-neutral-500">Cargando productos de delivery...</div>
            ) : productos.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">No tienes productos habilitados en la app.</div>
            ) : (
              productos.map(prod => {
                const isDeliveryActive = prod.mostrarEnApp;
                const price = prod.precioVenta?.parsedValue ?? prod.precioVenta ?? 0;
                
                return (
                  <div key={prod.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-neutral-50 transition-colors gap-4">
                    <div className="flex-1 pr-4">
                      <h4 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                        {prod.nombre}
                        {isDeliveryActive ? (
                          <span className="bg-success-100 text-success-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Visible</span>
                        ) : (
                          <span className="bg-neutral-100 text-neutral-500 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Oculto</span>
                        )}
                      </h4>
                      <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-neutral-500 font-medium">
                        <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded">${price}</span>
                        {prod.categoriaDeliveryNombre && (
                          <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{prod.categoriaDeliveryNombre}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button 
                        onClick={() => openConfigModal(prod)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button 
                        onClick={() => handleRemoveFromDelivery(prod.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* 1. Modal: Seleccionar producto del POS para agregarlo */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh] max-h-[600px]">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-neutral-900">Agregar al Delivery</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-neutral-100 bg-neutral-50 shrink-0 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Buscar en el catálogo general (POS)..." 
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                  value={posSearch}
                  onChange={handlePosSearch}
                  autoFocus
                />
              </div>
              <div className="sm:w-48 shrink-0">
                <select 
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2.5 outline-none text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                  value={selectedPosCategory}
                  onChange={handlePosCategoryChange}
                >
                  <option value="">Todas las categorías</option>
                  {posCategorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre || c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 divide-y divide-neutral-100">
              {(() => {
                const existingProductIds = new Set(productos.map(p => p.id));
                const filteredPosProducts = posProducts.filter(p => !existingProductIds.has(p.id));

                if (posLoading) return <div className="text-center text-neutral-500 py-8">Buscando productos...</div>;
                if (filteredPosProducts.length === 0) return <div className="text-center text-neutral-500 py-8">No se encontraron productos disponibles en el POS.</div>;
                
                return filteredPosProducts.map(prod => (
                  <div key={prod.id} className="py-3 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-neutral-300 accent-blue-600 cursor-pointer"
                        checked={selectedPosProducts.includes(prod.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPosProducts([...selectedPosProducts, prod.id]);
                          } else {
                            setSelectedPosProducts(selectedPosProducts.filter(id => id !== prod.id));
                          }
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm">{prod.nombre}</h4>
                        <div className="text-xs text-neutral-500 mt-0.5">${prod.precioVenta?.parsedValue ?? prod.precioVenta ?? 0} • Stock: {prod.stock?.parsedValue ?? prod.stock ?? 'N/A'}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => openConfigModal(prod)}
                      className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    >
                      Configurar
                    </button>
                  </div>
                ));
              })()}
            </div>

            {/* Floating Bulk Action Bar */}
            {selectedPosProducts.length > 0 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-[65] animate-in slide-in-from-bottom-4">
                <span className="font-bold text-sm whitespace-nowrap">{selectedPosProducts.length} seleccionados</span>
                <button 
                  onClick={() => setIsBulkConfigModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full text-sm font-bold transition-colors whitespace-nowrap"
                >
                  Habilitar en Delivery
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Modal: Configurar Delivery (Upsert) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 truncate pr-4">Delivery: {selectedProduct.nombre}</h2>
              <button onClick={closeConfigModal} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <label className="flex items-center justify-between p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <div>
                  <div className="font-bold text-neutral-900">Visible en la App</div>
                  <div className="text-xs text-neutral-500">Los clientes podrán pedir este producto</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={modalData.mostrarEnApp}
                  onChange={(e) => setModalData({...modalData, mostrarEnApp: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded border-neutral-300 focus:ring-blue-500"
                />
              </label>

              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-1.5">Categoría (App)</label>
                <select 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 outline-none text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  value={modalData.categoriaDeliveryId}
                  onChange={(e) => setModalData({...modalData, categoriaDeliveryId: e.target.value})}
                >
                  <option value="">Sin categoría asignada...</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre || c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-1.5">Precio diferenciado (App)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono">$</span>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-7 pr-3 py-2 outline-none text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    value={modalData.precioVenta}
                    onChange={(e) => setModalData({...modalData, precioVenta: Number(e.target.value)})}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">Precio base en POS: ${(selectedProduct.precioVenta?.parsedValue ?? selectedProduct.precioVenta ?? 0)}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-1.5">Descripción (Opcional)</label>
                <textarea 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 outline-none text-sm h-20 resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="Ej. Alfajor de chocolate con extra dulce de leche..."
                  value={modalData.descripcion}
                  onChange={(e) => setModalData({...modalData, descripcion: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
              <button 
                onClick={closeConfigModal}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveDelivery}
                disabled={modalLoading}
                className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {modalLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Bulk Config */}
      {isBulkConfigModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Habilitar múltiples productos</h2>
              <button onClick={() => setIsBulkConfigModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm font-medium border border-amber-200">
                Estás por publicar {selectedPosProducts.length} productos en la aplicación de delivery.
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-1.5">Categoría (Opcional)</label>
                <select 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 outline-none text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                >
                  <option value="">Sin categoría asignada...</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre || c.name}</option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 mt-1">Todos los productos seleccionados se asignarán a esta categoría.</p>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsBulkConfigModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleBulkEnable}
                disabled={bulkLoading}
                className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {bulkLoading ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
