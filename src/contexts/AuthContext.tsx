import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'teacher' | 'institution' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  points?: number;
  institution?: string;
  educationStage?: 'primary' | 'intermediate' | 'secondary';
  classLevel?: string;
  track?: 'scientific' | 'literary';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole, education?: EducationInfo) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  isLoading: boolean;
  language: 'ar' | 'en';
  toggleLanguage: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  institution?: string;
  phone?: string;
}

export interface EducationInfo {
  stage: 'primary' | 'intermediate' | 'secondary';
  classLevel: string;
  track?: 'scientific' | 'literary';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Check for stored authentication token
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole, education?: EducationInfo) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: role === 'admin' ? 'مدير النظام' : 'أحمد محمد علي',
        email,
        role,
        avatar: '/placeholder-avatar.jpg',
        points: role === 'student' ? 1250 : undefined,
        institution: role === 'teacher' || role === 'student' ? 'جامعة الخرطوم' : undefined,
        ...(role === 'student' && education ? {
          educationStage: education.stage,
          classLevel: education.classLevel,
          track: education.track
        } : {})
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock_token_12345');
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('فشل في تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        points: userData.role === 'student' ? 100 : undefined,
        institution: userData.institution
      };
      
      setUser(newUser);
      localStorage.setItem('auth_token', 'mock_token_12345');
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('فشل في إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'ar' ? 'en' : 'ar';
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      return newLang;
    });
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    language,
    toggleLanguage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};