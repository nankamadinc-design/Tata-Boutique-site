import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import ScrollToTop from './components/Loading/ScrollToTop';

import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import CategoriesPage from './pages/Shop/CategoriesPage';
import ProductPage from './pages/Product/Product';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';

import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/Login/Login';
import AdminDashboard from './admin/Dashboard/Dashboard';
import AdminProducts from './admin/Products/ProductList';
import AdminProductForm from './admin/Products/ProductForm';
import AdminCategories from './admin/Categories/Categories';
import AdminSettings from './admin/Settings/Settings';
import RequireAdminAuth from './admin/components/RequireAdminAuth';

// The preview sandbox (deploy_website) requires hash-based routing because sites
// are served inside an iframe on an opaque path. In real production on Cloudflare
// Pages (www.tataboutique.com), set VITE_ROUTER=browser to use clean URLs like
// /produit/nom-du-produit as required by the spec. See README for details.
const useHashRouting = (import.meta as any).env?.VITE_ROUTER !== 'browser';
const Router = useHashRouting ? HashRouter : BrowserRouter;

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SettingsProvider>
        <AdminAuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public site */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/boutique" element={<PublicLayout><Shop /></PublicLayout>} />
            <Route path="/categories" element={<PublicLayout><CategoriesPage /></PublicLayout>} />
            <Route path="/produit/:slug" element={<PublicLayout><ProductPage /></PublicLayout>} />
            <Route path="/a-propos" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

            {/* Admin */}
            <Route path="/admin/connexion" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdminAuth>
                  <AdminLayout />
                </RequireAdminAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="tableau-de-bord" element={<AdminDashboard />} />
              <Route path="produits" element={<AdminProducts />} />
              <Route path="ajouter-produit" element={<AdminProductForm />} />
              <Route path="modifier-produit/:id" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="parametres" element={<AdminSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </AdminAuthProvider>
      </SettingsProvider>
    </Router>
  );
}
