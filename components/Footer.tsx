import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Farm Watch AI. All rights reserved.</p>
        <p className="mt-1">Supporting rural safety through technology.</p>
      </div>
    </footer>
  );
};

export default Footer;