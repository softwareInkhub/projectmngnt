import { useState } from "react";
import { useUser } from '../contexts/UserContext';
import { 
  Settings, User, Bell, Shield, Palette, Globe, Mail, Smartphone, Monitor, Moon, Sun, Save, Eye, EyeOff, ChevronRight, Star, FilterX, Grid3X3, List, Heart, ExternalLink, GitCommit, DollarSign, UserCheck, Timer, Flag, Layers, Zap, SortAsc, CheckSquare, Square, Play, Pause, StopCircle, RotateCcw, LineChart, Crown, Trophy, Medal, Users2, UserX, UserCheck2, UserMinus, UserPlus2, Video, Phone, MessageSquare, AlertCircle, Info, Award, TrendingUp, Paperclip, FileText, BarChart, PieChart, ScatterChart, AreaChart, Gauge, Target, TrendingDown, Activity, Filter, Share2, Archive, Copy, Trash2, ArrowUpRight, ArrowDownRight, Minus, Building, MapPin, Home, School, ThumbsUp, ThumbsDown, HelpCircle, BookOpen, Folder, HardDrive, Cpu, HardDriveIcon, Network, WifiIcon, Bluetooth, BluetoothSearching, SmartphoneIcon, Tablet, Download, Upload, Key, Lock, Unlock, Database, Server, Cloud, Wifi, WifiOff, Volume2, VolumeX, Languages, Briefcase
} from "lucide-react";

export default function SettingsPage() {
  const { currentUser, loading } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
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
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-white/20">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl">
            {loading ? '...' : currentUser ? (currentUser.name?.charAt(0) || currentUser.email?.charAt(0) || 'U') : 'U'}
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">
              {loading ? 'Loading...' : currentUser ? currentUser.name : 'User Profile'}
            </h3>
            <p className="text-sm md:text-base text-slate-600">
              {loading ? 'Loading user information...' : currentUser ? `${currentUser.role} • ${currentUser.department || 'No Department'}` : 'No user data'}
            </p>
            <p className="text-xs md:text-sm text-slate-500">
              {loading ? 'Member since loading...' : currentUser ? `Member since ${new Date(currentUser.joinDate).toLocaleDateString()}` : 'Member since unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-white/20">
        <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
          <User className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">First Name</label>
            <input
              type="text"
              defaultValue={currentUser?.name?.split(' ')[0] || ''}
              placeholder="Enter first name"
              className="w-full px-2 md:px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
            <input
              type="text"
              defaultValue={currentUser?.name?.split(' ').slice(1).join(' ') || ''}
              placeholder="Enter last name"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={currentUser?.email || ''}
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input
              type="tel"
              defaultValue={currentUser?.phone || ''}
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Work Information */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-green-500" />
          Work Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
            <input
              type="text"
              defaultValue={currentUser?.role || ''}
              placeholder="Enter job title"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
            <input
              type="text"
              defaultValue={currentUser?.department || ''}
              placeholder="Enter department"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Employee ID</label>
            <input
              type="text"
              defaultValue={currentUser?.id || ''}
              placeholder="Enter employee ID"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <input
              type="text"
              defaultValue={currentUser?.status || ''}
              placeholder="Enter status"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring">
          <Save size={18} />
          Save Changes
        </button>
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg md:rounded-xl bg-gradient-to-r from-slate-500 to-gray-600 text-white font-semibold shadow-lg">
            <Settings className="text-white mr-1" size={18} className="md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Settings</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            className="group flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring text-xs md:text-sm"
          >
            <Download size={14} className="md:w-4 md:h-4" />
            <span className="hidden md:inline">Export Settings</span>
            <span className="md:hidden">Export</span>
          </button>
          <button 
            className="group flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring text-sm md:text-base"
          >
            <Save size={18} className="md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden md:inline">Save All</span>
            <span className="md:hidden">Save</span>
          </button>
        </div>
      </div>

      <div className="p-3 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Settings Navigation */}
          <div className="lg:w-80">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-white/20">
              <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Settings</h2>
              <div className="space-y-1 md:space-y-2">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-600 shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                      <div>
                        <div className="font-medium text-sm md:text-base">{tab.label}</div>
                        <div className="text-xs text-slate-500 hidden md:block">{tab.description}</div>
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