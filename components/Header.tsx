"use client";

import { useEffect, useState } from "react";

const SunIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 7a5 5 0 100 10 5 5 0 000-10z"/>
  </svg>
);

const MoonIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const Header = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") {
        document.documentElement.classList.add("dark");
        setTheme("dark");
        return;
      }
      if (stored === "light") {
        document.documentElement.classList.remove("dark");
        setTheme("light");
        return;
      }
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
        setTheme("dark");
      } else {
        document.documentElement.classList.remove("dark");
        setTheme("light");
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  return (
    <header className="liquid-glass flex items-center justify-between py-4 md:py-6 px-4 md:px-6 mx-auto w-full">
      <div className="flex items-center gap-2 max-w-360 w-full mx-auto">
        <span className="text-xl font-bold">StreamCoin</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted/10 focus:outline-none"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
