import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles.css';

// Background images live in public/assets and are referenced from CSS via
// custom properties (instead of a hardcoded absolute url()) so they resolve
// correctly under Vite's configured `base` (e.g. GitHub Pages project path).
const heroBase = `${import.meta.env.BASE_URL}assets/`;
document.documentElement.style.setProperty('--hero-bg', `url(${heroBase}raizes-food-banner.png)`);
document.documentElement.style.setProperty('--quitanda-hero-bg', `url(${heroBase}quitanda-school-meal-hero.png)`);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
