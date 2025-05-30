import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/images/agri-logo.svg" 
              alt="AGRI Western Cape Logo" 
              className="h-12 mr-3" 
            />
            <div>
              <p className="text-white font-semibold">AGRI Western Cape</p>
              <p className="text-sm">Supporting rural safety through technology</p>
            </div>
          </div>
          <div className="text-center md:text-right text-sm">
            <p>&copy; {new Date().getFullYear()} AGRI FarmWatch AI. All rights reserved.</p>
            <p className="mt-1">WES-KAAP • WESTERN CAPE • iKAPA</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;