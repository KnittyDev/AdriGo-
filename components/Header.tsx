'use client';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-4">
              <div className="h-8 w-8">
                <img 
                  src="/adrigologo.png" 
                  alt="AdriGo+ Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-primary">AdriGo+</h2>
            </a>
            <nav className="hidden items-center gap-8 md:flex md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
              <a className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary" href="/features">Features</a>
              <a className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary" href="/pricing">Pricing</a>
              <a className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary" href="/locations">Locations</a>
              <a className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary" href="/#download">Download</a>
              <a className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary" href="/contact">Contact</a>
            </nav>
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined !text-xl">
                  {isMobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg sticky top-16 z-40">
          <div className="px-4 py-4 space-y-3">
            <a 
              className="block text-base font-medium text-text-secondary hover:text-text-primary transition-colors py-2"
              href="/features"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              className="block text-base font-medium text-text-secondary hover:text-text-primary transition-colors py-2"
              href="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              className="block text-base font-medium text-text-secondary hover:text-text-primary transition-colors py-2"
              href="/locations"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Locations
            </a>
            <a 
              className="block text-base font-medium text-text-secondary hover:text-text-primary transition-colors py-2"
              href="/#download"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Download
            </a>
            <a 
              className="block text-base font-medium text-text-secondary hover:text-text-primary transition-colors py-2"
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            
            {/* Mobile Language Selector */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-text-secondary">language</span>
                <span className="text-sm font-medium text-text-secondary">Language</span>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
