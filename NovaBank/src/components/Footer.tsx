import { Link } from 'react-router-dom';
import { Landmark, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Nova<span className="text-accent-400">Bank</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              NovaBank is a fictional digital banking platform built for educational purposes.
              All users, accounts, balances, and transactions are simulated. This is not a real
              bank and no real money is involved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-accent-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent-400 transition-colors">Contact</Link></li>
              <li><Link to="/loan" className="hover:text-accent-400 transition-colors">Loans</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Demo Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-accent-400" />
                <span>support@novabank.demo</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-accent-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-accent-400" />
                <span>123 Demo Street, Mumbai, India</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-accent-400" />
                <span>Mon–Fri, 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} NovaBank. A fictional demo project for educational use only.
          </p>
          <p className="text-xs text-gray-500">
            Not a real bank. No real financial services provided.
          </p>
        </div>
      </div>
    </footer>
  );
}
