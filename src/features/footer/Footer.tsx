import { Mail, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Newsletter Signup */}
          <div>
            <h3 className="mb-3 text-2xl font-bold">
              Never Miss an Exam Update
            </h3>
            <p className="text-gray-300 mb-6 text-base">
              Get the latest chemistry job postings, exam notifications, and study resources delivered to your inbox
            </p>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg border border-white/20">
                <Mail className="w-5 h-5 text-gray-300" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                />
              </div>
              <button className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-8 py-3 rounded-lg transition-colors whitespace-nowrap text-base font-semibold">
                Subscribe
              </button>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center md:justify-end">
            <div className="flex items-center gap-4">
              <span className="text-gray-300 mr-2">Follow us:</span>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-brand-emerald rounded-full flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-brand-emerald rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-brand-emerald rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-brand-emerald rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 TheChemstore. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
