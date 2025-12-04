import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HomePage/HeroSection';
import FeaturesSection from '../components/HomePage/FeaturesSection';
import CtaSection from '../components/HomePage/CtaSection';

const HomePage = () => {
  const { user } = useAuth();
  const [bmoActive, setBmoActive] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-yellow-50 to-emerald-50">
      <div id="hero">
        <HeroSection
          user={user}
          bmoActive={bmoActive}
          onBmoClick={() => setBmoActive(!bmoActive)}
        />
      </div>

      <div id="features">
        <FeaturesSection />
      </div>

      <div id="cta">
        <CtaSection user={user} />
      </div>
    </div>
  );
};

export default HomePage;
