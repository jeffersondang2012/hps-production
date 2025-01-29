import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PartnersPage } from '@/features/partners/PartnersPage';
// ... other imports

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: 'partners',
        element: <PartnersPage />
      },
      // ... other protected routes
    ]
  }
]); 