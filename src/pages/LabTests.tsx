import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLabTests, useHealthPackages } from "@/hooks/useProducts";

interface BookingItem {
  id: string;
  name: string;
  price: number;
  type: "test" | "package";
}

const LabTests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dbTests, isLoading: loadingTests } = useLabTests();
  const { data: dbPackages, isLoading: loadingPackages } = useHealthPackages();

  const tests = dbTests ?? [];
  const packages = dbPackages ?? [];

  const filteredTests = tests.filter((test: any) =>
    test.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPackages = packages.filter((pkg: any) =>
    pkg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookTest = (item: BookingItem) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    console.log("Booking:", item);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 sm:pt-24 pb-16">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-primary/10 py-10">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <Badge className="mb-4 bg-secondary">
              Trusted by 50,000+ customers
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Book Lab Tests at Home
            </h1>

            <p className="text-muted-foreground mb-6">
              Get up to 60% off on all lab tests. Free home sample collection.
              Reports in 6-24 hours.
            </p>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for tests, health packages..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="container mx-auto px-4 py-10">
          <Tabs
            defaultValue={packages.length > 0 ? "packages" : "tests"}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-2 w-full sm:w-auto mb-6">
              <TabsTrigger value="packages">Health Packages</TabsTrigger>
              <TabsTrigger value="tests">Individual Tests</TabsTrigger>
            </TabsList>

            {/* PACKAGES */}
            <TabsContent value="packages">
              {loadingPackages ? (
                <p className="text-center text-muted-foreground">
                  Loading packages...
                </p>
              ) : filteredPackages.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No health packages found.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg: any) => {
                    const discount = pkg.original_price
                      ? Math.round(
                          ((pkg.original_price - pkg.discounted_price) /
                            pkg.original_price) *
                            100
                        )
                      : 0;

                    return (
                      <Card
                        key={pkg.id}
                        className="hover:shadow-lg transition-shadow flex flex-col"
                      >
                        <CardHeader>
                          <CardTitle>{pkg.name}</CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-2">
                          <p className="text-sm text-muted-foreground">
                            {pkg.description}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold">
                              ₹{pkg.discounted_price}
                            </span>

                            {discount > 0 && (
                              <>
                                <span className="text-sm line-through text-muted-foreground">
                                  ₹{pkg.original_price}
                                </span>
                                <Badge>{discount}% OFF</Badge>
                              </>
                            )}
                          </div>

                          <Button
                            className="mt-3"
                            onClick={() =>
                              handleBookTest({
                                id: pkg.id,
                                name: pkg.name,
                                price: pkg.discounted_price,
                                type: "package",
                              })
                            }
                          >
                            Book Now
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* TESTS */}
            <TabsContent value="tests">
              {loadingTests ? (
                <p className="text-center text-muted-foreground">
                  Loading tests...
                </p>
              ) : filteredTests.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No tests found.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredTests.map((test: any) => (
                    <Card
                      key={test.id}
                      className="hover:shadow-lg transition-shadow flex flex-col"
                    >
                      <CardHeader>
                        <CardTitle className="text-base">
                          {test.name}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex flex-col gap-2">
                        <p className="text-xs text-muted-foreground">
                          Category: {test.category}
                        </p>

                        <span className="text-lg font-bold">
                          ₹{test.price}
                        </span>

                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            handleBookTest({
                              id: test.id,
                              name: test.name,
                              price: test.price,
                              type: "test",
                            })
                          }
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LabTests;