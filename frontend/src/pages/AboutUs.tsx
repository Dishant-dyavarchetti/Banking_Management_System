import { Target, Eye, Heart, GraduationCap, Info } from 'lucide-react';

export default function AboutUs() {
  const values = [
    { title: 'Transparency', desc: 'Every transaction, calculation, and balance is visible and traceable in the demo ledger.' },
    { title: 'Learning First', desc: 'The code is structured to be beginner-friendly with clear comments and simple patterns.' },
    { title: 'Safety Awareness', desc: 'PIN protection and attempt limits demonstrate basic security concepts without claiming to be production-grade.' },
    { title: 'Accessibility', desc: 'A responsive design that works across mobile, tablet, and desktop devices.' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 to-accent-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>College Project</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">About NovaBank</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A fictional digital banking platform built for educational purposes to demonstrate
            modern web development with React.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Our Story */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
              <Info className="w-5 h-5 text-accent-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900">Our Story</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            NovaBank was created as a college project to explore how a modern digital banking
            dashboard works — from PIN-protected balance viewing to loan EMI calculations and
            transaction ledgers. It is entirely fictional: there is no real bank, no real money,
            and no real financial services. Every user, account, balance, and transaction in this
            application is simulated and stored locally in your browser using localStorage.
          </p>
        </section>

        {/* Our Mission */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To provide a hands-on learning experience that demonstrates how a banking application
            handles core operations like deposits, transfers, loans, and transaction history —
            all while being simple enough for a beginner to read, understand, and explain. The
            project focuses on clean code, consistent financial calculations, and a realistic
            user experience without any real-world financial risk.
          </p>
        </section>

        {/* Our Values */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-accent-600" />
                  <h3 className="font-semibold text-navy-900">{value.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Simulated Experience */}
        <section className="bg-gradient-to-br from-accent-50 to-navy-50 rounded-2xl p-8 border border-accent-100">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">The Simulated Banking Experience</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            NovaBank simulates the following banking features entirely in your browser:
          </p>
          <ul className="space-y-2 text-sm text-navy-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-600 mt-2 flex-shrink-0" />
              <span><strong>Account creation</strong> with Savings or Current account types and a 4-digit PIN</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-600 mt-2 flex-shrink-0" />
              <span><strong>PIN-protected balance viewing</strong> with a 3-attempt lockout and recovery flow</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-600 mt-2 flex-shrink-0" />
              <span><strong>Deposits and simulated fund transfers</strong> with full transaction records</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-600 mt-2 flex-shrink-0" />
              <span><strong>Loan applications</strong> with automatic EMI calculation and repayment tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-600 mt-2 flex-shrink-0" />
              <span><strong>Transaction history</strong> with type and date filters</span>
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-6 italic">
            NovaBank is not a registered bank. It does not offer real financial services.
            All data is fictional and for educational use only.
          </p>
        </section>
      </div>
    </div>
  );
}
