import { PlayCircle, Users } from 'lucide-react';

const CtaSection = ({ user }) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-green-500/20 via-yellow-500/20 to-emerald-500/20 rounded-3xl p-12 backdrop-blur-sm border border-green-200">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Ready to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500">
              Level Up
            </span>{' '}
            Your Finance?
          </h2>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Join thousands of users who've made their financial journey fun and
            rewarding with Exchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={user ? '/profile' : '/signup'}
              className="group px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              {user ? 'Go to Dashboard' : 'Start Free Trial'}
              <PlayCircle className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </a>
            <a
              href="/agents"
              className="px-10 py-5 border-3 border-green-600 text-green-600 rounded-2xl font-bold text-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Find Agents Near You
              <Users className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
