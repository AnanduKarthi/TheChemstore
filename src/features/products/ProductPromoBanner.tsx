import { Download, BookOpen } from 'lucide-react';

export function ProductPromoBanner() {
  return (
    <section className="py-16 bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Side - Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 bg-brand-emerald rounded-full mb-4 text-sm font-semibold">
              Free Download
            </div>
            <h2 className="mb-4 text-[38px] font-bold leading-tight">
              Chemistry Previous Year Questions Guide
            </h2>
            <p className="text-gray-300 mb-6 max-w-xl text-lg leading-relaxed">
              Comprehensive collection of solved chemistry problems from JEE, NEET, and competitive exams. Perfect for exam preparation.
            </p>
            <button className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-8 py-3 rounded-lg inline-flex items-center gap-2 transition-colors text-base font-semibold">
              <Download className="w-5 h-5" />
              Download Now
            </button>
          </div>

          {/* Right Side - Book Mockup Placeholder */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-emerald to-brand-emerald-dark rounded-2xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform">
                <div className="bg-white rounded-lg p-8 aspect-[3/4] flex flex-col items-center justify-center gap-4">
                  <BookOpen className="w-24 h-24 text-brand-navy" />
                  <div className="text-center">
                    <div className="text-brand-navy text-2xl font-bold">
                      Chemistry
                    </div>
                    <div className="text-brand-navy text-lg">
                      PYQ Guide 2026
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">
                    500+ Solved Problems
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
