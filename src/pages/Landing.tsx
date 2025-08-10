import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Star, ArrowLeft, ArrowRight, Sparkles, Target, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { PatternDivider } from '../components/ui/PatternDivider';
import { Footer } from '../components/layout/Footer';

export const Landing: React.FC = () => {
  const { language } = useAuth();
  const isRtl = language === 'ar';

  const features = [
    {
      icon: BookOpen,
      title: language === 'ar' ? 'دورات تعليمية متميزة' : 'Quality Educational Courses',
      description: language === 'ar' 
        ? 'محتوى تعليمي عالي الجودة مصمم خصيصاً للمنهج السوداني'
        : 'High-quality educational content designed for Sudanese curriculum'
    },
    {
      icon: Users,
      title: language === 'ar' ? 'مجتمع تعليمي تفاعلي' : 'Interactive Learning Community',
      description: language === 'ar'
        ? 'تواصل مع زملائك ومعلميك في بيئة تعليمية محفزة'
        : 'Connect with peers and teachers in a motivating learning environment'
    },
    {
      icon: Award,
      title: language === 'ar' ? 'شهادات معتمدة' : 'Certified Achievements',
      description: language === 'ar'
        ? 'احصل على شهادات معتمدة تعزز مسيرتك التعليمية والمهنية'
        : 'Earn certified achievements that enhance your educational and professional journey'
    }
  ];

  const stats = [
    { number: '10,000+', label: language === 'ar' ? 'طالب مسجل' : 'Registered Students' },
    { number: '500+', label: language === 'ar' ? 'معلم محترف' : 'Professional Teachers' },
    { number: '200+', label: language === 'ar' ? 'دورة تعليمية' : 'Educational Courses' },
    { number: '95%', label: language === 'ar' ? 'معدل النجاح' : 'Success Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-islamic opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 via-info/10 to-accent/5" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-6">
                <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                <h1 className="font-amiri text-6xl md:text-8xl font-bold bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                  {language === 'ar' ? 'الأوائل' : 'Al-Awael'}
                </h1>
                <Sparkles className="w-8 h-8 text-accent animate-pulse" />
              </div>
              
              <h2 className="font-tajawal text-2xl md:text-4xl font-bold text-secondary max-w-4xl mx-auto leading-relaxed">
                {language === 'ar' 
                  ? 'المنصة التعليمية الرائدة للطلاب والمعلمين في السودان'
                  : 'The Leading Educational Platform for Students and Teachers in Sudan'
                }
              </h2>
              
              <p className="font-cairo text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'انضم إلى آلاف الطلاب والمعلمين في رحلة تعليمية مميزة تجمع بين التراث الثقافي السوداني والتكنولوجيا الحديثة'
                  : 'Join thousands of students and teachers in an exceptional educational journey that combines Sudanese cultural heritage with modern technology'
                }
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link to="/auth/register">
                <Button className="btn-islamic text-lg px-8 py-4 min-w-[200px] group">
                  <span className="me-2">
                    {language === 'ar' ? 'ابدأ رحلتك التعليمية' : 'Start Your Journey'}
                  </span>
                  {isRtl ? 
                    <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> :
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  }
                </Button>
              </Link>
              
              <Link to="/courses">
                <Button variant="outline" className="text-lg px-8 py-4 min-w-[200px] border-2 border-primary hover:bg-primary hover:text-primary-foreground">
                  {language === 'ar' ? 'تصفح الدورات' : 'Explore Courses'}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-12">
              <p className="text-sm text-muted-foreground mb-6">
                {language === 'ar' ? 'يثق بنا:' : 'Trusted by:'}
              </p>
              <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse opacity-60">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Star className="w-5 h-5 text-accent fill-current" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </section>

      <PatternDivider variant="islamic" />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="font-tajawal text-3xl md:text-4xl font-bold text-secondary mb-4">
              {language === 'ar' ? 'لماذا تختار الأوائل؟' : 'Why Choose Al-Awael?'}
            </h3>
            <p className="font-cairo text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar'
                ? 'نقدم تجربة تعليمية شاملة تجمع بين الأصالة والحداثة لتحقيق أفضل النتائج'
                : 'We provide a comprehensive educational experience that combines authenticity and modernity for the best results'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-cultural text-center group hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-gold transition-all duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-tajawal text-xl font-bold text-secondary mb-3">
                    {feature.title}
                  </h4>
                  <p className="font-cairo text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PatternDivider variant="geometric" />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-secondary via-secondary-light to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-tajawal text-3xl md:text-4xl font-bold text-white mb-4">
              {language === 'ar' ? 'إنجازاتنا بالأرقام' : 'Our Achievements in Numbers'}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-tajawal text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="font-cairo text-white/90 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PatternDivider variant="simple" />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-card-elevated to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-accent me-3" />
              <h3 className="font-amiri text-3xl md:text-4xl font-bold text-secondary">
                {language === 'ar' ? 'انضم إلى عائلة الأوائل' : 'Join the Al-Awael Family'}
              </h3>
              <Heart className="w-8 h-8 text-accent ms-3" />
            </div>
            
            <p className="font-cairo text-lg text-muted-foreground">
              {language === 'ar'
                ? 'ابدأ رحلتك التعليمية اليوم وكن من الأوائل في مجالك'
                : 'Start your educational journey today and be among the first in your field'
              }
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register">
                <Button className="btn-gold text-lg px-12 py-4 group">
                  <Target className="w-5 h-5 me-2 group-hover:rotate-12 transition-transform" />
                  {language === 'ar' ? 'ابدأ الآن مجاناً' : 'Start Free Now'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};