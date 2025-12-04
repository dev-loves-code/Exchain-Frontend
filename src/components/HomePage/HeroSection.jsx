import {
  ArrowRight,
  Lock,
  Zap,
  Users,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import BmoCharacter from './BmoCharacter';

const HeroSection = ({ user, bmoActive, onBmoClick }) => {
  const messages = [
    "Hello! I'm BMO!",
    'Welcome to Exchain!',
    'Secure payments made fun!',
    "Let's make transactions!",
    'Beep boop! Ready to go!',
  ];

  const [screenText, setScreenText] = useState('');

  useEffect(() => {
    if (!bmoActive) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      setScreenText(messages[currentIndex]);
      currentIndex = (currentIndex + 1) % messages.length;
    }, 2000);

    return () => clearInterval(interval);
  }, [bmoActive]);

  const stats = [
    { value: '99.9%', label: 'Uptime', icon: Zap },
    { value: '1M+', label: 'Users', icon: Users },
    { value: '50+', label: 'Countries', icon: Globe },
    { value: '24/7', label: 'Support', icon: MessageSquare },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
          <div className="lg:w-1/2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500">
                Exchain
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              The most fun, secure, and friendly way to manage your money.
              Powered by cutting-edge technology and a sprinkle of magic! ✨
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {user ? (
                <a
                  href="/profile"
                  className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </a>
              ) : (
                <>
                  <a
                    href="/signup"
                    className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </a>
                  <a
                    href="/login"
                    className="px-8 py-4 border-2 border-green-600 text-green-600 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Sign In
                    <Lock className="w-5 h-5" />
                  </a>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-100 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-black text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <BmoCharacter
            active={bmoActive}
            onToggle={onBmoClick}
            screenText={screenText}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
