import React, { useState } from 'react';
import { Settings, LogOut, Lock, X } from 'lucide-react';

const SettingsMenu = ({ onLogout, onResetPassword }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Settings Button */}
      <button
        onClick={toggleMenu}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] 
                   shadow-lg flex items-center justify-center transition-all duration-300 
                   hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ff7e5f] focus:ring-opacity-50"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Settings className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Menu */}
      {isOpen && (
        <div className="absolute top-16 right-0 bg-gradient-to-br from-[#1c2331] to-[#2a3547]
                      backdrop-blur-md border border-white/10 rounded-lg shadow-xl 
                      min-w-[200px] overflow-hidden">
          {/* Reset Password */}
          <button
            onClick={() => {
              onResetPassword();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/5 
                     transition-colors duration-200"
          >
            <Lock className="w-5 h-5" />
            <span>Reset Password</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/5 
                     transition-colors duration-200 border-t border-white/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;