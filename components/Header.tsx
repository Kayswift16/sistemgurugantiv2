import React from 'react';

const ClipboardListIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.15 2.25 2.25 0 0 0 2.25 2.25h.008a2.25 2.25 0 0 0 2.25-2.25 2.25 2.25 0 0 1 2.25-2.25h.008a2.25 2.25 0 0 1 2.25 2.25v.632m-11.585 7.428a2.25 2.25 0 0 0 2.25 2.25h5.171a2.25 2.25 0 0 0 2.25-2.25v-5.172a2.25 2.25 0 0 0-2.25-2.25H6.375a2.25 2.25 0 0 0-2.25 2.25v5.172Z" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="w-full p-4 border-b border-slate-200 bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <ClipboardListIcon className="w-8 h-8 mr-3 text-indigo-600" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Sistem Guru Ganti
        </h1>
      </div>
    </header>
  );
};