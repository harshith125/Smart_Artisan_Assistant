import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/PrivateRoute'

// Artisan Pages
import ArtisanDashboard from './pages/artisan/Dashboard'
import AddProduction from './pages/artisan/AddProduction'
import AIAssistant from './pages/artisan/AIAssistant'
import ArtisanReports from './pages/artisan/Reports'

// Accountant Pages
import AccountantDashboard from './pages/accountant/Dashboard'
import Payments from './pages/accountant/Payments'
import FinancialReports from './pages/accountant/FinancialReports'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import Analytics from './pages/admin/Analytics'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Artisan Routes */}
        <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
        <Route path="/artisan/add-production" element={<AddProduction />} />
        <Route path="/artisan/ai-assistant" element={<AIAssistant />} />
        <Route path="/artisan/reports" element={<ArtisanReports />} />

        {/* Accountant Routes */}
        <Route path="/accountant/dashboard" element={<AccountantDashboard />} />
        <Route path="/accountant/payments" element={<Payments />} />
        <Route path="/accountant/financial-reports" element={<FinancialReports />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
