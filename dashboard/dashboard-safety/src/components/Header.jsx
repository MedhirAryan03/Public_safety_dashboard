import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative backdrop-blur-xl bg-black/95 border-b border-gray-800/50 shadow-2xl z-[100]">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
      
      {/* Changed max-w-7xl to max-w-[100%] or px-4 to maximize spread */}
      <nav className="relative w-full px-4 sm:px-8 lg:px-12">
        {/* GRID LAYOUT: 
            3 columns (Left, Center, Right). 
            Center is auto-width, Left/Right take up remaining space.
        */}
        <div className="grid grid-cols-3 items-center h-20">
          
          {/* 1. Logo - Pushed to the far Left */}
          <div className="flex justify-start">
            <a href="/" className="flex items-center group">
              <div className="relative mr-3">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight leading-none uppercase">Urban Ride</span>
                <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase mt-1">Safety Systems</span>
              </div>
            </a>
          </div>

          {/* 2. Navigation - Perfectly Centered */}
          <div className="hidden md:flex justify-center items-center space-x-2 lg:space-x-6">
            <NavLink href="#technologies">Technologies</NavLink>
            <NavLink href="#resources">Resources</NavLink>
            <NavLink href="#safety">Safety</NavLink>
            <NavLink href="#insights">Insights</NavLink>
            <NavLink href="#community">Community</NavLink>
          </div>

          {/* 3. Right Side Actions - Pushed to the far Right */}
          <div className="flex justify-end items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-1">
                <IconButton aria-label="Search">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </IconButton>
                <IconButton aria-label="Notifications" hasBadge>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </IconButton>
            </div>
            
            <div className="hidden md:block h-8 w-px bg-gray-800 mx-2"></div>
            
            <button className="hidden sm:block px-5 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
              Sign In
            </button>
            
            <button className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
              Get Started
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-6 space-y-4">
            <MobileNavLink href="#technologies">Technologies</MobileNavLink>
            <MobileNavLink href="#resources">Resources</MobileNavLink>
            <MobileNavLink href="#safety">Safety</MobileNavLink>
            <div className="pt-4 border-t border-gray-800">
                <button className="w-full py-3 text-white bg-blue-600 rounded-xl font-bold">Get Started</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

// Reusable Components
const NavLink = ({ href, children }) => (
  <a href={href} className="relative px-2 py-1 text-[13px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors group">
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
  </a>
);

const MobileNavLink = ({ href, children }) => (
  <a href={href} className="block text-lg font-semibold text-gray-300 hover:text-blue-500 py-2 transition-colors">
    {children}
  </a>
);

const IconButton = ({ children, hasBadge }) => (
    <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all relative">
        {children}
        {hasBadge && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-black"></span>}
    </button>
);

export default Header;