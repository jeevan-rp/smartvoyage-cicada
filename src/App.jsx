import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LocalEcoVendors from './pages/LocalEcoVendors';
import RoutePlanning from './pages/RoutePlanning';
import AITravelItinerary from './pages/AITravelItinerary';
import Onboarding from './pages/Onboarding';
import RewardsMarketplace from './pages/RewardsMarketplace';
import MapDiscovery from './pages/MapDiscovery';
import ProfileEcoStats from './pages/ProfileEcoStats';
import ActiveNavigation from './pages/ActiveNavigation';
import ImpactDashboard from './pages/ImpactDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/vendors" element={<LocalEcoVendors />} />
        <Route path="/route-planning" element={<RoutePlanning />} />
        <Route path="/itinerary" element={<AITravelItinerary />} />
        <Route path="/rewards" element={<RewardsMarketplace />} />
        <Route path="/map-discovery" element={<MapDiscovery />} />
        <Route path="/profile" element={<ProfileEcoStats />} />
        <Route path="/navigation" element={<ActiveNavigation />} />
        <Route path="/impact-dashboard" element={<ImpactDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
