import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROGRAMS, IMPACT_STATS } from '../constants';

const Home: React.FC = () => {
  const [counts, setCounts] = useState(IMPACT_STATS.map(() => 0));
  const navigate = useNavigate();

  useEffect(() => {
    const intervals = IMPACT_STATS.map((stat, index) => {
      const increment = Math.ceil(stat.value / 100);
      return setInterval(() => {
        setCounts(prev => {
          const next = [...prev];
          if (next[index] < stat.value) {
            next[index] = Math.min(next[index] + increment, stat.value);
            return next;
          }
          clearInterval(intervals[index]);
          return prev;
        });
      }, 20);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img
            src="/hero.jpeg"
            className="w-full h-full object-cover opacity-60"
            alt="Giving Without Limit Outreach"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl animate-count">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Giving Without <span className="text-gold">Limit</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light">
              Spreading the Kindness through Christian Humanitarian Aid. We serve as family to the destitutes and hope to the hopeless.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/donate"
                className="bg-gold text-primary text-center font-bold text-lg px-10 py-4 rounded-full hover:bg-yellow-400 transition-all shadow-xl"
              >
                DONATE NOW
              </Link>
              <Link
                to="/about"
                className="bg-transparent border-2 border-white text-center text-white font-bold text-lg px-10 py-4 rounded-full hover:bg-white/10 transition-all"
              >
                OUR STORY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {IMPACT_STATS.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
                  {counts[idx].toLocaleString()}{stat.suffix}
                </div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Our Divine Mandate</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">Spreading the Kindness to the Vulnerable</h3>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2016, Giving Without Limit operates with the mission of providing aid to those living under $2 per day. We are motivated by the biblical calling to care for our neighbors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Father to Fatherless', desc: 'To defend the defenseless with unconditional care.', icon: 'child' },
              { title: 'Husband to Widows', desc: 'Restoring life and hope through companionship.', icon: 'heart' },
              { title: 'Family to Destitutes', desc: 'Rehabilitating and helping fulfill purpose.', icon: 'users' },
              { title: 'Friend to Despised', desc: 'Giving opportunities and empowerment to the distorted.', icon: 'user-friends' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-gold hover:-translate-y-2 transition-transform">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-gold mb-6 text-2xl">
                  <i className={`fas fa-${item.icon}`}></i>
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Our Work</h2>
              <h3 className="text-3xl font-bold text-primary">Featured Programs</h3>
            </div>
            <Link to="/programs" className="text-primary font-bold hover:text-gold transition-colors hidden md:block">
              VIEW ALL PROGRAMS <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROGRAMS.slice(0, 3).map((program) => (
              <div key={program.id} className="group overflow-hidden rounded-3xl shadow-xl relative">
                <div className="h-64 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 bg-white border-b-8 border-primary group-hover:border-gold transition-colors">
                  <div className="text-gold text-xs font-bold mb-2 uppercase tracking-wide italic">"{program.tagline}"</div>
                  <h4 className="text-2xl font-bold text-primary mb-4">{program.title}</h4>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">{program.description}</p>
                  <button
                    onClick={() => navigate('/programs')}
                    className="text-primary font-extrabold text-sm uppercase flex items-center group-hover:text-gold"
                  >
                    Learn More <i className="fas fa-plus-circle ml-2"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2 opacity-5"></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-white text-3xl md:text-5xl font-bold mb-8">Ready to join us in spreading kindness?</h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Your support, whether through time or resources, directly impacts lives across Nigeria and beyond.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/donate"
              className="bg-gold text-primary text-center font-bold px-12 py-5 rounded-full hover:bg-yellow-400 transition-all text-xl"
            >
              DONATE NOW
            </Link>
            <Link
              to="/get-involved"
              className="bg-white text-primary text-center font-bold px-12 py-5 rounded-full hover:bg-gray-100 transition-all text-xl"
            >
              BECOME A VOLUNTEER
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
