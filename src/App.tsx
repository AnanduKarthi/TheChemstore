import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import {
  JobFeedSkeleton,
  BannerSkeleton,
  AcademySkeleton,
  ProductsSkeleton,
  FooterSkeleton,
} from './components/ui/Skeletons';

// Import above-fold components directly
import { Navigation } from './features/navigation/Navigation';
import { Hero } from './features/hero/Hero';

// Lazy load below-fold components
const JobFeed = React.lazy(() => import('./features/jobs/JobFeed').then(module => ({ default: module.JobFeed })));
const ProductPromoBanner = React.lazy(() => import('./features/products/ProductPromoBanner').then(module => ({ default: module.ProductPromoBanner })));
const TuitionAcademy = React.lazy(() => import('./features/academy/TuitionAcademy').then(module => ({ default: module.TuitionAcademy })));
const RecommendedProducts = React.lazy(() => import('./features/products/RecommendedProducts').then(module => ({ default: module.RecommendedProducts })));
const Footer = React.lazy(() => import('./features/footer/Footer').then(module => ({ default: module.Footer })));

function Home() {
  return (
    <>
      <title>TheChemstore | Accelerate Your Career in Chemistry</title>
      <meta name="description" content="Discover top chemistry opportunities, advance your skills, and connect with leading companies in the chemical sciences." />
      <Navigation />
      <Hero />
      <ErrorBoundary>
        <Suspense fallback={<JobFeedSkeleton />}>
          <JobFeed />
        </Suspense>
      </ErrorBoundary>
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
