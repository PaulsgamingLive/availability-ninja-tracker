
import { toast } from "@/hooks/use-toast";
import { ProductPrice, Retailer, StockStatus } from "@/types/product";
import { retailers } from "@/data/retailers";

interface ScrapingResult {
  success: boolean;
  message: string;
  prices?: ProductPrice[];
  error?: string;
}

export class PriceScraperService {
  // In a real application, this would be a backend API call
  // Currently using mock data with simulated network delay
  static async scrapeProductPrices(productId: string, productName: string): Promise<ScrapingResult> {
    console.log(`Scraping prices for ${productName} (ID: ${productId})...`);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random prices for each retailer (simulation)
      const scrapedPrices: ProductPrice[] = retailers.map(retailer => {
        // Generate a random price within a plausible range, varying by retailer
        const basePrice = this.getBasePrice(productName);
        const retailerVariance = this.getRetailerVariance(retailer.id);
        const randomFactor = 0.95 + (Math.random() * 0.15); // ±7.5% variance
        
        const price = Math.round(basePrice * retailerVariance * randomFactor);
        
        // Randomize stock status with weighted probability
        const status = this.getRandomStockStatus(retailer.id);
        
        return {
          retailerId: retailer.id,
          price: price,
          currency: 'GBP',
          status: status,
          lastUpdated: new Date().toISOString(),
          url: `${retailer.url}/product/${productId}`
        };
      });
      
      console.log(`Successfully scraped prices for ${productName}:`, scrapedPrices);
      
      return {
        success: true,
        message: `Found ${scrapedPrices.length} prices for ${productName}`,
        prices: scrapedPrices
      };
    } catch (error) {
      console.error("Error scraping prices:", error);
      return {
        success: false,
        message: "Failed to scrape prices",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  // Helper method to get a base price for a product based on its name
  private static getBasePrice(productName: string): number {
    if (productName.includes("9070 XT")) return 1450;
    if (productName.includes("9070")) return 1250;
    if (productName.includes("4090")) return 1800;
    if (productName.includes("4080")) return 1200;
    if (productName.includes("4070")) return 850;
    if (productName.includes("7900 XTX")) return 1000;
    if (productName.includes("7900 XT")) return 900;
    if (productName.includes("7800 XT")) return 550;
    if (productName.includes("7700 XT")) return 480;
    if (productName.includes("Core i9")) return 600;
    if (productName.includes("Ryzen 9")) return 590;
    if (productName.includes("ROG Maximus")) return 600;
    if (productName.includes("Trident Z5")) return 200;
    if (productName.includes("Samsung 990")) return 190;
    if (productName.includes("NZXT H9")) return 230;
    if (productName.includes("RM1000x")) return 200;
    return 500; // Default price
  }
  
  // Simulate different pricing strategies by retailer
  private static getRetailerVariance(retailerId: string): number {
    switch (retailerId) {
      case "amazon": return 1.02; // Slightly higher
      case "currys": return 1.05; // Higher
      case "scan": return 0.98;   // Slightly lower
      case "overclockers": return 1.00; // Average
      case "awdit": return 0.96;  // Lower
      case "novatech": return 0.99; // Slightly lower
      default: return 1.00;
    }
  }
  
  // Generate random stock status with retailer-specific weighting
  private static getRandomStockStatus(retailerId: string): StockStatus {
    const rand = Math.random();
    
    // Different retailers have different stock probabilities
    const inStockProbability = this.getInStockProbability(retailerId);
    const limitedStockProbability = this.getLimitedStockProbability(retailerId);
    
    if (rand < inStockProbability) return "IN_STOCK";
    if (rand < inStockProbability + limitedStockProbability) return "LIMITED_STOCK";
    return "OUT_OF_STOCK";
  }
  
  private static getInStockProbability(retailerId: string): number {
    switch (retailerId) {
      case "amazon": return 0.5;      // 50% chance of in stock
      case "currys": return 0.4;      // 40% chance
      case "scan": return 0.35;       // 35% chance
      case "overclockers": return 0.3; // 30% chance
      case "awdit": return 0.25;      // 25% chance
      case "novatech": return 0.3;    // 30% chance
      default: return 0.3;
    }
  }
  
  private static getLimitedStockProbability(retailerId: string): number {
    switch (retailerId) {
      case "amazon": return 0.2;      // 20% chance of limited stock
      case "currys": return 0.3;      // 30% chance
      case "scan": return 0.25;       // 25% chance
      case "overclockers": return 0.3; // 30% chance
      case "awdit": return 0.35;      // 35% chance
      case "novatech": return 0.3;    // 30% chance
      default: return 0.2;
    }
  }
}
