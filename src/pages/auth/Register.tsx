import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, User, BookOpen, School, Users } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from '../../hooks/use-toast';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as UserRole,
    institution: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, language } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'student', label: language === 'ar' ? 'طالب' : 'Student', icon: BookOpen },
    { value: 'teacher', label: language === 'ar' ? 'معلم' : 'Teacher', icon: User },
    { value: 'institution', label: language === 'ar' ? 'مؤسسة تعليمية' : 'Institution', icon: School },
    { value: 'parent', label: language === 'ar' ? 'ولي أمر' : 'Parent', icon: Users }
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      toast({
        title: language === 'ar' ? 'مرحباً بك' : 'Welcome',
        description: language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully'
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: language === 'ar' ? 'خطأ في إنشاء الحساب' : 'Registration Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pattern-geometric bg-gradient-to-br from-card-elevated to-background p-4">
      <div className="w-full max-w-lg">
        <Card className="card-cultural shadow-cultural">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="font-tajawal text-2xl text-secondary">
              {language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
            </CardTitle>
            <CardDescription className="font-cairo text-muted-foreground">
              {language === 'ar' 
                ? 'انضم إلى منصة الأوائل التعليمية'
                : 'Join the Al-Awael educational platform'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="font-cairo font-medium text-foreground">
                  {language === 'ar' ? 'نوع الحساب *' : 'Account Type *'}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((roleOption) => {
                    const Icon = roleOption.icon;
                    return (
                      <button
                        key={roleOption.value}
                        type="button"
                        onClick={() => handleChange('role', roleOption.value)}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                          formData.role === roleOption.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-accent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-sm font-medium">{roleOption.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-cairo font-medium text-foreground">
                  {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  className="font-cairo"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-cairo font-medium text-foreground">
                  {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="font-cairo"
                  required
                />
              </div>

              {/* Institution (for students and teachers) */}
              {(formData.role === 'student' || formData.role === 'teacher') && (
                <div className="space-y-2">
                  <Label htmlFor="institution" className="font-cairo font-medium text-foreground">
                    {language === 'ar' ? 'المؤسسة التعليمية' : 'Educational Institution'}
                  </Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    placeholder={language === 'ar' ? 'اسم الجامعة أو المدرسة' : 'University or school name'}
                    className="font-cairo"
                  />
                </div>
              )}

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-cairo font-medium text-foreground">
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                  className="font-cairo"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="font-cairo font-medium text-foreground">
                  {language === 'ar' ? 'كلمة المرور *' : 'Password *'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-cairo font-medium text-foreground">
                  {language === 'ar' ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                    className="font-cairo pe-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="btn-cultural w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin me-2" />
                    {language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...'}
                  </div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 me-2" />
                    {language === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground font-cairo">
                {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                {' '}
                <Link
                  to="/auth/login"
                  className="text-accent hover:text-accent-light font-medium underline"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};