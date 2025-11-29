import React, { useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function SuccessPopup({ message, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50">
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center">
        <DotLottieReact
          src="https://lottie.host/bfd1aa46-0357-42b2-afa8-ea983bcc61d0/UzpzL4aWZq.lottie"
          autoplay
          loop={false}
          style={{ width: 300, height: 300 }} // increased size
        />
        <p className="mt-4 font-bold text-lg text-gray-900 text-center">{message}</p>
      </div>
    </div>
  );
}
