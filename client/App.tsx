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
import ListProperty from "./pages/ListProperty";
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
