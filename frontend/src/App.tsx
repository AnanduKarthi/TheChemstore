import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, type Location } from 'react-router';
import { Toaster } from 'sonner';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { VerifyEmailPage } from '@/features/auth/VerifyEmailPage';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  JobFeedSkeleton,
  BannerSkeleton,
  AcademySkeleton,
  ProductsSkeleton,
  FooterSkeleton,
} from '@/components/ui/Skeletons';

// Import above-fold components directly
import { Navigation } from '@/features/navigation/Navigation';
import { Hero } from '@/features/hero/Hero';

// Lazy load below-fold components
const JobFeed = React.lazy(() =>
  import('@/features/jobs/JobFeed').then((module) => ({ default: module.JobFeed }))
);
const ProductPromoBanner = React.lazy(() =>
  import('@/features/products/ProductPromoBanner').then((module) => ({
    default: module.ProductPromoBanner,
  }))
);
const TuitionAcademy = React.lazy(() =>
  import('@/features/academy/TuitionAcademy').then((module) => ({ default: module.TuitionAcademy }))
);
const RecommendedProducts = React.lazy(() =>
  import('@/features/products/RecommendedProducts').then((module) => ({
    default: module.RecommendedProducts,
  }))
);
const Footer = React.lazy(() =>
  import('@/features/footer/Footer').then((module) => ({ default: module.Footer }))
);
const JobDetailPage = React.lazy(() =>
  import('@/features/jobs/JobDetailPage').then((module) => ({ default: module.JobDetailPage }))
);
const JobDetailModal = React.lazy(() =>
  import('@/features/jobs/JobDetailModal').then((module) => ({ default: module.JobDetailModal }))
);

function Home() {
  return (
    <>
      <title>TheChemstore | Accelerate Your Career in Chemistry</title>
      <meta
        name="description"
        content="Discover top chemistry opportunities, advance your skills, and connect with leading companies in the chemical sciences."
      />
      <Navigation />
      <Hero />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset}>
            <Suspense fallback={<JobFeedSkeleton />}>
              <JobFeed />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <ErrorBoundary>
        <Suspense fallback={<BannerSkeleton />}>
          <ProductPromoBanner />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<AcademySkeleton />}>
          <TuitionAcademy />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<ProductsSkeleton />}>
          <RecommendedProducts />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

// Job detail opens as a modal over whatever page triggered it (the "background
// location" routing pattern), so the URL is always shareable/deep-linkable —
// visiting /jobs/:id directly (or refreshing) renders the full JobDetailPage
// instead, since there's no background location to render behind the modal.
function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = (location.state as { backgroundLocation?: Location } | null)
    ?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route
          path="/jobs/:id"
          element={
            <Suspense fallback={null}>
              <JobDetailPage />
            </Suspense>
          }
        />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/jobs/:id"
            element={
              <Suspense fallback={null}>
                <JobDetailModal />
              </Suspense>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  // Confirm any stored session once on app start.
  useEffect(() => {
    useAuthStore.getState().bootstrap();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <AppRoutes />
      </div>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  );
}
