import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ServiceHeader from "@/components/ServiceHeader";
import {
  MapPin,
  Wallet,
  Plus,
  ArrowLeft,
  ShoppingBag,
  Star,
  DollarSign,
  Video,
  Radio,
  Eye,
  Heart,
  Filter,
  Zap,
  ShoppingCart,
  Package,
  Truck,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ProductType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  features: string[];
  inStock: number;
  shipping: string;
  warranty: string;
  isLiveSale: boolean;
  liveViewers?: number;
  isDeal: boolean;
  isBestseller: boolean;
  deliveryTime: string;
}

export default function Essentials() {
  const [currentLocation, setCurrentLocation] = useState<string>(
    "Detecting location...",
  );
  const [walletBalance] = useState(1250.75);
  const [isSignedIn] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const productTypes: ProductType[] = [
    {
      id: "luggage",
      name: "Luggage",
      icon: "🧳",
      description: "Suitcases and travel bags",
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: "📱",
      description: "Gadgets and accessories",
    },
    {
      id: "clothing",
      name: "Travel Wear",
      icon: "👕",
      description: "Comfortable travel clothing",
    },
    {
      id: "health",
      name: "Health & Safety",
      icon: "💊",
      description: "Medical and safety items",
    },
    {
      id: "photography",
      name: "Photography",
      icon: "📸",
      description: "Camera gear and accessories",
    },
    {
      id: "outdoor",
      name: "Outdoor Gear",
      icon: "⛺",
      description: "Camping and hiking equipment",
    },
    {
      id: "comfort",
      name: "Travel Comfort",
      icon: "😴",
      description: "Pillows, blankets, accessories",
    },
    {
      id: "documents",
      name: "Documents",
      icon: "📄",
      description: "Organizers and holders",
    },
    {
      id: "beauty",
      name: "Beauty & Care",
      icon: "💄",
      description: "Skincare and grooming",
    },
    {
      id: "books",
      name: "Books & Guides",
      icon: "📚",
      description: "Travel guides and entertainment",
    },
    {
      id: "food",
      name: "Travel Snacks",
      icon: "🍿",
      description: "Portable food and drinks",
    },
    {
      id: "security",
      name: "Security",
      icon: "🔒",
      description: "Locks and safety devices",
    },
  ];

  const sampleProducts: Product[] = [
    // Deal Products
    {
      id: "deal-1",
      name: "Premium Travel Backpack 40L",
      brand: "TravelPro",
      category: "Luggage",
      price: 89,
      originalPrice: 129,
      discount: 31,
      rating: 4.7,
      reviews: 1234,
      image: "/placeholder.svg",
      description: "Waterproof, durable backpack perfect for adventures",
      features: [
        "Waterproof",
        "Multiple compartments",
        "Laptop sleeve",
        "Comfortable straps",
      ],
      inStock: 45,
      shipping: "Free",
      warranty: "2 years",
      isLiveSale: false,
      isDeal: true,
      isBestseller: true,
      deliveryTime: "2-3 days",
    },
    {
      id: "deal-2",
      name: "Noise-Cancelling Headphones",
      brand: "SoundMax",
      category: "Electronics",
      price: 159,
      originalPrice: 229,
      discount: 31,
      rating: 4.8,
      reviews: 892,
      image: "/placeholder.svg",
      description: "Professional-grade headphones for travel",
      features: [
        "Active noise cancelling",
        "40-hour battery",
        "Wireless",
        "Compact design",
      ],
      inStock: 23,
      shipping: "Free",
      warranty: "1 year",
      isLiveSale: false,
      isDeal: true,
      isBestseller: false,
      deliveryTime: "1-2 days",
    },

    // Live Sale Products
    {
      id: "live-1",
      name: "4K Travel Action Camera",
      brand: "ActionPro",
      category: "Photography",
      price: 199,
      rating: 4.6,
      reviews: 567,
      image: "/placeholder.svg",
      description: "Capture your adventures in stunning 4K quality",
      features: [
        "4K recording",
        "Waterproof to 30m",
        "Image stabilization",
        "WiFi connectivity",
      ],
      inStock: 12,
      shipping: "Express",
      warranty: "1 year",
      isLiveSale: true,
      liveViewers: 234,
      isDeal: false,
      isBestseller: true,
      deliveryTime: "Same day",
    },
    {
      id: "live-2",
      name: "Smart Luggage with GPS",
      brand: "TechTravel",
      category: "Luggage",
      price: 299,
      rating: 4.5,
      reviews: 445,
      image: "/placeholder.svg",
      description: "Revolutionary smart suitcase with tracking technology",
      features: [
        "GPS tracking",
        "USB charging port",
        "Digital lock",
        "Lightweight design",
      ],
      inStock: 8,
      shipping: "Free",
      warranty: "3 years",
      isLiveSale: true,
      liveViewers: 189,
      isDeal: false,
      isBestseller: false,
      deliveryTime: "2-3 days",
    },

    // Regular Products
    {
      id: "regular-1",
      name: "Travel First Aid Kit",
      brand: "MediTravel",
      category: "Health & Safety",
      price: 35,
      rating: 4.4,
      reviews: 678,
      image: "/placeholder.svg",
      description: "Comprehensive medical kit for international travel",
      features: [
        "Compact design",
        "Essential medications",
        "Bandages included",
        "TSA approved",
      ],
      inStock: 156,
      shipping: "Standard",
      warranty: "N/A",
      isLiveSale: false,
      isDeal: false,
      isBestseller: false,
      deliveryTime: "3-5 days",
    },
    {
      id: "regular-2",
      name: "Universal Travel Adapter",
      brand: "PowerGlobal",
      category: "Electronics",
      price: 25,
      rating: 4.3,
      reviews: 234,
      image: "/placeholder.svg",
      description: "Works in over 150 countries worldwide",
      features: [
        "Universal compatibility",
        "USB ports",
        "Compact design",
        "Safety certified",
      ],
      inStock: 89,
      shipping: "Standard",
      warranty: "1 year",
      isLiveSale: false,
      isDeal: false,
      isBestseller: true,
      deliveryTime: "2-4 days",
    },
    {
      id: "regular-3",
      name: "Memory Foam Travel Pillow",
      brand: "ComfortZone",
      category: "Travel Comfort",
      price: 29,
      rating: 4.2,
      reviews: 445,
      image: "/placeholder.svg",
      description: "Ergonomic support for long flights",
      features: [
        "Memory foam",
        "Washable cover",
        "Compact storage",
        "Neck support",
      ],
      inStock: 67,
      shipping: "Standard",
      warranty: "6 months",
      isLiveSale: false,
      isDeal: false,
      isBestseller: false,
      deliveryTime: "3-5 days",
    },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation("Denpasar, Bali, Indonesia");
          setIsLoadingLocation(false);
          setProducts(sampleProducts);
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Location unavailable");
          setIsLoadingLocation(false);
          setProducts(sampleProducts);
        },
      );
    } else {
      setCurrentLocation("Geolocation not supported");
      setIsLoadingLocation(false);
      setProducts(sampleProducts);
    }
  }, []);

  const getDealProducts = () => products.filter((p) => p.isDeal);
  const getLiveSaleProducts = () => products.filter((p) => p.isLiveSale);
  const getRegularProducts = () =>
    products.filter((p) => !p.isDeal && !p.isLiveSale);

  const handleLocationSearch = (newLocation: string) => {
    setCurrentLocation(newLocation);
  };

  const handleLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLocationSearch(currentLocation);
    }
  };

  const getStockStatus = (inStock: number) => {
    if (inStock > 20) return { color: "text-green-600", text: "In Stock" };
    if (inStock > 5) return { color: "text-yellow-600", text: "Low Stock" };
    return { color: "text-red-600", text: "Almost Gone" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <ServiceHeader
        currentLocation={isLoadingLocation ? "Detecting..." : currentLocation}
        walletBalance={walletBalance}
        isSignedIn={isSignedIn}
        searchQuery={currentLocation}
        onSearchChange={(value) => {
          setCurrentLocation(value);
          handleLocationSearch(value);
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Product Type Categories */}
        <section className="mb-12">
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {productTypes.map((type) => (
              <div
                key={type.id}
                className="flex flex-col items-center min-w-[80px] cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="text-4xl mb-2">{type.icon}</div>
                <span className="text-sm font-medium text-center">
                  {type.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Amazing Product Deals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              💰 Amazing Product Deals
            </h2>
            <Badge className="bg-red-100 text-red-700">Limited Time</Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getDealProducts().map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-square relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/80 hover:bg-white/90"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.isBestseller && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-yellow-500 text-white">
                          Bestseller
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{product.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold mb-1 text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.brand}
                  </p>

                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-lg">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={getStockStatus(product.inStock).color}>
                        {getStockStatus(product.inStock).text}
                      </span>
                      <span className="text-muted-foreground">
                        {product.shipping} shipping
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button className="w-full" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Sales */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              📹 Live Sales Happening Now
            </h2>
            <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getLiveSaleProducts().map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-red-200"
              >
                <div className="relative">
                  <div className="aspect-square relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE • {product.liveViewers}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        className="bg-white/90 text-black hover:bg-white"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Watch Live Demo
                      </Button>
                    </div>
                    {product.isBestseller && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-yellow-500 text-white">
                          Bestseller
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{product.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold mb-1 text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.brand}
                  </p>

                  <div className="mb-3">
                    <div className="text-lg font-bold">${product.price}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={getStockStatus(product.inStock).color}>
                        Only {product.inStock} left!
                      </span>
                      <span className="text-muted-foreground">
                        {product.deliveryTime}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600"
                      size="sm"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Live Sale
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Travel Essentials</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRegularProducts().map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-square relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/80 hover:bg-white/90"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.isBestseller && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-white">
                          Bestseller
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{product.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold mb-1 text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.brand}
                  </p>

                  <div className="mb-3">
                    <div className="text-lg font-bold">${product.price}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={getStockStatus(product.inStock).color}>
                        {getStockStatus(product.inStock).text}
                      </span>
                      <span className="text-muted-foreground">
                        {product.deliveryTime}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button className="w-full" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
