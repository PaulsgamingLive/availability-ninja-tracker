
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
  // Proxy API endpoint for web scraping - helps bypass CORS restrictions
  private static PROXY_API = "https://api.allorigins.win/raw?url=";
  
  static async scrapeProductPrices(productId: string, productName: string): Promise<ScrapingResult> {
    console.log(`Scraping prices for ${productName} (ID: ${productId})...`);
    
    try {
      // Create an array to store real scraped prices
      const scrapedPrices: ProductPrice[] = [];
      
      // Process each retailer
      for (const retailer of retailers) {
        try {
          // Construct search URL based on retailer and product name
          const searchQuery = encodeURIComponent(productName.replace(/\s+/g, '+'));
          const searchUrl = this.getRetailerSearchUrl(retailer.id, searchQuery);
          
          if (!searchUrl) continue;
          
          // Use proxy to fetch the page content
          const proxyUrl = `${this.PROXY_API}${encodeURIComponent(searchUrl)}`;
          console.log(`Fetching from: ${searchUrl} via proxy`);
          
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          if (!response.ok) {
            console.warn(`Failed to fetch from ${retailer.name}: ${response.statusText}`);
            continue;
          }
          
          const html = await response.text();
          
          // Extract price and stock status from the HTML
          const { price, status } = await this.extractPriceAndStatus(html, retailer.id);
          
          if (price > 0) {
            scrapedPrices.push({
              retailerId: retailer.id,
              price: price,
              currency: 'GBP',
              status: status,
              lastUpdated: new Date().toISOString(),
              url: searchUrl
            });
            console.log(`Found price at ${retailer.name}: £${price}, Status: ${status}`);
          } else {
            console.log(`No valid price found at ${retailer.name}`);
          }
        } catch (retailerError) {
          console.error(`Error scraping from ${retailer.name}:`, retailerError);
          // Continue with other retailers even if one fails
        }
      }
      
      if (scrapedPrices.length === 0) {
        return {
          success: false,
          message: "Couldn't find any prices for this product",
          prices: []
        };
      }
      
      console.log(`Successfully scraped ${scrapedPrices.length} prices for ${productName}`);
      
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
  
  // Helper to get the search URL for a specific retailer
  private static getRetailerSearchUrl(retailerId: string, searchQuery: string): string {
    switch (retailerId) {
      case "amazon":
        return `https://www.amazon.co.uk/s?k=${searchQuery}`;
      case "currys":
        return `https://www.currys.co.uk/search?q=${searchQuery}`;
      case "scan":
        return `https://www.scan.co.uk/search?q=${searchQuery}`;
      case "overclockers":
        return `https://www.overclockers.co.uk/search?sSearch=${searchQuery}`;
      case "awdit":
        return `https://www.awd-it.co.uk/catalogsearch/result/?q=${searchQuery}`;
      case "novatech":
        return `https://www.novatech.co.uk/search/?q=${searchQuery}`;
      default:
        return "";
    }
  }
  
  // Extract price and stock status from HTML based on retailer-specific selectors
  private static async extractPriceAndStatus(html: string, retailerId: string): Promise<{ price: number, status: StockStatus }> {
    // Create a DOM parser to extract data from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    let price = 0;
    let status: StockStatus = "UNKNOWN";
    
    // Retailer-specific selectors
    switch (retailerId) {
      case "amazon":
        // Amazon price extraction
        const amazonPriceElement = doc.querySelector('.a-price-whole');
        const amazonFractionElement = doc.querySelector('.a-price-fraction');
        
        if (amazonPriceElement && amazonFractionElement) {
          const wholePart = amazonPriceElement.textContent?.replace(/[^0-9]/g, '') || '0';
          const fractionPart = amazonFractionElement.textContent?.replace(/[^0-9]/g, '') || '00';
          price = parseFloat(`${wholePart}.${fractionPart}`);
          
          // Check stock status
          const availabilityElement = doc.querySelector('#availability');
          if (availabilityElement) {
            const text = availabilityElement.textContent?.toLowerCase() || '';
            if (text.includes('in stock')) {
              status = "IN_STOCK";
            } else if (text.includes('limited')) {
              status = "LIMITED_STOCK";
            } else if (text.includes('out of stock') || text.includes('unavailable')) {
              status = "OUT_OF_STOCK";
            }
          }
        }
        break;
        
      case "currys":
        // Currys price extraction
        const currysPriceElement = doc.querySelector('.product-price');
        if (currysPriceElement) {
          const priceText = currysPriceElement.textContent?.replace(/[^0-9.]/g, '') || '0';
          price = parseFloat(priceText);
          
          // Check stock status
          const stockElement = doc.querySelector('.stock-message');
          if (stockElement) {
            const text = stockElement.textContent?.toLowerCase() || '';
            if (text.includes('in stock')) {
              status = "IN_STOCK";
            } else if (text.includes('limited')) {
              status = "LIMITED_STOCK";
            } else if (text.includes('out of stock')) {
              status = "OUT_OF_STOCK";
            }
          }
        }
        break;
        
      case "scan":
        // Scan price extraction
        const scanPriceElement = doc.querySelector('.price');
        if (scanPriceElement) {
          const priceText = scanPriceElement.textContent?.replace(/[^0-9.]/g, '') || '0';
          price = parseFloat(priceText);
          
          // Check stock status
          const stockElement = doc.querySelector('.stock-message');
          if (stockElement) {
            const text = stockElement.textContent?.toLowerCase() || '';
            if (text.includes('in stock')) {
              status = "IN_STOCK";
            } else if (text.includes('limited')) {
              status = "LIMITED_STOCK";
            } else if (text.includes('out of stock')) {
              status = "OUT_OF_STOCK";
            }
          }
        }
        break;
        
      case "overclockers":
        // Overclockers price extraction
        const ocukPriceElement = doc.querySelector('.price');
        if (ocukPriceElement) {
          const priceText = ocukPriceElement.textContent?.replace(/[^0-9.]/g, '') || '0';
          price = parseFloat(priceText);
          
          // Check stock status
          const stockElement = doc.querySelector('.stock-availability-status');
          if (stockElement) {
            const text = stockElement.textContent?.toLowerCase() || '';
            if (text.includes('in stock')) {
              status = "IN_STOCK";
            } else if (text.includes('low stock')) {
              status = "LIMITED_STOCK";
            } else if (text.includes('out of stock') || text.includes('pre-order')) {
              status = "OUT_OF_STOCK";
            }
          }
        }
        break;
        
      case "awdit":
        // AWD-IT price extraction
        const awdPriceElement = doc.querySelector('.price');
        if (awdPriceElement) {
          const priceText = awdPriceElement.textContent?.replace(/[^0-9.]/g, '') || '0';
          price = parseFloat(priceText);
          
          // Check stock status
          const stockElement = doc.querySelector('.availability');
          if (stockElement) {
            const text = stockElement.textContent?.toLowerCase() || '';
            if (text.includes('in stock')) {
              status = "IN_STOCK";
            } else if (text.includes('low stock')) {
              status = "LIMITED_STOCK";
            } else if (text.includes('out of stock')) {
              status = "OUT_OF_STOCK";
            }
          }
        }
        break;
        
      case "novatech":
        // Novatech price extraction
        const novatechPriceElement = doc.querySelector('.current-price');
        if (novatechPriceElement) {
          const priceText = novatechPriceElement.textContent?.replace(/[^0-9.]/g, '') || '0';
          price = parseFloat(priceText);
          
          // Check stock status
          const stockElement = doc.querySelector('.availability');
          if (stockElement) {
            const text = stockElement.textContent?.toLowerCase() || '';
            if (text.includes('in stock')) {
              status = "IN_STOCK";
            } else if (text.includes('low stock')) {
              status = "LIMITED_STOCK";
            } else if (text.includes('out of stock')) {
              status = "OUT_OF_STOCK";
            }
          }
        }
        break;
    }
    
    return { price, status };
  }
}
