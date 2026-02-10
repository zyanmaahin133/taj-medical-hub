
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { 
  Search, Filter, ShoppingCart, Star,
  Pill, Droplets, Stethoscope, Baby, Leaf, 
  Dumbbell, ThermometerSun, Sparkles, HeartPulse
} from "lucide-react";

const categories = [
  { name: "Medicines", icon: Pill, count: 500, slug: "medicines", color: "bg-blue-100 text-blue-600" },
  { name: "Skin Care", icon: Sparkles, count: 120, slug: "skin-care", color: "bg-pink-100 text-pink-600" },
  { name: "Hair Care", icon: Droplets, count: 85, slug: "hair-care", color: "bg-purple-100 text-purple-600" },
  { name: "Personal Care", icon: HeartPulse, count: 200, slug: "personal-care", color: "bg-green-100 text-green-600" },
  { name: "Baby Care", icon: Baby, count: 95, slug: "baby-care", color: "bg-yellow-100 text-yellow-600" },
  { name: "Ayurveda", icon: Leaf, count: 150, slug: "ayurveda", color: "bg-emerald-100 text-emerald-600" },
  { name: "Fitness", icon: Dumbbell, count: 75, slug: "fitness", color: "bg-orange-100 text-orange-600" },
  { name: "Medical Devices", icon: ThermometerSun, count: 60, slug: "medical-devices", color: "bg-red-100 text-red-600" },
];

const fallbackProducts = [
  { id: "1", name: "Dolo 650mg", brand: "Micro Labs", price: 30, discount_percent: 14, image_url: "", requires_prescription: false },
];

const Shop = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { data: products, isLoading } = useProducts(searchQuery, selectedCategory || undefined);

  const displayProducts = products && products.length > 0 ? products : fallbackProducts;

  const filteredProducts = displayProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMrp = (price: number, discountPercent: number) => {
    return Math.round(price / (1 - discountPercent / 100));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('shop_title')}</h1>
              <p className="text-muted-foreground mb-6">{t('shop_subtitle')}</p>
              <div className="flex gap-2 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={t('search_placeholder')}
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('filter_button')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
            <Link to="/upload-prescription">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary h-full">
                <CardContent className="p-3 sm:p-4 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm">{t('upload_prescription_title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('upload_prescription_subtitle')}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/lab-tests">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20 hover:border-secondary h-full">
                <CardContent className="p-3 sm:p-4 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-secondary/10 rounded-full flex items-center justify-center">
                    <ThermometerSun className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm">{t('book_lab_test_title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('book_lab_test_subtitle')}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/consult">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-accent/20 hover:border-accent h-full">
                <CardContent className="p-3 sm:p-4 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-accent/10 rounded-full flex items-center justify-center">
                    <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm">{t('consult_doctor_title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('consult_doctor_subtitle')}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/scan-booking">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-500/20 hover:border-orange-500 h-full">
                <CardContent className="p-3 sm:p-4 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm">{t('book_scan_title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('book_scan_subtitle')}</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('shop_by_category_title')}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(selectedCategory === category.slug ? null : category.slug)}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    selectedCategory === category.slug
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${category.color}`}>
                    <category.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <p className="font-medium text-xs sm:text-sm">{category.name}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t('featured_products_title')}</h2>
              {selectedCategory && (
                <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)}>
                  {t('clear_filter_button')}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((product) => {
                const mrp = getMrp(product.price, product.discount_percent || 0);
                return (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
                    <CardContent className="p-0">
                        <div className="relative p-2 sm:p-3 bg-muted/30 aspect-square flex items-center justify-center">
                        {product.image_url && product.image_url.startsWith("http") ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-contain mx-auto"
                          />
                        ) : (
                          <div className="text-4xl sm:text-5xl text-center py-4">💊</div>
                        )}
                        {product.requires_prescription && (
                          <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-orange-500 text-xs px-1.5 py-0.5">Rx</Badge>
                        )}
                        {product.discount_percent && product.discount_percent > 0 && (
                          <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-secondary text-xs px-1.5 py-0.5">
                            {product.discount_percent}% OFF
                          </Badge>
                        )}
                      </div>
                      <div className="p-2 sm:p-3">
                        <p className="text-xs text-muted-foreground mb-0.5 truncate">{product.brand || "Generic"}</p>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 h-10">{product.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">4.5</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-base sm:text-lg">₹{product.price}</span>
                          {mrp > product.price && (
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{mrp}</span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="w-full gap-2 text-xs sm:text-sm h-9"
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {t('add_to_cart_button')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
