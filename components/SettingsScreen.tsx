import React from 'react';
import type { BaseTheme, AccentColor } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface SettingsScreenProps {
  currentBaseTheme: BaseTheme;
  onBaseThemeChange: (theme: BaseTheme) => void;
  currentAccentColor: AccentColor;
  onAccentColorChange: (color: AccentColor) => void;
}

const accentColors: { id: AccentColor; name: string; colorClass: string }[] = [
    { id: 'sky', name: 'Sky', colorClass: 'bg-sky-500' },
    { id: 'green', name: 'Green', colorClass: 'bg-green-500' },
    { id: 'yellow', name: 'Yellow', colorClass: 'bg-yellow-500' },
    { id: 'blue', name: 'Blue', colorClass: 'bg-blue-500' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  currentBaseTheme, 
  onBaseThemeChange,
  currentAccentColor,
  onAccentColorChange
}) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <section className="bg-card p-6 rounded-app shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-text-base">Appearance</h2>
        <p className="text-text-muted mb-6">Choose how Cardify looks and feels.</p>

        <div className="space-y-6">
            <div>
                <label htmlFor="theme-select" className="block text-sm font-medium text-text-muted mb-2">
                    Theme
                </label>
                <select
                    id="theme-select"
                    value={currentBaseTheme}
                    onChange={(e) => onBaseThemeChange(e.target.value as BaseTheme)}
                    className="w-full max-w-xs px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                    Accent Color
                </label>
                <div className="flex space-x-3">
                    {accentColors.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => onAccentColorChange(color.id)}
                            aria-label={`Set accent color to ${color.name}`}
                            className={`w-10 h-10 rounded-full ${color.colorClass} transition-transform duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary`}
                        >
                           {currentAccentColor === color.id && (
                               <div className="w-full h-full bg-black/30 rounded-full flex items-center justify-center">
                                   <CheckIcon className="w-6 h-6 text-white" />
                               </div>
                           )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};