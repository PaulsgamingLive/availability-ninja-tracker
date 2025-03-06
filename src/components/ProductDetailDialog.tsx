
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, ProductPrice } from "@/types/product";
import { retailers } from "@/data/retailers";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatRelativeTime } from "@/utils/stockUtils";
import StockStatusBadge from "./StockStatusBadge";
import { ExternalLink, RefreshCw } from 'lucide-react';

interface ProductDetailDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailDialog = ({ product, isOpen, onClose }: ProductDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState('availability');

  if (!product) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-secondary/50 rounded-lg p-4 flex items-center justify-center md:col-span-1">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-48 object-contain" 
            />
          </div>

          <div className="md:col-span-2">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{product.brand} {product.model}</p>
                <h2 className="text-xl font-bold">{product.name}</h2>
              </div>
              
              <p className="text-sm">{product.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <div className="bg-secondary/50 px-3 py-1 rounded-full text-xs">
                  {product.category}
                </div>
                <div className="bg-secondary/50 px-3 py-1 rounded-full text-xs">
                  {product.brand}
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
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
            
            <div className="grid gap-3">
              {product.prices.map((price, idx) => (
                <RetailerStockInfo 
                  key={idx} 
                  price={price} 
                  retailerName={retailers.find(r => r.id === price.retailerId)?.name || 'Unknown'} 
                />
              ))}
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
