// src/components/TestStyles.tsx
export function TestStyles() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Título con gradiente */}
        <h1 className="text-5xl font-bold gradient-text text-center animate-fade-in">MyBandLab</h1>

        {/* Grid de colores */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary-500 p-4 rounded-lg text-center">Primary</div>
          <div className="bg-secondary-500 p-4 rounded-lg text-center">Secondary</div>
          <div className="bg-accent-500 p-4 rounded-lg text-center">Accent</div>
        </div>

        {/* Tarjetas */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-dark-surface rounded-xl p-6 border border-dark-border hover:border-primary-500 transition-all duration-300">
            <h3 className="text-xl font-semibold gradient-text mb-2">Artistas</h3>
            <p className="text-dark-text-secondary">Descubre nuevos talentos musicales</p>
          </div>

          <div className="bg-dark-surface rounded-xl p-6 border border-dark-border hover:border-primary-500 transition-all duration-300">
            <h3 className="text-xl font-semibold gradient-text mb-2">Grupos</h3>
            <p className="text-dark-text-secondary">Encuentra tu banda ideal</p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 flex-wrap">
          <button className="px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg transition-all duration-200">
            Botón Primario
          </button>
          <button className="px-6 py-2 bg-secondary-600 hover:bg-secondary-500 rounded-lg transition-all duration-200">
            Botón Secundario
          </button>
          <button className="px-6 py-2 border border-dark-border hover:border-primary-500 rounded-lg transition-all duration-200">
            Botón Outline
          </button>
        </div>
      </div>
    </div>
  );
}
