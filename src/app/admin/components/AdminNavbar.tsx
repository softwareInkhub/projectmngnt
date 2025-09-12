'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  User
} from 'lucide-react';
import { logout } from '../../utils/auth';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Right side - Notifications and profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Admin Profile Display */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
              <User size={20} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800 hidden md:block">Admin User</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
