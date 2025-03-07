
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, ProductPrice } from "@/types/product";
import { retailers } from "@/data/retailers";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatRelativeTime } from "@/utils/stockUtils";
import StockStatusBadge from "./StockStatusBadge";
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { PriceScraperService } from '@/services/PriceScraperService';
import { toast } from "@/hooks/use-toast";

interface ProductDetailDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailDialog = ({ product, isOpen, onClose }: ProductDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState('availability');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingError, setScrapingError] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // When the product prop changes, update our local state
  if (product && (!currentProduct || product.id !== currentProduct.id)) {
    setCurrentProduct(product);
    // Reset error state on new product
    setScrapingError(null);
  }

  if (!currentProduct) {
    return null;
  }

  const handleRefreshPrices = async () => {
    if (!currentProduct || isLoading) return;
    
    setIsLoading(true);
    setScrapingError(null);
    
    toast({
      title: "Scraping prices...",
      description: `Getting latest prices for ${currentProduct.name}`,
      duration: 3000,
    });
    
    try {
      const result = await PriceScraperService.scrapeProductPrices(
        currentProduct.id, 
        currentProduct.name
      );
      
      if (result.success && result.prices && result.prices.length > 0) {
        // Update our local copy of the product with the new prices
        setCurrentProduct({
          ...currentProduct,
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
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{currentProduct.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-secondary/50 rounded-lg p-4 flex items-center justify-center md:col-span-1">
            <img 
              src={currentProduct.image} 
              alt={currentProduct.name} 
              className="max-h-48 object-contain" 
            />
          </div>

          <div className="md:col-span-2">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{currentProduct.brand} {currentProduct.model}</p>
                <h2 className="text-xl font-bold">{currentProduct.name}</h2>
              </div>
              
              <p className="text-sm">{currentProduct.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <div className="bg-secondary/50 px-3 py-1 rounded-full text-xs">
                  {currentProduct.category}
                </div>
                <div className="bg-secondary/50 px-3 py-1 rounded-full text-xs">
                  {currentProduct.brand}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs 
          defaultValue="availability" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-6"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="availability" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Current Stock Status</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 h-8"
                onClick={handleRefreshPrices}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? "Updating..." : "Refresh Prices"}</span>
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
            
            <div className="grid gap-3">
              {currentProduct.prices.length > 0 ? (
                currentProduct.prices.map((price, idx) => (
                  <RetailerStockInfo 
                    key={`${price.retailerId}-${idx}`} 
                    price={price} 
                    retailerName={retailers.find(r => r.id === price.retailerId)?.name || 'Unknown'} 
                  />
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No price information available. Click "Refresh Prices" to check current prices.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="text-center py-8 text-muted-foreground">
              Price history chart will be implemented in a future update.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface RetailerStockInfoProps {
  price: ProductPrice;
  retailerName: string;
}

const RetailerStockInfo = ({ price, retailerName }: RetailerStockInfoProps) => {
  return (
    <div className="flex justify-between items-center border border-border p-3 rounded-lg">
      <div className="flex flex-col">
        <span className="font-medium">{retailerName}</span>
        <div className="flex items-center gap-2 mt-1">
          <StockStatusBadge status={price.status} size="sm" />
          <span className="text-xs text-muted-foreground">
            Updated {formatRelativeTime(price.lastUpdated)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="font-bold">
          {formatCurrency(price.price, price.currency)}
        </span>
        
        <Button variant="outline" size="sm" asChild className="gap-1 h-8">
          <a href={price.url} target="_blank" rel="noopener noreferrer">
            <span>View</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailDialog;
