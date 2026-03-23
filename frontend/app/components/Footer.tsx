'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1621] border-t border-[#232a3a]">
      <div className="max-w-7xl 2xl:max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 mb-12 xl:mb-16 2xl:mb-20">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl mb-4 xl:mb-6">SneakHub</h3>
            <p className="text-[#7a8ba8] text-sm sm:text-base leading-relaxed">
              Your ultimate destination for premium sneakers. We connect you with authentic shoes from top global brands with fast shipping and secure checkout.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl mb-4 xl:mb-6">Navigation</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link href="/" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl mb-4 xl:mb-6">Support</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a href="mailto:support@sneakhub.com" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Email Support
                </a>
              </li>
              <li>
                <a href="tel:+1-800-SNEAK-HUB" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Call Us
                </a>
              </li>
              <li>
                <Link href="/products" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl mb-4 xl:mb-6">Legal</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link href="/products" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#7a8ba8] hover:text-white transition text-sm xl:text-base">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#232a3a] mb-8 xl:mb-12 2xl:mb-16"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
          {/* Copyright */}
          <p className="text-[#7a8ba8] text-sm sm:text-base text-center sm:text-left">
            © {currentYear} SneakHub. All rights reserved. | Crafted with ❤️ for sneaker enthusiasts
          </p>

          {/* Social Links */}
          <div className="flex gap-4 sm:gap-6 xl:gap-8">
            <a
              href="#"
              className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[#1a2332] hover:bg-purple-600 flex items-center justify-center text-[#7a8ba8] hover:text-white transition text-lg sm:text-xl"
              aria-label="Twitter"
            >
              𝕏
            </a>
            <a
              href="#"
              className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[#1a2332] hover:bg-pink-600 flex items-center justify-center text-[#7a8ba8] hover:text-white transition text-lg sm:text-xl"
              aria-label="Instagram"
            >
              📷
            </a>
            <a
              href="#"
              className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[#1a2332] hover:bg-blue-600 flex items-center justify-center text-[#7a8ba8] hover:text-white transition text-lg sm:text-xl"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="#"
              className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[#1a2332] hover:bg-red-600 flex items-center justify-center text-[#7a8ba8] hover:text-white transition text-lg sm:text-xl"
              aria-label="YouTube"
            >
              ▶
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
