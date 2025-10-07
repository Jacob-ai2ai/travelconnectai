import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast as toastFn } from '@/hooks/use-toast';
import { Play, ShoppingCart, Star, Truck } from 'lucide-react';

const SAMPLE_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Premium Travel Backpack',
    description:
      'Waterproof 40L travel backpack with multiple compartments, laptop sleeve and ergonomic straps.',
    price: 89,
    images: ['/placeholder.svg'],
    inStock: 12,
    isLiveSale: true,
    liveViewers: 234,
    rating: 4.6,
    reviews: 892,
    features: ['40L capacity', 'Waterproof', 'Laptop sleeve', 'Ergonomic straps'],
    inventory: [
      { sku: 'BK-40L-BLK', variant: 'Black', stock: 6 },
      { sku: 'BK-40L-NVY', variant: 'Navy', stock: 4 },
    ],
  },
  {
    id: 'prod-2',
    name: 'Underwater Camera',
    description: '4K waterproof action camera perfect for underwater adventures.',
    price: 159,
    images: ['/placeholder.svg'],
    inStock: 8,
    isLiveSale: false,
    liveViewers: 0,
    rating: 4.3,
    reviews: 412,
    features: ['4K@60fps', 'Waterproof to 30m', 'WIFI', 'Image stabilization'],
    inventory: [{ sku: 'CAM-4K-01', variant: 'Default', stock: 8 }],
  },
  {
    id: 'prod-3',
    name: 'Travel First Aid Kit',
    description: 'Comprehensive medical kit for international travel with essential medications.',
    price: 35,
    images: ['/placeholder.svg'],
    inStock: 25,
    isLiveSale: false,
    liveViewers: 0,
    rating: 4.8,
    reviews: 124,
    features: ['Bandages', 'Antiseptic wipes', 'Tweezers', 'Emergency blanket'],
    inventory: [{ sku: 'FAK-STD', variant: 'Standard', stock: 25 }],
  },
];

function readItineraryProducts(): string[] {
  try {
    const raw = localStorage.getItem('itineraryProducts');
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch (e) {
    return [];
  }
}

function writeItineraryProducts(list: string[]) {
  try {
    localStorage.setItem('itineraryProducts', JSON.stringify(list));
  } catch (e) {
    // noop
  }
}

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = SAMPLE_PRODUCTS.find((p) => p.id === productId) || SAMPLE_PRODUCTS[0];

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [itineraryProducts, setItineraryProducts] = useState<string[]>(() => readItineraryProducts());
  const [selectedVariant, setSelectedVariant] = useState(product.inventory[0]);
  const [deliveryTo, setDeliveryTo] = useState<'hotel' | 'address'>('hotel');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');

  useEffect(() => {
    writeItineraryProducts(itineraryProducts);
  }, [itineraryProducts]);

  const inItinerary = itineraryProducts.includes(product.id);

  const handleAddToItinerary = () => {
    if (!inItinerary) {
      setItineraryProducts((prev) => {
        const next = [...prev, product.id];
        toastFn({ title: 'Added to itinerary', description: `${product.name} was added to your trip.` });
        return next;
      });
      return;
    }
    // If already in itinerary do nothing here
  };

  const handleRemoveFromItinerary = () => {
    setItineraryProducts((prev) => prev.filter((id) => id !== product.id));
    toastFn({ title: 'Removed', description: `${product.name} removed from itinerary` });
  };

  const handleChangeQty = (delta: number) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleJoinLive = () => {
    // Open live viewer in new tab (stub)
    window.open(`/live/${product.id}`, '_blank');
  };

  const handleRequestLive = () => {
    toastFn({ title: 'Requested Live Sale', description: `We will notify when ${product.name} goes live.` });
  };

  const handleReplace = () => {
    navigate(`/replace-options/${product.id}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link to="/trip-details/budget-bali" className="text-sm text-muted-foreground">Back to trip</Link>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="ml-1">{product.rating} ({product.reviews})</span>
              </div>
              <Badge variant="secondary">{product.inStock} in stock</Badge>
              {product.isLiveSale && <Badge className="bg-red-500 text-white">LIVE SALE • {product.liveViewers}</Badge>}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {inItinerary ? (
              <Badge className="bg-green-100 text-green-800">In itinerary</Badge>
            ) : (
              <Badge className="bg-muted text-muted-foreground">Not in itinerary</Badge>
            )}

            <Button variant="outline" onClick={handleReplace}>Replace</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <main className="md:col-span-2">
            <Card>
              <div className="relative h-96 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                {product.isLiveSale && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center text-sm">
                    <Play className="h-4 w-4 mr-2" />
                    Join Live
                  </div>
                )}
              </div>

              <CardContent>
                <div className="flex items-start gap-6">
                  <div className="w-24 flex-shrink-0 space-y-2">
                    {product.images.map((img, i) => (
                      <button key={i} onClick={() => setMainImage(img)} className="w-24 h-16 overflow-hidden rounded border">
                        <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="flex-1">
                    <p className="mb-4 text-muted-foreground">{product.description}</p>

                    <div className="mb-4">
                      <div className="text-2xl font-bold">${product.price}</div>
                      <div className="text-sm text-muted-foreground">Free returns · Free delivery over $50</div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center border rounded overflow-hidden text-sm">
                        <button aria-label="decrease" onClick={() => handleChangeQty(-1)} className="px-3 py-1">-</button>
                        <div className="px-3 py-1">{quantity}</div>
                        <button aria-label="increase" onClick={() => handleChangeQty(1)} className="px-3 py-1">+</button>
                      </div>

                      <div className="flex-1">
                        {!inItinerary ? (
                          product.isLiveSale ? (
                            <Button className="w-full" onClick={handleJoinLive}>
                              <Play className="h-4 w-4 mr-2" />
                              Join Live Sale
                            </Button>
                          ) : (
                            <Button className="w-full" onClick={handleAddToItinerary}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to itinerary
                            </Button>
                          )
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {product.isLiveSale ? (
                              <Button onClick={handleJoinLive}>
                                <Play className="h-4 w-4 mr-2" />
                                Join Live Sale
                              </Button>
                            ) : (
                              <Button onClick={handleRequestLive}>
                                <Play className="h-4 w-4 mr-2" />
                                Request Live Sale
                              </Button>
                            )}

                            <Button variant="destructive" onClick={handleRemoveFromItinerary}>Remove</Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-semibold mb-2">Features</div>
                      <ul className="list-disc ml-5 text-sm text-muted-foreground">
                        {product.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-semibold mb-2">Inventory</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {product.inventory.map((i) => (
                          <button
                            type="button"
                            key={i.sku}
                            onClick={() => setSelectedVariant(i)}
                            className={`border rounded p-3 text-left w-full ${selectedVariant?.sku === i.sku ? 'ring-2 ring-travel-blue' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium">{i.variant}</div>
                                <div className="text-xs text-muted-foreground">SKU: {i.sku}</div>
                              </div>
                              <div className="text-sm">{i.stock} left</div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-semibold mb-2">Delivery options</div>
                        <div className="space-y-2 text-sm">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="delivery" checked={deliveryTo === 'hotel'} onChange={() => setDeliveryTo('hotel')} />
                            <span>Deliver to hotel</span>
                          </label>

                          <label className="flex items-center space-x-2">
                            <input type="radio" name="delivery" checked={deliveryTo === 'address'} onChange={() => setDeliveryTo('address')} />
                            <span>Deliver to my address</span>
                          </label>

                          {deliveryTo === 'address' && (
                            <div className="mt-2">
                              <input
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="Enter delivery address"
                                className="w-full border rounded px-2 py-1 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-semibold mb-2">Payment</div>
                        <div className="space-y-2 text-sm">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                            <span>Pay online</span>
                          </label>

                          <label className="flex items-center space-x-2">
                            <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                            <span>Cash on Delivery (COD)</span>
                          </label>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-semibold mb-2">Warranty</div>
                        <div className="text-sm text-muted-foreground">1 year manufacturer warranty. Extended warranty available at checkout.</div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-semibold mb-2">Return & Refund</div>
                        <div className="text-sm text-muted-foreground">Returns accepted within 30 days in original packaging. Refunds processed within 5-7 business days after inspection.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="md:col-span-1">
            {/* Special offers moved above purchase */}
            <Card className="mb-4">
              <CardContent>
                <div className="text-sm font-semibold mb-3">Special offers & promotions</div>

                <div className="space-y-3">
                  <div className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">Early Bird — 15% off</div>
                      <div className="text-sm text-muted-foreground">Save 15% when you order at least 30 days in advance.</div>
                    </div>
                    <Button variant="outline">Apply</Button>
                  </div>

                  <div className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">Bulk Order Discount — 10% off</div>
                      <div className="text-sm text-muted-foreground">Order 5+ units to unlock this discount.</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Auto-applied</div>
                  </div>

                  <div className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">Bundle: Stay & Gear</div>
                      <div className="text-sm text-muted-foreground">Includes complimentary packing cover.</div>
                    </div>
                    <Button variant="ghost">View</Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mt-3">Have a coupon? Enter it at checkout.</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">Purchase</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">${product.price}</div>
                <div className="text-sm text-muted-foreground mb-4">Quantity: {quantity}</div>

                {product.isLiveSale ? (
                  <Button className="w-full mb-2" onClick={handleJoinLive}>
                    <Play className="h-4 w-4 mr-2" /> Join Live Sale
                  </Button>
                ) : (
                  <Button className="w-full mb-2" onClick={handleAddToItinerary}>
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to itinerary
                  </Button>
                )}

                <Button variant="outline" className="w-full" onClick={() => navigate('/trip-details/budget-bali')}>
                  View trip
                </Button>

                <div className="mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free delivery over $50</div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent>
                <div className="text-sm font-semibold mb-2">Need help?</div>
                <Button variant="ghost" className="w-full">Contact support</Button>
              </CardContent>
            </Card>

            {/* Your Itinerary widget adapted from villa-1 */}
            <Card className="mt-4 bg-yellow-50 border-yellow-100">
              <CardHeader>
                <div className="text-lg font-semibold">Your Itinerary</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {itineraryProducts.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No items in itinerary</div>
                  ) : (
                    itineraryProducts.map((id) => {
                      const item = SAMPLE_PRODUCTS.find((p) => p.id === id);
                      if (!item) return null;
                      return (
                        <div key={id} className="flex items-center justify-between p-2 bg-white rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">${item.price}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button className="px-2 py-1 border rounded" onClick={() => {
                              // remove
                              setItineraryProducts(prev => prev.filter(x => x !== id));
                            }}>Remove</button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div className="mt-2 p-3 border-dashed border-2 border-yellow-100 text-center text-sm text-muted-foreground rounded">Drag products here to add to itinerary</div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm">Total</div>
                    <div className="text-lg font-bold">${itineraryProducts.reduce((sum, id) => { const it = SAMPLE_PRODUCTS.find(p=>p.id===id); return sum + (it?.price||0); }, 0)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold mb-2">Similar products</div>
          <div className="flex gap-3">
            {SAMPLE_PRODUCTS.filter((p) => p.id !== product.id).map((p) => (
              <Card key={p.id} className="w-40">
                <CardContent>
                  <img src={p.images[0]} alt={p.name} className="w-full h-20 object-cover mb-2" />
                  <Link to={`/product/${p.id}`} className="text-sm font-medium hover:underline">{p.name}</Link>
                  <div className="text-sm text-muted-foreground">${p.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nova assistant floating */}
        <div className="fixed right-6 bottom-6">
          <button
            aria-label="Nova Assistant"
            onClick={() => {
              const el = document.getElementById('nova-panel');
              if (el) el.classList.toggle('hidden');
            }}
            className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
          >
            N
          </button>

          <div id="nova-panel" className="hidden w-80 bg-white border rounded shadow-lg mt-2">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="font-semibold">Nova</div>
              <button onClick={() => { const el = document.getElementById('nova-panel'); if (el) el.classList.add('hidden'); }} className="text-sm text-muted-foreground">Close</button>
            </div>
            <div className="p-3 text-sm text-muted-foreground">Hi, I'm Nova — your travel assistant. Ask me to replace items, view inventory, or join live sales.</div>
            <div className="p-3 border-t">
              <input placeholder="Ask Nova..." className="w-full border rounded px-2 py-1 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
