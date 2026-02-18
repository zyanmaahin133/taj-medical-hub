
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Layouts and Public Pages
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLayout from "./layouts/AdminLayout";

// Import all Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminLabTests from "./pages/admin/AdminLabTests";
import AdminScans from "./pages/admin/AdminScans";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWholesale from "./pages/admin/AdminWholesale";
import AdminAdvertisements from "./pages/admin/AdminAdvertisements";
import AdminSettings from "./pages/admin/AdminSettings";

// ... other page imports ...

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* === Public Routes === */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />

              {/* === Protected Routes === */}
              <Route element={<ProtectedRoute />}>
                {/* ... User and Doctor routes ... */}

                {/* === Admin Routes (Corrected) === */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="doctors" element={<AdminDoctors />} />
                  <Route path="lab-tests" element={<AdminLabTests />} />
                  <Route path="scans" element={<AdminScans />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="wholesale" element={<AdminWholesale />} />
                  <Route path="advertisements" element={<AdminAdvertisements />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>

              {/* ... other routes ... */}
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
