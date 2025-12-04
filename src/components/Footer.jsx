import { Gamepad2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <footer className={`${isHomePage ? 'bg-black' : 'bg-teal-950'} text-white py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo + Tagline */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-yellow-400 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black">Exchain</span>
            </div>
            <p className="text-green-200">Making finance fun since today</p>
          </div>

          {/* Section Scroll Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <a
              href="/#hero"
              className="text-green-200 hover:text-white transition-colors px-2 py-1 rounded hover:bg-green-800/30"
            >
              Hero
            </a>

            <a
              href="/#features"
              className="text-green-200 hover:text-white transition-colors px-2 py-1 rounded hover:bg-green-800/30"
            >
              Features
            </a>

            <a
              href="/#cta"
              className="text-green-200 hover:text-white transition-colors px-2 py-1 rounded hover:bg-green-800/30"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className={`mt-8 pt-8 border-t ${isHomePage ? 'border-green-800' : 'border-teal-700'} text-center text-green-300`}>
          <p>© 2025 Exchain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;