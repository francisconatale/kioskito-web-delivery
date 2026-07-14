import { Product } from "@/lib/data"
import { useHomeTab } from "./home/use-home-tab"
import { HomeHero } from "./home/home-hero"
import { PromoList } from "./home/promo-list"
import { CategoryList } from "./home/category-list"
import { ActivePromoBanner } from "./home/active-promo-banner"
import { ProductList } from "./home/product-list"
import { AddressModal } from "./home/address-modal"

interface HomeTabProps {
    onAddToCart: (product: Product) => void
    onAddMultipleToCart?: (items: { product: Product, quantity: number }[]) => void
    cartCount?: number
    onCheckout?: () => void
}

export function HomeTab({ onAddToCart, onAddMultipleToCart, cartCount = 0, onCheckout }: HomeTabProps) {
    const { state, actions } = useHomeTab();

    const handleAddToCartClick = (product: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const promo = actions.getPromoForProduct(product.id);
        const productToAdd = promo && promo.precioPromocional !== undefined
            ? { ...product, precioVenta: promo.precioPromocional }
            : product;
        onAddToCart(productToAdd);
        actions.setAddedProductId(product.id);
        setTimeout(() => {
            actions.setAddedProductId(null);
        }, 800);
    }

    return (
        <div className="pb-32 lg:pb-8 selection:bg-primary/20 bg-primary-100 min-h-screen font-sans relative overflow-x-hidden">
            <HomeHero 
                user={state.user}
                displayAddress={state.displayAddress}
                cartCount={cartCount}
                searchQuery={state.searchQuery}
                onOpenAddressModal={actions.handleOpenAddressModal}
                onCheckout={onCheckout || (() => {})}
                onSearchChange={actions.setSearchQuery}
                onSearchSubmit={actions.handleSearch}
                onSearchClear={actions.clearSearch}
            />

            <div className="max-w-md mx-auto px-5 pt-4">
                {!state.loadingPromos && state.promotions.length > 0 && state.searchQuery === "" && state.selectedCategory === "all" && (
                    <PromoList 
                        promotions={state.promotions}
                        addingPromoId={state.addingPromoId}
                        onPromoClick={actions.handlePromoClick}
                    />
                )}

                {!state.selectedPromo && (
                    <CategoryList 
                        categories={state.categories}
                        selectedCategory={state.selectedCategory}
                        onSelectCategory={actions.setSelectedCategory}
                    />
                )}

                <ActivePromoBanner 
                    selectedPromo={state.selectedPromo}
                    onClearPromo={() => actions.setSelectedPromo(null)}
                    onAddMultipleToCart={onAddMultipleToCart}
                />

                <ProductList 
                    products={state.products}
                    searchQuery={state.searchQuery}
                    submittedSearchQuery={state.submittedSearchQuery}
                    selectedPromo={state.selectedPromo}
                    loading={state.loadingProducts}
                    hasMore={state.hasMore}
                    loadingMore={state.loadingMore}
                    addedProductId={state.addedProductId}
                    getPromoForProduct={actions.getPromoForProduct}
                    onAddToCart={handleAddToCartClick}
                    onLoadMore={actions.loadMore}
                />
            </div>

            <AddressModal 
                isOpen={state.isAddressModalOpen}
                onOpenChange={actions.setIsAddressModalOpen}
                loadingAddresses={state.loadingAddresses}
                addresses={state.addresses}
                activeAddress={state.activeAddress}
                newAddress={state.newAddress}
                onSelectAddress={actions.handleSelectAddress}
                onAddAddress={actions.handleAddAddress}
                onNewAddressChange={actions.setNewAddress}
            />
        </div>
    )
}
