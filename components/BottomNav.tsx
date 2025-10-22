
import React from 'react';
import type { View } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CogIcon } from './icons/CogIcon';

interface BottomNavProps {
  activeView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-primary' : 'text-text-muted hover:text-primary/80'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-sm border-t border-border shadow-t-lg z-50">
      <div className="flex justify-around items-center h-full max-w-4xl mx-auto">
        <NavItem
          label="Home"
          icon={<HomeIcon className="w-6 h-6 mb-1" />}
          isActive={activeView === 'home'}
          onClick={() => setView('home')}
        />
        <NavItem
          label="Study"
          icon={<BookOpenIcon className="w-6 h-6 mb-1" />}
          isActive={activeView === 'study'}
          onClick={() => setView('study')}
        />
        <NavItem
          label="Settings"
          icon={<CogIcon className="w-6 h-6 mb-1" />}
          isActive={activeView === 'settings'}
          onClick={() => setView('settings')}
        />
      </div>
    </nav>
  );
};
