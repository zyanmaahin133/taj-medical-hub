
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Import Pages & Layouts
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLayout from "./layouts/AdminLayout";
// ... other imports

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
                {/* User Routes */}
                <Route path="/dashboard" element={<div>User Dashboard</div>} />
                <Route path="/profile" element={<div>User Profile</div>} />
                {/* Doctor Routes */}
                <Route path="/doctor/dashboard" element={<div>Doctor Dashboard</div>} />
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<div>Admin Dashboard</div>} />
                  <Route path="products" element={<div>Admin Products</div>} />
                  {/* ... all other admin routes */}
                </Route>
              </Route>

              {/* Not Found Route */}
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
