import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div>
            <h3 className="text-xl font-bold mb-6">GIVING WITHOUT LIMIT</h3>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              "And do not forget to do good and to share with others, for with such sacrifices God is pleased." - Hebrews 13:16
            </p>
            <div className="flex space-x-4">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-gold hover:text-primary transition-all">
                  <span className="sr-only">{social}</span>
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-gold">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/programs" className="hover:text-gold transition-colors">Our Programs</Link></li>
              <li><Link to="/impact" className="hover:text-gold transition-colors">Impact Reports</Link></li>
              <li><Link to="/get-involved" className="hover:text-gold transition-colors">Join Our Team</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-gold">Programs</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>Feeding Program</li>
              <li>Addiction Recovery</li>
              <li>Widow Support</li>
              <li>Educational Support</li>
              <li>Kids Club</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-gold">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-4">Stay updated with our latest impact stories.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="bg-secondary text-white px-4 py-2 rounded-l-md w-full focus:outline-none border border-secondary focus:border-gold"
              />
              <button className="bg-gold text-primary px-4 py-2 rounded-r-md font-bold hover:bg-yellow-400 transition-colors">
                GO
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Giving Without Limit (Good Acts). All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
