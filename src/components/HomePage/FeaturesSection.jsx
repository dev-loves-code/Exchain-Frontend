import { Shield, Zap, Users, Wallet, Globe, Smartphone } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Bank-Level Security',
      desc: 'Your funds are protected with military-grade encryption',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Instant Transactions',
      desc: 'Send and receive money in seconds, not days',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      icon: Users,
      title: 'Agent Network',
      desc: 'Access thousands of agents worldwide',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Wallet,
      title: 'Digital Wallet',
      desc: 'All your currencies in one secure place',
      color: 'from-lime-400 to-green-500',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      desc: 'Send money to over 150 countries',
      color: 'from-emerald-400 to-cyan-500',
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      desc: 'Full functionality on any device',
      color: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Why{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500">
              Choose
            </span>{' '}
            Exchain?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge technology with a playful approach to make
            finance fun and accessible for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-8 border-2 border-transparent hover:border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
