import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PatternDivider } from '../ui/PatternDivider';

export const Footer: React.FC = () => {
  const { language } = useAuth();

  const footerLinks = {
    platform: {
      title: language === 'ar' ? 'المنصة' : 'Platform',
      links: [
        { label: language === 'ar' ? 'الدورات' : 'Courses', href: '/courses' },
        { label: language === 'ar' ? 'الامتحانات' : 'Exams', href: '/exams' },
        { label: language === 'ar' ? 'المجتمع' : 'Community', href: '/community' },
        { label: language === 'ar' ? 'الشهادات' : 'Certificates', href: '/certificates' }
      ]
    },
    support: {
      title: language === 'ar' ? 'الدعم' : 'Support',
      links: [
        { label: language === 'ar' ? 'مركز المساعدة' : 'Help Center', href: '/help' },
        { label: language === 'ar' ? 'اتصل بنا' : 'Contact Us', href: '/contact' },
        { label: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', href: '/faq' },
        { label: language === 'ar' ? 'الشكاوى' : 'Complaints', href: '/complaints' }
      ]
    },
    legal: {
      title: language === 'ar' ? 'القانونية' : 'Legal',
      links: [
        { label: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', href: '/privacy' },
        { label: language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service', href: '/terms' },
        { label: language === 'ar' ? 'سياسة الكوكيز' : 'Cookie Policy', href: '/cookies' }
      ]
    }
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <PatternDivider variant="islamic" className="bg-background" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-light rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="font-amiri text-2xl font-bold text-accent">
                {language === 'ar' ? 'الأوائل' : 'Al-Awael'}
              </span>
            </Link>
            
            <p className="font-cairo text-secondary-foreground/80 mb-6 leading-relaxed">
              {language === 'ar'
                ? 'منصة تعليمية رائدة تجمع بين التراث الثقافي السوداني والتكنولوجيا الحديثة لتقديم أفضل تجربة تعليمية.'
                : 'A leading educational platform that combines Sudanese cultural heritage with modern technology to provide the best learning experience.'
              }
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="w-4 h-4 text-accent" />
                <span>info@al-awael.edu.sd</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="w-4 h-4 text-accent" />
                <span>+249 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{language === 'ar' ? 'الخرطوم، السودان' : 'Khartoum, Sudan'}</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-tajawal text-lg font-semibold text-accent mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="font-cairo text-secondary-foreground/80 hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <PatternDivider variant="simple" className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-secondary-foreground/60 mb-4 md:mb-0">
            © 2024 {language === 'ar' ? 'الأوائل' : 'Al-Awael'}. 
            {language === 'ar' ? ' جميع الحقوق محفوظة.' : ' All rights reserved.'}
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary-light rounded-lg flex items-center justify-center text-secondary-foreground/60 hover:text-accent hover:bg-accent/10 transition-all duration-200"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};