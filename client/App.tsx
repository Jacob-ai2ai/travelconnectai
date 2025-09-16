import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AIPlanner from "./pages/AIPlanner";
import TripDetails from "./pages/TripDetails";
import RouteMap from "./pages/RouteMap";
import Stays from "./pages/Stays";
import Flights from "./pages/Flights";
import Xperiences from "./pages/Xperiences";
import Events from "./pages/Events";
import Essentials from "./pages/Essentials";
import ExploreServices from "./pages/ExploreServices";
import ListProperty from "./pages/ListProperty";
import DocumentDownload from "./pages/DocumentDownload";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import PropertyOwnerOnboarding from "./pages/PropertyOwnerOnboarding";
import VendorCategories from "./pages/VendorCategories";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/trip-details/:planId" element={<TripDetails />} />
            <Route path="/route-map/:planId" element={<RouteMap />} />
            <Route path="/stays" element={<Stays />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/xperiences" element={<Xperiences />} />
            <Route path="/events" element={<Events />} />
            <Route path="/essentials" element={<Essentials />} />
            <Route path="/explore-services" element={<ExploreServices />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/document-download" element={<DocumentDownload />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route
              path="/property-onboarding"
              element={<PropertyOwnerOnboarding />}
            />
            <Route path="/vendors" element={<VendorCategories />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
