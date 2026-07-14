interface CategoryListProps {
    categories: any[];
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
}

export function CategoryList({ categories, selectedCategory, onSelectCategory }: CategoryListProps) {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
                <h2 className="font-display font-bold text-xl text-neutral-900">Categorías</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                <div 
                    onClick={() => onSelectCategory("all")}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${selectedCategory === "all" ? 'bg-primary-700 text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'}`}
                >
                    Todas
                </div>
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id.toString();
                    return (
                        <div 
                            key={cat.id} 
                            onClick={() => onSelectCategory(cat.id.toString())}
                            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${isSelected ? 'bg-primary-700 text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'}`}
                        >
                            {cat.nombre}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
