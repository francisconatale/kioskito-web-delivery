"use client"
import React from 'react';
import { adminMenu, adminStats } from './data';
import { LayoutDashboard, Package, ListTree, Clock, Settings, ArrowUpRight, TrendingUp, Menu, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, any> = { LayoutDashboard, Package, ListTree, Clock, Settings };

export default function DashboardHome() {
  return (
    <div className="w-full bg-neutral-100 min-h-screen flex flex-col font-sans text-sm">
      
      {/* Top Bar Minimal */}
      <header className="bg-white px-4 md:px-8 py-4 flex justify-between items-center border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-display font-black text-xl text-primary-700">Kioskito Admin</div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 hidden sm:block">Ir a la tienda</Link>
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">F</div>
        </div>
      </header>

      {/* Main Dashboard View */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">Resumen Operativo</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-neutral-200">
              <p className="text-neutral-500 font-medium mb-1 text-xs md:text-sm">Pedidos Hoy</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl md:text-3xl font-black text-neutral-900">{adminStats.ordersToday}</span>
                <span className="text-success-600 flex items-center text-xs md:text-sm font-bold bg-success-50 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3 mr-1"/> +12%</span>
              </div>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-neutral-200">
              <p className="text-neutral-500 font-medium mb-1 text-xs md:text-sm">Estado Kiosco</p>
              <div className="flex items-end gap-3">
                <span className="text-xl md:text-2xl font-bold text-success-600 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-success-500 animate-pulse"></span> {adminStats.status}
                </span>
              </div>
            </div>
            <div className="bg-primary-700 p-5 md:p-6 rounded-2xl shadow-sm text-white sm:col-span-2 md:col-span-1">
              <p className="text-primary-200 font-medium mb-1 text-xs md:text-sm">Catálogo Activo</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl md:text-3xl font-black">{adminStats.activeProducts}</span>
                <span className="text-primary-200 font-medium text-xs md:text-sm">productos</span>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-neutral-900 mb-4">Módulos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adminMenu.filter(m => m.id !== 'dashboard').map(item => {
              const Icon = iconMap[item.icon];
              return (
                <Link key={item.id} href={item.href} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group block">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-neutral-900">{item.name}</h3>
                  <p className="text-neutral-500 mt-1 text-xs md:text-sm">Gestiona {item.name.toLowerCase()} y preferencias asociadas.</p>
                </Link>
              )
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
