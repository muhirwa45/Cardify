
import React from 'react';
import type { Theme } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface SettingsScreenProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes: { id: Theme; name: string; colors: string[] }[] = [
  { id: 'light', name: 'Light', colors: ['bg-slate-100', 'bg-white', 'bg-sky-500'] },
  { id: 'dark', name: 'Dark', colors: ['bg-slate-900', 'bg-slate-800', 'bg-sky-400'] },
  { id: 'green', name: 'Green', colors: ['bg-slate-100', 'bg-white', 'bg-green-500'] },
  { id: 'yellow', name: 'Yellow', colors: ['bg-slate-100', 'bg-white', 'bg-yellow-500'] },
  { id: 'dark-blue', name: 'Dark Blue', colors: ['bg-slate-900', 'bg-slate-800', 'bg-blue-400'] },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <section className="bg-card p-6 rounded-app shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-text-base">Theme</h2>
        <p className="text-text-muted mb-6">Choose how Cardify looks and feels.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              aria-pressed={currentTheme === theme.id}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary rounded-app"
            >
              <div className="relative border-2 rounded-app p-2 transition-colors"
                style={{ borderColor: currentTheme === theme.id ? 'rgb(var(--color-primary))' : 'rgb(var(--color-border))' }}
              >
                <div className="aspect-[4/3] rounded-md overflow-hidden">
                  <div className={`w-full h-full flex flex-col ${theme.colors[0]}`}>
                    <div className="flex-1 p-2 flex justify-end">
                      <div className={`w-6 h-6 rounded-full ${theme.colors[2]}`}></div>
                    </div>
                    <div className={`flex-grow ${theme.colors[1]} m-2 rounded`}></div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mt-2 text-text-base text-center">{theme.name}</h3>

                {currentTheme === theme.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-content border-2 border-background">
                    <CheckIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
