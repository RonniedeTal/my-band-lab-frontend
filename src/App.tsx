import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AudioPlayerWrapper } from './components/AudioPlayerWrapper';

// Lazy loading
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ArtistsPage = lazy(() => import('./pages/ArtistsPage'));
const ArtistDetailPage = lazy(() => import('./pages/ArtistDetailPage'));
const GroupsPage = lazy(() => import('./pages/GroupsPage'));
const CreateGroupPage = lazy(() => import('./pages/CreateGroupPage'));
const GroupDetailPage = lazy(() => import('./pages/GroupDetailPage'));
const EditGroupPage = lazy(() => import('./pages/EditGroupPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const FavoriteGroupsPage = lazy(() => import('./pages/FavoriteGroupsPage'));
const PlaylistsPage = lazy(() => import('./pages/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('./pages/PlaylistDetailPage'));
const FindBandMembersPage = lazy(() => import('./pages/FindBandMembersPage'));

function App() {
  return (
    <AudioPlayerWrapper>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artists/:id" element={<ArtistDetailPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:id" element={<GroupDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/find-band" element={<FindBandMembersPage />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/groups/create" element={<CreateGroupPage />} />
              <Route path="/groups/:id/edit" element={<EditGroupPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/favorite-groups" element={<FavoriteGroupsPage />} />
            </Route>

            {/* Rutas de administración */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Layout>
    </AudioPlayerWrapper>
  );
}

export default App;
