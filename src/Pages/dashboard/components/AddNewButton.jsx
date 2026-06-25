import { Plus } from 'lucide-react';

export default function AddNewButton({ onClick, label }) {
  return (
    <button onClick={onClick} className="relative group shrink-0 cursor-target no-neo">
      {/* Glow / gradient background effect using dynamic CSS variables */}
      <div 
        className="absolute -inset-0.5 rounded-xl opacity-50 blur group-hover:opacity-100 transition duration-300"
        style={{ 
          background: 'linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))' 
        }}
      />
      
      {/* Button Body */}
      <div 
        className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 transition-colors"
        style={{ backgroundColor: 'var(--color-backdrop-base)' }}
      >
        <Plus className="w-4 h-4" style={{ color: 'var(--color-primary-light)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </span>
      </div>
    </button>
  );
}
