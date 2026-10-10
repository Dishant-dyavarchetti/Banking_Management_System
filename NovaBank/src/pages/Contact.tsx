import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import * as storage from '@/utils/storage';
import Alert from '@/components/Alert';
import type { ContactQuery } from '@/types';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    details: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Please enter a valid email address.';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!form.details.trim()) newErrors.details = 'Query details are required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    if (!validate()) return;

    const query: ContactQuery = {
      id: `QRY${Date.now().toString(36).toUpperCase()}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim(),
      details: form.details.trim(),
      date: new Date().toISOString(),
    };

    storage.saveQuery(query);
    setSuccess('Your query has been recorded for this demo.');
    setForm({ name: '', email: '', subject: '', details: '' });
    setErrors({});
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@novabank.demo' },
    { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
    { icon: MapPin, label: 'Office', value: '123 Demo Street, Mumbai, India 400001' },
    { icon: Clock, label: 'Business Hours', value: 'Monday – Friday, 9:00 AM – 6:00 PM' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Contact Us</h1>
          <p className="text-gray-500">Have a question? Submit your query and we'll record it for this demo.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Demo Contact Details</h2>
            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div key={info.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{info.label}</p>
                      <p className="text-sm font-medium text-navy-900">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-700">
                These are fictional contact details for demonstration purposes only. No real
                communication will occur. Queries are stored locally in your browser.
              </p>
            </div>
          </div>

          {/* Query form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent-600" />
              Submit Your Query
            </h2>

            {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  placeholder="Brief subject of your query"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
                {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Query Details</label>
                <textarea
                  value={form.details}
                  onChange={(e) => handleChange('details', e.target.value)}
                  placeholder="Describe your query in detail"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all resize-none"
                />
                {errors.details && <p className="text-xs text-red-600 mt-1">{errors.details}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 text-white font-medium hover:bg-accent-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Query
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
