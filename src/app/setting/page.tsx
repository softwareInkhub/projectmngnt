'use client'
import { useState, useEffect } from "react";
import { useUser } from '../contexts/UserContext';
import { 
  Settings, User, Bell, Shield, Palette, Globe, Mail, Smartphone, Monitor, Moon, Sun, Eye, EyeOff, ChevronRight, Star, FilterX, Grid3X3, List, Heart, ExternalLink, GitCommit, DollarSign, UserCheck, Timer, Flag, Layers, Zap, SortAsc, CheckSquare, Square, Play, Pause, StopCircle, RotateCcw, LineChart, Crown, Trophy, Medal, Users2, UserX, UserCheck2, UserMinus, UserPlus2, Video, Phone, MessageSquare, AlertCircle, Info, Award, TrendingUp, Paperclip, FileText, BarChart, PieChart, ScatterChart, AreaChart, Gauge, Target, TrendingDown, Activity, Filter, Share2, Archive, Copy, Trash2, ArrowUpRight, ArrowDownRight, Minus, Building, MapPin, Home, School, ThumbsUp, ThumbsDown, HelpCircle, BookOpen, Folder, HardDrive, Cpu, HardDriveIcon, Network, WifiIcon, Bluetooth, BluetoothSearching, SmartphoneIcon, Tablet, Upload, Key, Lock, Unlock, Database, Server, Cloud, Wifi, WifiOff, Volume2, VolumeX, Languages, Briefcase
} from "lucide-react";

interface SettingsPageProps {
  open?: boolean;
  onClose?: () => void;
  onOpenTab?: (tabName: string, context?: any) => void;
  project?: any;
  context?: any;
}

export default function SettingsPageComponent({ open = true, onClose, onOpenTab, project, context }: SettingsPageProps = {}) {
  const { currentUser, loading, refreshUserData } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  // Debug useEffect
  useEffect(() => {
    console.log('🔄 SettingsPage - currentUser:', currentUser);
    console.log('🔄 SettingsPage - loading:', loading);
    console.log('🔄 SettingsPage - localStorage user_email:', localStorage.getItem('user_email'));
    console.log('🔄 SettingsPage - localStorage access_token exists:', !!localStorage.getItem('access_token'));
  }, [currentUser, loading]);


  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    desktop: true,
    projectUpdates: true,
    teamMessages: true,
    deadlineReminders: true,
    systemAlerts: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricLogin: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginHistory: true,
    deviceManagement: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    fontSize: "medium",
    compactMode: false,
    animations: true,
    highContrast: false,
    reducedMotion: false
  });

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User, description: "Personal and work information" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Manage notification preferences" },
    { id: "security", label: "Security", icon: Shield, description: "Security and privacy settings" },
    { id: "appearance", label: "Appearance", icon: Palette, description: "Theme and display options" },
    { id: "integrations", label: "Integrations", icon: Globe, description: "Third-party connections" },
    { id: "advanced", label: "Advanced", icon: Settings, description: "Advanced system settings" }
  ];

  const renderProfileTab = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Complete User Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {loading ? '...' : currentUser ? (currentUser.name?.charAt(0) || currentUser.email?.charAt(0) || 'U') : 'U'}
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
                {loading ? 'Loading...' : currentUser ? currentUser.name : 'User Profile'}
              </h3>
              <p className="text-slate-700 text-lg md:text-xl font-medium mt-2">
                {loading ? 'Loading user information...' : currentUser ? `${currentUser.role} • ${currentUser.department || 'No Department'}` : 'No user data'}
              </p>
              <p className="text-base md:text-lg text-slate-600 mt-1">
                {loading ? 'Member since loading...' : currentUser ? `Member since ${new Date(currentUser.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : 'Member since unknown'}
              </p>
            </div>
          </div>
          <button
            onClick={refreshUserData}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold flex items-center gap-3 transition-colors duration-200 shadow-sm"
          >
            <RotateCcw className="w-5 h-5" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Compact Form Layout */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                Personal Details
              </h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.name?.split(' ')[0] || 'User'}
                  placeholder="Enter first name"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.name?.split(' ').slice(1).join(' ') || 'Name'}
                  placeholder="Enter last name"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={loading ? 'Loading...' : currentUser?.email || localStorage.getItem('user_email') || 'No email available'}
                  placeholder="Enter email address"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={loading ? 'Loading...' : currentUser?.phone || 'Not provided'}
                  placeholder="Enter phone number"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Work Details
              </h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.role || 'User'}
                  placeholder="Enter job title"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.department || 'General'}
                  placeholder="Enter department"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Employee ID</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.id || 'Not assigned'}
                  placeholder="Enter employee ID"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.status || 'Active'}
                  placeholder="Enter status"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                Account Details
              </h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.id || 'Not available'}
                  placeholder="User ID"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Join Date</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.joinDate ? new Date(currentUser.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  placeholder="Join date"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Active</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.lastActive ? new Date(currentUser.lastActive).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  placeholder="Last active"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company ID</label>
                <input
                  type="text"
                  value={loading ? 'Loading...' : currentUser?.companyId || 'Default Company'}
                  placeholder="Company ID"
                  className="w-2/3 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base font-medium text-slate-900 placeholder-slate-500 transition-colors duration-200"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Notice */}
        <div className="flex justify-center mt-8 pt-6 border-t border-slate-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4">
            <p className="text-blue-800 text-base font-medium text-center">
              📋 This is your current profile information. Contact your administrator to update any details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Notification Categories */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-500" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-sm text-slate-600">
                  Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-purple-500" />
          Notification Channels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-500" />
              <div>
                <h4 className="font-medium text-slate-900">Email</h4>
                <p className="text-sm text-slate-600">Receive email notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-orange-500" />
              <div>
                <h4 className="font-medium text-slate-900">Push</h4>
                <p className="text-sm text-slate-600">Browser push notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-green-500" />
              <div>
                <h4 className="font-medium text-slate-900">SMS</h4>
                <p className="text-sm text-slate-600">Text message notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-purple-500" />
              <div>
                <h4 className="font-medium text-slate-900">Desktop</h4>
                <p className="text-sm text-slate-600">Desktop notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Password Settings */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-red-500" />
          Password Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          Security Features
        </h3>
        <div className="space-y-4">
          {Object.entries(securitySettings)
            .filter(([key, value]) => typeof value === 'boolean')
            .map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-sm text-slate-600">
                  {key === 'twoFactorAuth' && 'Add an extra layer of security'}
                  {key === 'biometricLogin' && 'Use fingerprint or face recognition'}
                  {key === 'sessionTimeout' && 'Automatically log out after inactivity'}
                  {key === 'passwordExpiry' && 'Require password change every 90 days'}
                  {key === 'loginHistory' && 'Track login attempts and locations'}
                  {key === 'deviceManagement' && 'Manage trusted devices'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Theme Selection */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-500" />
          Theme Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              theme === 'light' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-white/20 bg-slate-50/50 hover:bg-slate-100/50'
            }`}
            onClick={() => setTheme('light')}
          >
            <div className="flex items-center gap-3 mb-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-slate-900">Light</span>
            </div>
            <p className="text-sm text-slate-600">Clean and bright interface</p>
          </div>
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              theme === 'dark' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-white/20 bg-slate-50/50 hover:bg-slate-100/50'
            }`}
            onClick={() => setTheme('dark')}
          >
            <div className="flex items-center gap-3 mb-2">
              <Moon className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-slate-900">Dark</span>
            </div>
            <p className="text-sm text-slate-600">Easy on the eyes</p>
          </div>
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              theme === 'auto' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-white/20 bg-slate-50/50 hover:bg-slate-100/50'
            }`}
            onClick={() => setTheme('auto')}
          >
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="w-5 h-5 text-green-500" />
              <span className="font-medium text-slate-900">Auto</span>
            </div>
            <p className="text-sm text-slate-600">Follows system preference</p>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-indigo-500" />
          Display Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Compact Mode</h4>
              <p className="text-sm text-slate-600">Reduce spacing for more content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearanceSettings.compactMode}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, compactMode: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Animations</h4>
              <p className="text-sm text-slate-600">Enable smooth transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearanceSettings.animations}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, animations: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">High Contrast</h4>
              <p className="text-sm text-slate-600">Increase color contrast</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearanceSettings.highContrast}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, highContrast: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          Connected Services
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Google Workspace</h4>
                <p className="text-sm text-slate-600">Connected for calendar and drive</p>
              </div>
            </div>
            <button className="px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium">
              Disconnect
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Slack</h4>
                <p className="text-sm text-slate-600">Connected for notifications</p>
              </div>
            </div>
            <button className="px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium">
              Disconnect
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">GitHub</h4>
                <p className="text-sm text-slate-600">Connected for repository sync</p>
              </div>
            </div>
            <button className="px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium">
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-500" />
          Advanced Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Debug Mode</h4>
              <p className="text-sm text-slate-600">Enable detailed logging</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Analytics</h4>
              <p className="text-sm text-slate-600">Share usage data for improvements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "notifications":
        return renderNotificationsTab();
      case "security":
        return renderSecurityTab();
      case "appearance":
        return renderAppearanceTab();
      case "integrations":
        return renderIntegrationsTab();
      case "advanced":
        return renderAdvancedTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-blue-100 border-b border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 px-3 md:px-8 py-1 md:py-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">Settings</h1>
              <p className="text-slate-600 mt-1 text-xl">Manage your account and application preferences</p>
            </div>
          </div>
          
        </div>
      </div>

      <div className="px-4 md:px-8 py-4 md:py-8 space-y-4 md:space-y-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Navigation */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Settings</h2>
              <div className="space-y-2">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-600 shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={18} />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-slate-500">{tab.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 