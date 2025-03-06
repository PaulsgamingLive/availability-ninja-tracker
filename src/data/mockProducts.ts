import { Product, StockStatus } from "@/types/product";
import { retailers } from "./retailers";

// Helper function to generate a random price between min and max
const randomPrice = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to generate a random stock status with weighted probabilities
const randomStatus = (): StockStatus => {
  const rand = Math.random();
  if (rand < 0.3) return "IN_STOCK";
  if (rand < 0.7) return "OUT_OF_STOCK";
  if (rand < 0.9) return "LIMITED_STOCK";
  return "UNKNOWN";
};

// Generate a random date within the last 3 days
const randomDate = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 3);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  
  return now.toISOString();
};

export const categories = [
  "Graphics Cards",
  "Processors",
  "Motherboards",
  "Memory",
  "Storage",
  "Power Supplies",
  "Cases"
];

export const brands = [
  "NVIDIA",
  "AMD",
  "ASUS",
  "MSI",
  "EVGA",
  "Gigabyte",
  "Intel",
  "Corsair",
  "NZXT",
  "Cooler Master"
];

export const countries = [
  {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP'
  }
];

// Helper to generate prices for UK only
const generatePrices = (gbpMinPrice: number, gbpMaxPrice: number) => {
  return retailers.map(retailer => {
    const gbpPrice = randomPrice(gbpMinPrice, gbpMaxPrice);
    const status = randomStatus();
    const lastUpdated = randomDate();
    
    return {
      retailerId: retailer.id,
      price: gbpPrice,
      currency: 'GBP',
      status,
      lastUpdated,
      url: `${retailer.url}/product`
    };
  });
};

// Mock product data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "GeForce RTX 4090",
    brand: "NVIDIA",
    model: "Founders Edition",
    category: "Graphics Cards",
    image: "https://assets.nvidia.partners/images/p/4090/nvidia-geforce-rtx-4090-product-photo-001.png",
    description: "The NVIDIA GeForce RTX 4090 is the fastest GPU on the planet. It features 4th-gen Tensor Cores for DLSS and AI, 3rd-gen RT Cores for ray tracing, and NVIDIA Ada architecture.",
    prices: generatePrices(1600, 2000)
  },
  {
    id: "2",
    name: "GeForce RTX 4080",
    brand: "NVIDIA",
    model: "Founders Edition",
    category: "Graphics Cards",
    image: "https://m.media-amazon.com/images/I/61dYrUFeXrL.jpg",
    description: "The RTX 4080 delivers the ultra performance and features that enthusiast gamers and creators demand. Powered by the NVIDIA Ada Lovelace architecture.",
    prices: generatePrices(1100, 1300)
  },
  {
    id: "3",
    name: "GeForce RTX 4070 Ti",
    brand: "NVIDIA",
    model: "Founders Edition",
    category: "Graphics Cards",
    image: "https://m.media-amazon.com/images/I/71iKpn9OdGL.jpg",
    description: "The GeForce RTX 4070 Ti is built on the ultra-efficient NVIDIA Ada Lovelace architecture, delivering fast gaming performance and creation.",
    prices: generatePrices(800, 900)
  },
  {
    id: "4",
    name: "Radeon RX 7900 XTX",
    brand: "AMD",
    model: "Reference",
    category: "Graphics Cards",
    image: "https://www.amd.com/system/files/2022-11/1728141-amd-radeon-7900xtx-left-1260x709.png",
    description: "The AMD Radeon RX 7900 XTX graphics card, powered by AMD RDNA 3 architecture, delivers exceptional 4K gaming with AMD FSR.",
    prices: generatePrices(900, 1100)
  },
  {
    id: "5",
    name: "Radeon RX 7900 XT",
    brand: "AMD",
    model: "Reference",
    category: "Graphics Cards",
    image: "https://www.amd.com/system/files/2022-11/1728144-amd-radeon-7900xt-left-1260x709.png",
    description: "The AMD Radeon RX 7900 XT graphics card brings exceptional performance for 4K gaming with unparalleled visual fidelity.",
    prices: generatePrices(800, 950)
  },
  {
    id: "13",
    name: "Radeon RX 7800 XT",
    brand: "AMD",
    model: "Reference",
    category: "Graphics Cards",
    image: "https://www.amd.com/system/files/2023-08/rgb-7800-xt-angled-1260x709.png",
    description: "The AMD Radeon RX 7800 XT graphics card, powered by AMD RDNA 3 architecture, delivers exceptional 1440p gaming performance with 16GB GDDR6 memory.",
    prices: generatePrices(500, 600)
  },
  {
    id: "14",
    name: "Radeon RX 7700 XT",
    brand: "AMD",
    model: "Reference",
    category: "Graphics Cards",
    image: "https://www.amd.com/system/files/2023-08/rgb-7700-xt-angled-1260x709.png",
    description: "The AMD Radeon RX 7700 XT graphics card features 12GB GDDR6 memory and delivers incredible 1440p gaming performance with high frame rates.",
    prices: generatePrices(450, 500)
  },
  {
    id: "6",
    name: "Core i9-14900K",
    brand: "Intel",
    model: "Raptor Lake Refresh",
    category: "Processors",
    image: "https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc3/Intel_Core_i9_14900K_box_.jpg",
    description: "The Intel Core i9-14900K is Intel's flagship desktop processor featuring 24 cores (8 P-cores and 16 E-cores) with up to 5.8 GHz clock speed.",
    prices: generatePrices(550, 650)
  },
  {
    id: "7",
    name: "Ryzen 9 7950X",
    brand: "AMD",
    model: "Zen 4",
    category: "Processors",
    image: "https://m.media-amazon.com/images/I/61TmM+1u9vL.jpg",
    description: "The AMD Ryzen 9 7950X features 16 cores and 32 threads, with a boost clock up to 5.7 GHz, built on AMD's Zen 4 architecture.",
    prices: generatePrices(550, 650)
  },
  {
    id: "8",
    name: "ROG Maximus Z790 Hero",
    brand: "ASUS",
    model: "Z790",
    category: "Motherboards",
    image: "https://dlcdnwebimgs.asus.com/gain/BE94EB89-0761-4C8D-8D16-24B7BC33071F/w1000/h732",
    description: "The ROG Maximus Z790 Hero motherboard offers cutting-edge performance for Intel 13th and 14th Gen CPUs with advanced cooling and connectivity.",
    prices: generatePrices(550, 650)
  },
  {
    id: "9",
    name: "Trident Z5 RGB",
    brand: "G.Skill",
    model: "DDR5-6400",
    category: "Memory",
    image: "https://www.gskill.com/img/overview/trident-z5-rgb-ddr5/classic-design-kv.jpg",
    description: "G.SKILL Trident Z5 RGB DDR5-6400 CL32 32GB (2x16GB) dual-channel memory kit featuring the award-winning Trident heatspreader design.",
    prices: generatePrices(180, 240)
  },
  {
    id: "10",
    name: "Samsung 990 PRO",
    brand: "Samsung",
    model: "2TB",
    category: "Storage",
    image: "https://semiconductor.samsung.com/resources/image/content/ssd/990pro/pd/990PRO_pd_01.jpg",
    description: "The Samsung 990 PRO offers blazing fast PCIe 4.0 performance with sequential read speeds up to 7,450 MB/s and writes up to 6,900 MB/s.",
    prices: generatePrices(170, 210)
  },
  {
    id: "11",
    name: "NZXT H9 Elite",
    brand: "NZXT",
    model: "White",
    category: "Cases",
    image: "https://nzxt.com/assets/cms/34299/1683049658-h9elitethumbnailwhite.png?auto=format&fit=crop&h=1000&w=1000",
    description: "The NZXT H9 Elite features tempered glass panels on the front and side, with an improved internal layout for superior airflow and ease of building.",
    prices: generatePrices(200, 250)
  },
  {
    id: "12",
    name: "RMx SHIFT Series RM1000x",
    brand: "Corsair",
    model: "1000W",
    category: "Power Supplies",
    image: "https://m.media-amazon.com/images/I/712EFbD9OHL.jpg",
    description: "The Corsair RM1000x SHIFT ATX 3.0 power supply delivers 80 PLUS Gold efficiency with fully modular cabling with side-facing connections.",
    prices: generatePrices(180, 220)
  }
];
