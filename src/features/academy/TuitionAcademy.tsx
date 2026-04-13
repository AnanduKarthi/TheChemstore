import { GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

const features = [
  'Expert faculty with 15+ years experience',
  'Small batch sizes for personalized attention',
  'Comprehensive study material included',
  'Regular mock tests and assessments',
];

export function TuitionAcademy() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white" id="academy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1758685734201-72662f1a368d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBzdHVkZW50JTIwbGVhcm5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzc1MjI5Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Chemistry student learning with teacher"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981] bg-opacity-10 rounded-full mb-6">
              <GraduationCap className="w-5 h-5 text-[#10B981]" />
              <span className="text-brand-emerald text-sm font-semibold">
                The Academy
              </span>
            </div>

            <h2 className="text-brand-navy mb-4 text-[42px] font-bold leading-tight">
              Master Chemistry for JEE & NEET
            </h2>

            <p className="text-gray-600 mb-8 text-lg leading-[1.7]">
              Join our elite coaching program designed for high school students preparing for competitive exams. Get personalized guidance from top educators.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-base font-semibold">
                Book a Free Demo
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white px-8 py-3 rounded-lg transition-all text-base font-semibold">
                View Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
