import React, { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function ValidationErrors({
  errors = [],
  onClose,
  duration = 5000,
}) {
  useEffect(() => {
    if (errors.length > 0 && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [errors, duration, onClose]);

  if (!errors || errors.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-red-50 border border-red-400 text-red-800 rounded-2xl p-6 flex flex-col items-center gap-3 shadow-lg max-w-sm w-full">
        <DotLottieReact
          src="https://lottie.host/f6c3b51c-ffc6-4554-b2e2-881ebffb2617/n2GBvWVlQW.lottie"
          loop
          autoplay
          style={{ width: 100, height: 100 }}
        />
        <div className="text-center">
          {errors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-400 text-white rounded-xl font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
