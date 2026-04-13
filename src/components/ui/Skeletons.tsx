function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className ?? ''}`} />;
}

export function JobFeedSkeleton() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          <SkeletonBlock className="h-10 w-96 mb-3" />
          <SkeletonBlock className="h-5 w-72" />
        </div>
        <div className="flex justify-center gap-3 mb-12">
          {Array.from({ length: 5 }, (_, i) => <SkeletonBlock key={i} className="h-10 w-28 rounded-full" />)}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-6 flex gap-4">
              <SkeletonBlock className="w-14 h-14 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <SkeletonBlock className="h-5 w-3/4" />
                <SkeletonBlock className="h-4 w-1/2" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BannerSkeleton() {
  return (
    <section className="py-16 bg-brand-navy">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-4">
          <SkeletonBlock className="h-6 w-32 !bg-gray-600 rounded-full" />
          <SkeletonBlock className="h-10 w-96 !bg-gray-600" />
          <SkeletonBlock className="h-20 w-full !bg-gray-600" />
          <SkeletonBlock className="h-12 w-44 !bg-gray-600" />
        </div>
        <div className="flex-1 max-w-md">
          <SkeletonBlock className="aspect-[3/4] w-full !bg-gray-600 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

export function AcademySkeleton() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <SkeletonBlock className="aspect-[4/3] w-full rounded-2xl" />
        <div className="space-y-4">
          <SkeletonBlock className="h-6 w-32 rounded-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-20 w-full" />
          {Array.from({ length: 4 }, (_, i) => <SkeletonBlock key={i} className="h-5 w-3/4" />)}
          <div className="flex gap-4 pt-4">
            <SkeletonBlock className="h-12 w-44" />
            <SkeletonBlock className="h-12 w-36" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductsSkeleton() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          <SkeletonBlock className="h-10 w-80 mb-3" />
          <SkeletonBlock className="h-5 w-64" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <SkeletonBlock className="aspect-square w-full rounded-none" />
              <div className="p-6 space-y-3">
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-5 w-full" />
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="bg-brand-navy py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <SkeletonBlock className="h-7 w-64 !bg-gray-600" />
          <SkeletonBlock className="h-16 w-full !bg-gray-600" />
          <SkeletonBlock className="h-12 w-full !bg-gray-600" />
        </div>
        <div className="flex justify-end items-center gap-4">
          {Array.from({ length: 4 }, (_, i) => <SkeletonBlock key={i} className="w-10 h-10 rounded-full !bg-gray-600" />)}
        </div>
      </div>
    </footer>
  );
}
