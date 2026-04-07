// src/components/TestStyles.tsx
import React from 'react'

export const TestStyles: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Título principal */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            MyBandLab
          </h1>
          <p className="text-text-secondary">
            Configuración de TailwindCSS completada ✅
          </p>
        </div>

        {/* Paleta de colores */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Paleta de Colores</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-primary-purple"></div>
              <p className="text-sm text-text-secondary text-center">Violeta<br/>#8B5CF6</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-primary-pink"></div>
              <p className="text-sm text-text-secondary text-center">Rosa<br/>#EC4899</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-primary-cyan"></div>
              <p className="text-sm text-text-secondary text-center">Cian<br/>#06B6D4</p>
            </div>
          </div>
        </div>

        {/* Gradientes */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Gradientes</h2>
          <div className="space-y-4">
            <div className="h-20 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-semibold">Gradiente Principal</span>
            </div>
            <div className="h-20 rounded-lg bg-gradient-card flex items-center justify-center">
              <span className="text-text-primary font-semibold">Gradiente Cards</span>
            </div>
          </div>
        </div>

        {/* Botones de prueba */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Componentes</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-primary-purple rounded-lg hover:bg-hover-purple transition">
              Botón Violeta
            </button>
            <button className="px-6 py-2 bg-primary-pink rounded-lg hover:bg-hover-pink transition">
              Botón Rosa
            </button>
            <button className="px-6 py-2 bg-primary-cyan rounded-lg hover:bg-hover-cyan transition">
              Botón Cian
            </button>
            <button className="px-6 py-2 bg-gradient-primary rounded-lg hover:opacity-90 transition hover-glow">
              Botón Gradiente
            </button>
          </div>
        </div>

        {/* Cards de prueba */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-card backdrop-blur-sm border border-border rounded-xl p-6 hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gradient">Card con Gradiente</h3>
            <p className="text-text-secondary mt-2">
              Esta card tiene efecto hover y gradiente de fondo
            </p>
          </div>
          <div className="bg-gradient-card backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-gradient-hover hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white">Card con Hover</h3>
            <p className="text-text-secondary mt-2">
              Al hacer hover cambia a gradiente principal
            </p>
          </div>
        </div>

        {/* Textos de prueba */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Tipografía</h2>
          <div className="space-y-2">
            <p className="text-text-primary">Texto principal - Blanco</p>
            <p className="text-text-secondary">Texto secundario - Gris</p>
            <p className="text-gradient">Texto con gradiente</p>
          </div>
        </div>
      </div>
    </div>
  )
}