import { ExternalLink, Star } from 'lucide-react';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

import { products } from '../../data/products';

export function RecommendedProducts() {
  return (
    <section className="py-20 bg-white" id="bookstore">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-brand-navy mb-3 text-[42px] font-bold">
            Recommended Products
          </h2>
          <p className="text-gray-600 text-lg">
            Curated lab equipment and textbooks from trusted vendors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-brand-emerald transition-all group"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <OptimizedImage
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-brand-emerald mb-2 text-sm font-semibold">
                  {product.category}
                </div>
                <h3 className="text-brand-navy mb-3 text-lg font-semibold leading-snug">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <button className="w-full bg-gray-900 hover:bg-brand-emerald text-white py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-[15px] font-semibold">
                  View on Amazon
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
