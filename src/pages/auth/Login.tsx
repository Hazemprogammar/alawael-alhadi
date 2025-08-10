import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, User, Lock, BookOpen } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from '../../hooks/use-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, language } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'student', label: language === 'ar' ? 'طالب' : 'Student', icon: BookOpen },
    { value: 'teacher', label: language === 'ar' ? 'معلم' : 'Teacher', icon: User },
    { value: 'institution', label: language === 'ar' ? 'مؤسسة تعليمية' : 'Institution', icon: BookOpen },
    { value: 'parent', label: language === 'ar' ? 'ولي أمر' : 'Parent', icon: User }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, role);
      toast({
        title: language === 'ar' ? 'مرحباً بك' : 'Welcome',
        description: language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful'
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pattern-islamic bg-gradient-to-br from-card-elevated to-background p-4">
      <div className="w-full max-w-md">
        <Card className="card-cultural shadow-cultural">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center">
                <LogIn className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="font-tajawal text-2xl text-secondary">
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </CardTitle>
            <CardDescription className="font-cairo text-muted-foreground">
              {language === 'ar' 
                ? 'ادخل إلى حسابك للوصول إلى المنصة'
                : 'Enter your account to access the platform'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="font-cairo font-medium text-foreground">
                  {language === 'ar' ? 'نوع الحساب' : 'Account Type'}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((roleOption) => {
                    const Icon = roleOption.icon;
                    return (
                      <button
                        key={roleOption.value}
                        type="button"
                        onClick={() => setRole(roleOption.value as UserRole)}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                          role === roleOption.value
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border hover:border-primary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-sm font-medium">{roleOption.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-cairo font-medium text-foreground">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="font-cairo"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="font-cairo font-medium text-foreground">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                    className="font-cairo pe-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-accent hover:text-accent-light font-cairo underline"
                >
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="btn-islamic w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin me-2" />
                    {language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...'}
                  </div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 me-2" />
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </>
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground font-cairo">
                {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}
                {' '}
                <Link
                  to="/auth/register"
                  className="text-accent hover:text-accent-light font-medium underline"
                >
                  {language === 'ar' ? 'إنشاء حساب جديد' : 'Create new account'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};