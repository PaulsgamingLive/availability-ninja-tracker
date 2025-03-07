
import { useState, useEffect } from "react";
import { mockProducts } from "@/data/mockProducts";
import { Product, ProductFilter } from "@/types/product";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import EmptyState from "@/components/EmptyState";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<ProductFilter>({
    search: "",
    category: null,
    brand: null,
    inStockOnly: false,
  });

  useEffect(() => {
    // Simulate loading data - filter for UK prices only
    const timer = setTimeout(() => {
      // Filter products to only include UK prices (GBP currency)
      const ukProducts = mockProducts.map(product => ({
        ...product,
        prices: product.prices.filter(price => price.currency === 'GBP')
      }));
      
      setProducts(ukProducts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter((product) => {
    // Text search filter
    if (
      filter.search &&
      !product.name.toLowerCase().includes(filter.search.toLowerCase()) &&
      !product.brand.toLowerCase().includes(filter.search.toLowerCase()) &&
      !product.description.toLowerCase().includes(filter.search.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (filter.category && product.category !== filter.category) {
      return false;
    }

    // Brand filter
    if (filter.brand && product.brand !== filter.brand) {
      return false;
    }

    // In stock only filter
    if (
      filter.inStockOnly &&
      !product.prices.some(
        (price) => price.status === "IN_STOCK" || price.status === "LIMITED_STOCK"
      )
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <Header 
        searchQuery={filter.search} 
        setSearchQuery={(search) => setFilter({ ...filter, search })} 
      />
      
      <main className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
          <FilterSidebar filter={filter} onChange={setFilter} />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Available Products</h2>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
                <span className="ml-2 text-xs">(GBP)</span>
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-80 bg-secondary/40 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState 
                message="No products found" 
                description="Try changing your filters or search query to find what you're looking for."
                action={{
                  label: "Reset Filters",
                  onClick: () => setFilter({
                    search: "",
                    category: null,
                    brand: null,
                    inStockOnly: false,
                  }),
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
