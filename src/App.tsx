import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { AuthProvider } from './hooks/useAuth';
import { Announcements } from './pages/Announcements';
import { Badges } from './pages/Badges';
import { Card } from './pages/Card';
import { Heatmap } from './pages/Heatmap';
import { Home } from './pages/Home';
import { Leaderboard } from './pages/Leaderboard';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Referral } from './pages/Referral';
import { Scan } from './pages/Scan';
import { SuccessWall } from './pages/SuccessWall';
import { AdminQRHelper } from './pages/AdminQRHelper';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="scan" element={<Scan />} />
            <Route path="heatmap" element={<Heatmap />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="card" element={<Card />} />
            <Route path="badges" element={<Badges />} />
            <Route path="referral" element={<Referral />} />
            <Route path="profile" element={<Profile />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="success-wall" element={<SuccessWall />} />
            <Route path="admin/qr-helper" element={<AdminQRHelper />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
