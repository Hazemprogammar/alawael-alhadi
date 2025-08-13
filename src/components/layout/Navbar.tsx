import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Globe, BookOpen, Users, Award, LayoutDashboard, Coins } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { toast } from '../../hooks/use-toast';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, language, toggleLanguage } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: language === 'ar' ? 'تم تسجيل الخروج' : 'Logged out',
      description: language === 'ar' ? 'تم إنهاء الجلسة بنجاح' : 'You have been signed out'
    });
    navigate('/auth/login');
  };
  const navItems = [
    { 
      href: '/dashboard', 
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard',
      icon: LayoutDashboard 
    },
    { 
      href: '/courses', 
      label: language === 'ar' ? 'الدورات' : 'Courses',
      icon: BookOpen 
    },
    { 
      href: '/exams', 
      label: language === 'ar' ? 'الامتحانات' : 'Exams',
      icon: Award 
    },
    { 
      href: '/community', 
      label: language === 'ar' ? 'المجتمع' : 'Community',
      icon: Users 
    },
    { 
      href: '/buy-points', 
      label: language === 'ar' ? 'شراء النقاط' : 'Buy Points',
      icon: Coins 
    }
  ];

  return (
    <nav className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="font-amiri text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                {language === 'ar' ? 'الأوائل' : 'Al-Awael'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-accent transition-colors font-medium"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex md:items-center md:space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-foreground"
            >
              <Globe className="w-4 h-4 me-2" />
              {language === 'ar' ? 'EN' : 'العربية'}
            </Button>

            {user ? (
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-card-elevated hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm" className="font-medium">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="btn-cultural">
                    {language === 'ar' ? 'إنشاء حساب' : 'Register'}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border mt-2 pt-4 pb-4">
            <div className="space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-3 rtl:space-x-reverse text-foreground hover:text-accent px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-border pt-3 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="w-full justify-start text-muted-foreground hover:text-foreground mb-2"
                >
                  <Globe className="w-4 h-4 me-2" />
                  {language === 'ar' ? 'English' : 'العربية'}
                </Button>
                
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 rtl:space-x-reverse bg-card-elevated px-3 py-2 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start text-destructive hover:text-destructive"
                    >
                      <LogOut className="w-4 h-4 me-2" />
                      {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/auth/login" className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                      </Button>
                    </Link>
                    <Link to="/auth/register" className="block">
                      <Button className="btn-cultural w-full">
                        {language === 'ar' ? 'إنشاء حساب' : 'Register'}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};