import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';

const Profile: React.FC = () => {
  const { user, updateUser, language } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [stage, setStage] = useState(user?.educationStage || '');
  const [classLevel, setClassLevel] = useState(user?.classLevel || '');
  const [track, setTrack] = useState(user?.track || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    document.title = language === 'ar' ? 'الملف الشخصي | الأوائل' : 'Profile | Al-Awael';
    const metaDesc = document.querySelector('meta[name="description"]');
    const desc = language === 'ar' ? 'إدارة وتعديل ملفك الشخصي على منصة الأوائل' : 'Manage and edit your profile on Al-Awael';
    if (metaDesc) metaDesc.setAttribute('content', desc);
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href);
    if (!canonical.parentNode) document.head.appendChild(canonical);
  }, [language]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      updateUser({ avatar: dataUrl });
      toast({
        title: language === 'ar' ? 'تم تحديث الصورة' : 'Avatar updated',
        description: language === 'ar' ? 'تم حفظ صورتك الشخصية' : 'Your profile photo has been saved'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateUser({ name, email, institution, educationStage: stage as any, classLevel, track: (track || undefined) as any, avatar });
    toast({
      title: language === 'ar' ? 'تم الحفظ' : 'Saved',
      description: language === 'ar' ? 'تم تحديث معلومات الملف الشخصي' : 'Profile information updated'
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'ar' ? 'يتطلب تفعيل Supabase' : 'Supabase required',
      description: language === 'ar' ? 'لتغيير كلمة المرور فعّل تكامل Supabase من أعلى اليمين' : 'Connect Supabase to enable password changes'
    });
  };

  const isStudent = user?.role === 'student';

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-tajawal text-xl">{language === 'ar' ? 'الصورة الشخصية' : 'Profile Photo'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatar} alt={language === 'ar' ? 'صورة المستخدم' : 'User avatar'} />
                  <AvatarFallback>{(user?.name || '?').slice(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar" className="block mb-2">{language === 'ar' ? 'رفع صورة جديدة' : 'Upload new photo'}</Label>
                  <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-tajawal text-xl">{language === 'ar' ? 'معلومات الحساب' : 'Account Information'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">{language === 'ar' ? 'المؤسسة التعليمية' : 'Institution'}</Label>
                  <Input id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                </div>
              </div>

              {isStudent && (
                <div className="space-y-3">
                  <Label className="font-medium">{language === 'ar' ? 'المرحلة والصف' : 'Stage & Class'}</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'primary', label: language === 'ar' ? 'ابتدائي' : 'Primary' },
                      { value: 'intermediate', label: language === 'ar' ? 'متوسط' : 'Intermediate' },
                      { value: 'secondary', label: language === 'ar' ? 'ثانوي' : 'Secondary' },
                    ].map((s) => (
                      <button key={s.value} type="button" onClick={() => { setStage(s.value as any); setClassLevel(''); setTrack(''); }} className={`p-3 rounded-xl border-2 text-center transition-all ${stage === s.value ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-primary text-muted-foreground hover:text-foreground'}`}>
                        <div className="text-sm font-medium">{s.label}</div>
                      </button>
                    ))}
                  </div>

                  {stage && (
                    <div className="grid grid-cols-3 gap-3">
                      {(
                        stage === 'primary'
                          ? [1,2,3,4,5,6]
                          : stage === 'intermediate'
                            ? [1,2,3]
                            : [1,2,3]
                      ).map((n) => (
                        <button key={n} type="button" onClick={() => { setClassLevel(String(n)); if (String(n) !== '3') setTrack(''); }} className={`p-3 rounded-xl border-2 text-center transition-all ${classLevel === String(n) ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-primary text-muted-foreground hover:text-foreground'}`}>
                          <div className="text-sm font-medium">{language === 'ar' ? `${n === 1 ? 'الأول' : n === 2 ? 'الثاني' : n === 3 ? 'الثالث' : n === 4 ? 'الرابع' : n === 5 ? 'الخامس' : 'السادس'} ${stage === 'primary' ? 'ابتدائي' : stage === 'intermediate' ? 'متوسط' : 'ثانوي'}` : `${n}${n===1?'st':n===2?'nd':n===3?'rd':'th'} ${stage === 'primary' ? 'Primary' : stage === 'intermediate' ? 'Intermediate' : 'Secondary'}`}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {stage === 'secondary' && classLevel === '3' && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'scientific', label: language === 'ar' ? 'علمي' : 'Scientific' },
                        { value: 'literary', label: language === 'ar' ? 'أدبي' : 'Literary' },
                      ].map((t) => (
                        <button key={t.value} type="button" onClick={() => setTrack(t.value as any)} className={`p-3 rounded-xl border-2 text-center transition-all ${track === t.value ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-primary text-muted-foreground hover:text-foreground'}`}>
                          <div className="text-sm font-medium">{t.label}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button className="btn-cultural" onClick={handleSave}>{language === 'ar' ? 'حفظ التغييرات' : 'Save changes'}</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Section */}
        <Card className="mt-6 max-w-2xl">
          <CardHeader>
            <CardTitle className="font-tajawal text-xl">{language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="grid md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</Label>
                <Input id="currentPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</Label>
                <Input id="newPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</Label>
                <Input id="confirmPassword" type="password" required />
              </div>
              <div className="md:col-span-3">
                <Button type="submit" variant="outline" className="w-full">{language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
