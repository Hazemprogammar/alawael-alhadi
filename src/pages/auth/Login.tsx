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
  const [stage, setStage] = useState<'primary' | 'intermediate' | 'secondary' | ''>('');
  const [classLevel, setClassLevel] = useState('');
  const [track, setTrack] = useState<'scientific' | 'literary' | ''>('');
  
  const { login, language } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'student', label: language === 'ar' ? 'طالب' : 'Student', icon: BookOpen },
    { value: 'teacher', label: language === 'ar' ? 'معلم' : 'Teacher', icon: User },
    { value: 'institution', label: language === 'ar' ? 'مؤسسة تعليمية' : 'Institution', icon: BookOpen },
    { value: 'parent', label: language === 'ar' ? 'ولي أمر' : 'Parent', icon: User }
  ];

  const stageOptions = [
    { value: 'primary', label: language === 'ar' ? 'ابتدائي' : 'Primary' },
    { value: 'intermediate', label: language === 'ar' ? 'متوسط' : 'Intermediate' },
    { value: 'secondary', label: language === 'ar' ? 'ثانوي' : 'Secondary' },
  ] as const;

  const classesByStage: Record<'primary' | 'intermediate' | 'secondary', { value: string; label: string }[]> = {
    primary: [
      { value: '1', label: language === 'ar' ? 'الأول ابتدائي' : '1st Primary' },
      { value: '2', label: language === 'ar' ? 'الثاني ابتدائي' : '2nd Primary' },
      { value: '3', label: language === 'ar' ? 'الثالث ابتدائي' : '3rd Primary' },
      { value: '4', label: language === 'ar' ? 'الرابع ابتدائي' : '4th Primary' },
      { value: '5', label: language === 'ar' ? 'الخامس ابتدائي' : '5th Primary' },
      { value: '6', label: language === 'ar' ? 'السادس ابتدائي' : '6th Primary' },
    ],
    intermediate: [
      { value: '1', label: language === 'ar' ? 'الأول متوسط' : '1st Intermediate' },
      { value: '2', label: language === 'ar' ? 'الثاني متوسط' : '2nd Intermediate' },
      { value: '3', label: language === 'ar' ? 'الثالث متوسط' : '3rd Intermediate' },
    ],
    secondary: [
      { value: '1', label: language === 'ar' ? 'الأول ثانوي' : '1st Secondary' },
      { value: '2', label: language === 'ar' ? 'الثاني ثانوي' : '2nd Secondary' },
      { value: '3', label: language === 'ar' ? 'الثالث ثانوي' : '3rd Secondary' },
    ],
  };

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

    if (role === 'student') {
      if (!stage || !classLevel || (stage === 'secondary' && classLevel === '3' && !track)) {
        toast({
          title: language === 'ar' ? 'مطلوب' : 'Required',
          description:
            language === 'ar'
              ? 'يرجى تحديد المرحلة والصف' + (stage === 'secondary' && classLevel === '3' ? ' والمسار' : '')
              : 'Please select stage and class' + (stage === 'secondary' && classLevel === '3' ? ' and track' : ''),
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      await login(
        email,
        password,
        role,
        role === 'student'
          ? { stage: stage as 'primary' | 'intermediate' | 'secondary', classLevel, track: track || undefined }
          : undefined
      );
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

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setRole('student');
    setStage('');
    setClassLevel('');
    setTrack('');
    setShowPassword(false);
    toast({
      title: language === 'ar' ? 'تم الإلغاء' : 'Cancelled',
      description: language === 'ar' ? 'تم مسح البيانات المدخلة' : 'Cleared entered data'
    });
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

              {role === 'student' && (
                <div className="space-y-4">
                  {/* Stage Selection */}
                  <div className="space-y-3">
                    <Label className="font-cairo font-medium text-foreground">
                      {language === 'ar' ? 'المرحلة الدراسية' : 'Education Stage'}
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {stageOptions.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => {
                            setStage(s.value);
                            setClassLevel('');
                            setTrack('');
                          }}
                          className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                            stage === s.value
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border hover:border-primary text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <div className="text-sm font-medium">{s.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Class Selection */}
                  {stage && (
                    <div className="space-y-3">
                      <Label className="font-cairo font-medium text-foreground">
                        {language === 'ar' ? 'الصف' : 'Class'}
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {classesByStage[stage as 'primary' | 'intermediate' | 'secondary'].map((cls) => (
                          <button
                            key={cls.value}
                            type="button"
                            onClick={() => {
                              setClassLevel(cls.value);
                              if (cls.value !== '3') setTrack('');
                            }}
                            className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                              classLevel === cls.value
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border hover:border-primary text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <div className="text-sm font-medium">{cls.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Track Selection for 3rd Secondary */}
                  {stage === 'secondary' && classLevel === '3' && (
                    <div className="space-y-3">
                      <Label className="font-cairo font-medium text-foreground">
                        {language === 'ar' ? 'المسار' : 'Track'}
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ value: 'scientific', label: language === 'ar' ? 'علمي' : 'Scientific' }, { value: 'literary', label: language === 'ar' ? 'أدبي' : 'Literary' }].map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setTrack(t.value as 'scientific' | 'literary')}
                            className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                              track === t.value
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border hover:border-primary text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <div className="text-sm font-medium">{t.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

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

              {/* Cancel / Reset Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={handleReset}
              >
                {language === 'ar' ? 'إلغاء وإفراغ الحقول' : 'Cancel & Clear'}
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