
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { mockProducts } from "@/data/mockProducts";
import { Product, ProductPrice, StockStatus } from "@/types/product";
import { retailers } from "@/data/retailers";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatRelativeTime, getOverallStockStatus } from "@/utils/stockUtils";
import StockStatusBadge from "@/components/StockStatusBadge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, ChevronLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { PriceScraperService } from "@/services/PriceScraperService";
import { toast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from "@/components/EmptyState";

const ProductShowcase = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrapingPrices, setIsScrapingPrices] = useState(false);
  const [scrapingError, setScrapingError] = useState<string | null>(null);
  
  useEffect(() => {
    // Find the product in our mock data based on the ID
    const foundProduct = mockProducts.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    setLoading(false);
  }, [productId]);

  const handleRefreshPrices = async () => {
    if (!product || isScrapingPrices) return;
    
    setIsScrapingPrices(true);
    setScrapingError(null);
    
    toast({
      title: "Scraping prices...",
      description: `Getting latest prices for ${product.name}`,
      duration: 3000,
    });
    
    try {
      const result = await PriceScraperService.scrapeProductPrices(
        product.id, 
        product.name
      );
      
      if (result.success && result.prices && result.prices.length > 0) {
        // Update our local copy of the product with the new prices
        setProduct({
          ...product,
          prices: result.prices
        });
        
        toast({
          title: "Prices updated",
          description: `Successfully fetched the latest prices from ${result.prices.length} retailers`,
          duration: 3000,
        });
      } else {
        const errorMessage = result.error || "No prices found. Retailers may have blocked scraping.";
        setScrapingError(errorMessage);
        toast({
          title: "Warning",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Error refreshing prices:", errorMessage);
      setScrapingError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsScrapingPrices(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-[600px] w-full flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState 
          message="Product not found" 
          description="The product you're looking for doesn't exist or has been removed."
          action={{
            label: "Back to Products",
            onClick: () => window.history.back(),
          }}
        />
      </div>
    );
  }

  const overallStatus = getOverallStockStatus(product.prices);
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="container mx-auto px-4 pt-6 pb-12">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image & Basic Info */}
          <div className="space-y-8">
            <div className="bg-secondary/50 rounded-xl p-8 flex items-center justify-center h-80">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-full object-contain"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Brand</span>
                  <div className="bg-secondary/50 px-3 py-1 rounded-full text-xs">
                    {product.brand}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <div className="bg-secondary/50 px-3 py-1 rounded-full text-xs">
                    {product.category}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Model</span>
                  <div className="bg-secondary/50 px-3 py-1 rounded-full text-xs">
                    {product.model}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details & Prices */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-3">
                    <StockStatusBadge status={overallStatus} size="lg" />
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground">{product.description}</p>
              
              <Separator className="my-6" />
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Current Prices & Availability</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleRefreshPrices}
                    disabled={isScrapingPrices}
                  >
                    <RefreshCw className={`h-4 w-4 ${isScrapingPrices ? 'animate-spin' : ''}`} />
                    <span>{isScrapingPrices ? "Updating..." : "Refresh Prices"}</span>
                  </Button>
                </div>
                
                {scrapingError && (
                  <div className="bg-destructive/10 border border-destructive/30 p-3 rounded-md flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive">Error Scraping Prices</h4>
                      <p className="text-sm text-muted-foreground">{scrapingError}</p>
                      <p className="text-xs mt-1">Note: Web scraping may be blocked by some retailers or require a backend service.</p>
                    </div>
                  </div>
                )}
                
                {product.prices.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">
                    No price information available. Click "Refresh Prices" to check current prices.
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {product.prices.map((price, idx) => (
                      <RetailerPriceCard 
                        key={`${price.retailerId}-${idx}`} 
                        price={price} 
                        retailerName={retailers.find(r => r.id === price.retailerId)?.name || 'Unknown'} 
                        retailerLogo={retailers.find(r => r.id === price.retailerId)?.logo}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="specifications" className="mt-8">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="price-history">Price History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specifications" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-medium">Technical Specifications</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-sm text-muted-foreground">Architecture</div>
                      <div className="text-sm">RDNA 4</div>
                      
                      <div className="text-sm text-muted-foreground">Memory</div>
                      <div className="text-sm">16GB GDDR7</div>
                      
                      <div className="text-sm text-muted-foreground">Memory Bus</div>
                      <div className="text-sm">256-bit</div>
                      
                      <div className="text-sm text-muted-foreground">Process Technology</div>
                      <div className="text-sm">4nm</div>
                      
                      <div className="text-sm text-muted-foreground">Power Consumption</div>
                      <div className="text-sm">220W</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="price-history" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      Price history charts will be implemented in a future update.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RetailerPriceCardProps {
  price: ProductPrice;
  retailerName: string;
  retailerLogo?: string;
}

const RetailerPriceCard = ({ price, retailerName, retailerLogo }: RetailerPriceCardProps) => {
  return (
    <div className="flex justify-between items-center border border-border p-4 rounded-lg hover:border-primary/60 transition-colors">
      <div className="flex items-center gap-3">
        {retailerLogo ? (
          <div className="w-16 h-10 flex items-center justify-center bg-white rounded p-1">
            <img src={retailerLogo} alt={retailerName} className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="w-16 h-10 flex items-center justify-center bg-secondary/70 rounded text-xs font-medium">
            {retailerName}
          </div>
        )}
        
        <div className="flex flex-col">
          <span className="font-medium">{retailerName}</span>
          <div className="flex items-center gap-2 mt-1">
            <StockStatusBadge status={price.status} size="sm" />
            <span className="text-xs text-muted-foreground">
              Updated {formatRelativeTime(price.lastUpdated)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-primary">
          {formatCurrency(price.price, price.currency)}
        </span>
        
        <Button variant="outline" size="sm" asChild className="gap-1 h-9">
          <a href={price.url} target="_blank" rel="noopener noreferrer">
            <span>View</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProductShowcase;
