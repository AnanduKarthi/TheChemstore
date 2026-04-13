import { Search, MapPin, Briefcase } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 md:py-32 overflow-hidden">
      {/* Subtle geometric pattern background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230A1F44' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4 text-5xl md:text-[56px] font-bold leading-tight">
            Accelerate Your Career in Chemistry
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed">
            Discover top chemistry opportunities, advance your skills, and connect with leading companies in the chemical sciences
          </p>
        </div>

        {/* Job Search Bar */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Job Title, Keywords, or Company"
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="City, State, or Remote"
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            />
          </div>

          <button className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-8 py-3 rounded-lg flex items-center gap-2 justify-center transition-colors whitespace-nowrap">
            <Search className="w-5 h-5" />
            Search Jobs
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-brand-navy text-4xl font-bold">2,500+</div>
            <div className="text-gray-600 mt-1">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-brand-navy text-4xl font-bold">850+</div>
            <div className="text-gray-600 mt-1">Top Companies</div>
          </div>
          <div className="text-center">
            <div className="text-brand-navy text-4xl font-bold">50k+</div>
            <div className="text-gray-600 mt-1">Professionals</div>
          </div>
        </div>
      </div>
    </section>
  );
}
