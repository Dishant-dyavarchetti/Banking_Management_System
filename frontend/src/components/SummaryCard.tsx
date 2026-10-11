import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'navy';
}

const colorStyles = {
  blue: { bg: 'bg-accent-50', text: 'text-accent-600', icon: 'bg-accent-100 text-accent-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100 text-green-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100 text-orange-600' },
  purple: { bg: 'bg-pink-50', text: 'text-pink-600', icon: 'bg-pink-100 text-pink-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100 text-red-600' },
  navy: { bg: 'bg-navy-50', text: 'text-navy-700', icon: 'bg-navy-100 text-navy-700' },
};

export default function SummaryCard({ title, value, icon, color = 'blue' }: SummaryCardProps) {
  const styles = colorStyles[color];
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.icon}`}>
          {icon}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className={`text-xl font-bold ${styles.text}`}>{value}</p>
    </div>
  );
}
