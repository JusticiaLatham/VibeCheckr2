import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Building2, 
  Calendar, 
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Star,
  BarChart,
  Zap,
  Slack,
  Gift,
  Rocket,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigation = [
    // Top Level
    { name: 'Company', href: '/company', icon: Building2, section: 'top' },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'top' },
    { name: 'Calendar', href: '/calendar', icon: Calendar, section: 'top' },
    { name: 'Slack', href: '/slack', icon: Slack, section: 'top' },
    
    // Surveys Section
    { name: 'Surveys', href: '/surveys', icon: FileText, section: 'surveys' },
    { name: 'Survey Analytics', href: '/analytics', icon: BarChart3, section: 'surveys' },
    { name: 'Survey Notifications', href: '/notifications', icon: Bell, section: 'surveys' },
    
    // Reviews Section
    { name: 'Reviews', href: '/reviews', icon: Star, section: 'reviews' },
    { name: 'Review Analytics', href: '/reviews', icon: BarChart, section: 'reviews', tab: 'analytics' },
    { name: 'Review Notifications', href: '/reviews', icon: Zap, section: 'reviews', tab: 'notifications' },
    
    // Gamification Section
    { name: 'Rewards', href: '/rewards', icon: Gift, section: 'gamification' },
    { name: 'Career Progress', href: '/career-progress', icon: Rocket, section: 'gamification' },
    { name: 'Settings', href: '/review-settings', icon: Settings, section: 'gamification' },
  ];


  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-primary-600">VibeCheckr</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-6 px-2 py-4">
              {/* Top Level */}
              <div className="space-y-1">
                {navigation.filter(item => item.section === 'top').map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Surveys Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Surveys
                </h3>
                {navigation.filter(item => item.section === 'surveys').map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Reviews Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Reviews
                </h3>
                {navigation.filter(item => item.section === 'reviews').map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Gamification Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Gamification
                </h3>
                {navigation.filter(item => item.section === 'gamification').map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>
            <div className="border-t border-secondary-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-secondary-500">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 text-secondary-400 hover:text-secondary-600"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto bg-white shadow-lg">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-primary-600">VibeCheckr</h1>
          </div>
          <nav className="flex-1 space-y-6 px-2 py-4">
            {/* Top Level */}
            <div className="space-y-1">
              {navigation.filter(item => item.section === 'top').map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Surveys Section */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                Surveys
              </h3>
              {navigation.filter(item => item.section === 'surveys').map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Reviews Section */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                Reviews
              </h3>
              {navigation.filter(item => item.section === 'reviews').map((item) => {
                const Icon = item.icon;
                const href = item.tab ? `${item.href}?tab=${item.tab}` : item.href;
                return (
                  <Link
                    key={item.name}
                    to={href}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Gamification Section */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                Gamification
              </h3>
              {navigation.filter(item => item.section === 'gamification').map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="border-t border-secondary-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-secondary-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 text-secondary-400 hover:text-secondary-600"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-secondary-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-secondary-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-secondary-400 hover:text-secondary-500"
              >
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
