
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
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(1600, 2000),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/rtx-4090`
    }))
  },
  {
    id: "2",
    name: "GeForce RTX 4080",
    brand: "NVIDIA",
    model: "Founders Edition",
    category: "Graphics Cards",
    image: "https://m.media-amazon.com/images/I/61dYrUFeXrL.jpg",
    description: "The RTX 4080 delivers the ultra performance and features that enthusiast gamers and creators demand. Powered by the NVIDIA Ada Lovelace architecture.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(1100, 1300),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/rtx-4080`
    }))
  },
  {
    id: "3",
    name: "GeForce RTX 4070 Ti",
    brand: "NVIDIA",
    model: "Founders Edition",
    category: "Graphics Cards",
    image: "https://m.media-amazon.com/images/I/71iKpn9OdGL.jpg",
    description: "The GeForce RTX 4070 Ti is built on the ultra-efficient NVIDIA Ada Lovelace architecture, delivering fast gaming performance and creation.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(800, 900),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/rtx-4070-ti`
    }))
  },
  {
    id: "4",
    name: "Radeon RX 7900 XTX",
    brand: "AMD",
    model: "Reference",
    category: "Graphics Cards",
    image: "https://www.amd.com/system/files/2022-11/1728141-amd-radeon-7900xtx-left-1260x709.png",
    description: "The AMD Radeon RX 7900 XTX graphics card, powered by AMD RDNA 3 architecture, delivers exceptional 4K gaming with AMD FSR.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(900, 1100),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/rx-7900-xtx`
    }))
  },
  {
    id: "5",
    name: "Radeon RX 7900 XT",
    brand: "AMD",
    model: "Reference",
    category: "Graphics Cards",
    image: "https://www.amd.com/system/files/2022-11/1728144-amd-radeon-7900xt-left-1260x709.png",
    description: "The AMD Radeon RX 7900 XT graphics card brings exceptional performance for 4K gaming with unparalleled visual fidelity.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(800, 950),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/rx-7900-xt`
    }))
  },
  {
    id: "6",
    name: "Core i9-14900K",
    brand: "Intel",
    model: "Raptor Lake Refresh",
    category: "Processors",
    image: "https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc3/Intel_Core_i9_14900K_box_.jpg",
    description: "The Intel Core i9-14900K is Intel's flagship desktop processor featuring 24 cores (8 P-cores and 16 E-cores) with up to 5.8 GHz clock speed.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(550, 650),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/i9-14900k`
    }))
  },
  {
    id: "7",
    name: "Ryzen 9 7950X",
    brand: "AMD",
    model: "Zen 4",
    category: "Processors",
    image: "https://m.media-amazon.com/images/I/61TmM+1u9vL.jpg",
    description: "The AMD Ryzen 9 7950X features 16 cores and 32 threads, with a boost clock up to 5.7 GHz, built on AMD's Zen 4 architecture.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(550, 650),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/ryzen-9-7950x`
    }))
  },
  {
    id: "8",
    name: "ROG Maximus Z790 Hero",
    brand: "ASUS",
    model: "Z790",
    category: "Motherboards",
    image: "https://dlcdnwebimgs.asus.com/gain/BE94EB89-0761-4C8D-8D16-24B7BC33071F/w1000/h732",
    description: "The ROG Maximus Z790 Hero motherboard offers cutting-edge performance for Intel 13th and 14th Gen CPUs with advanced cooling and connectivity.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(550, 650),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/rog-maximus-z790-hero`
    }))
  },
  {
    id: "9",
    name: "Trident Z5 RGB",
    brand: "G.Skill",
    model: "DDR5-6400",
    category: "Memory",
    image: "https://www.gskill.com/img/overview/trident-z5-rgb-ddr5/classic-design-kv.jpg",
    description: "G.SKILL Trident Z5 RGB DDR5-6400 CL32 32GB (2x16GB) dual-channel memory kit featuring the award-winning Trident heatspreader design.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(180, 240),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/trident-z5-rgb`
    }))
  },
  {
    id: "10",
    name: "Samsung 990 PRO",
    brand: "Samsung",
    model: "2TB",
    category: "Storage",
    image: "https://semiconductor.samsung.com/resources/image/content/ssd/990pro/pd/990PRO_pd_01.jpg",
    description: "The Samsung 990 PRO offers blazing fast PCIe 4.0 performance with sequential read speeds up to 7,450 MB/s and writes up to 6,900 MB/s.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(170, 210),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/samsung-990-pro`
    }))
  },
  {
    id: "11",
    name: "NZXT H9 Elite",
    brand: "NZXT",
    model: "White",
    category: "Cases",
    image: "https://nzxt.com/assets/cms/34299/1683049658-h9elitethumbnailwhite.png?auto=format&fit=crop&h=1000&w=1000",
    description: "The NZXT H9 Elite features tempered glass panels on the front and side, with an improved internal layout for superior airflow and ease of building.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(200, 250),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/nzxt-h9-elite`
    }))
  },
  {
    id: "12",
    name: "RMx SHIFT Series RM1000x",
    brand: "Corsair",
    model: "1000W",
    category: "Power Supplies",
    image: "https://m.media-amazon.com/images/I/712EFbD9OHL.jpg",
    description: "The Corsair RM1000x SHIFT ATX 3.0 power supply delivers 80 PLUS Gold efficiency with fully modular cabling with side-facing connections.",
    prices: retailers.map(retailer => ({
      retailerId: retailer.id,
      price: randomPrice(180, 220),
      currency: "USD",
      status: randomStatus(),
      lastUpdated: randomDate(),
      url: `${retailer.url}/corsair-rm1000x-shift`
    }))
  }
];
