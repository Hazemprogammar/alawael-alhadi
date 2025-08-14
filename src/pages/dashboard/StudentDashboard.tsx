import React from 'react';
import { BookOpen, Award, Calendar, Coins, TrendingUp, Clock, Star, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

import { useNavigate } from 'react-router-dom';
import { toast } from '../../hooks/use-toast';

export const StudentDashboard: React.FC = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();
  // Student-specific types and data (independent from teachers)
  type StudentCourse = { id: string; title: string; instructor: string; progress: number };
  type StudentAssignment = { id: string; title: string; subject: string; dueDate: string; status: 'pending' | 'submitted' | 'graded' };
  
  const [studentCourses] = React.useState<StudentCourse[]>([
    { id: '1', title: language === 'ar' ? 'حساب التفاضل والتكامل' : 'Calculus', instructor: language === 'ar' ? 'د. أحمد محمد' : 'Dr. Ahmed Mohamed', progress: 75 },
    { id: '2', title: language === 'ar' ? 'الفيزياء الحديثة' : 'Modern Physics', instructor: language === 'ar' ? 'د. فاطمة علي' : 'Dr. Fatima Ali', progress: 60 },
    { id: '3', title: language === 'ar' ? 'الكيمياء العضوية' : 'Organic Chemistry', instructor: language === 'ar' ? 'د. محمد أحمد' : 'Dr. Mohamed Ahmed', progress: 40 }
  ]);

  const [assignments] = React.useState<StudentAssignment[]>([
    { id: '1', title: language === 'ar' ? 'واجب التفاضل' : 'Calculus Assignment', subject: language === 'ar' ? 'الرياضيات' : 'Mathematics', dueDate: '2024-01-20', status: 'pending' },
    { id: '2', title: language === 'ar' ? 'تقرير الفيزياء' : 'Physics Report', subject: language === 'ar' ? 'الفيزياء' : 'Physics', dueDate: '2024-01-25', status: 'submitted' }
  ]);

  const stats = [
    {
      title: language === 'ar' ? 'النقاط الحالية' : 'Current Points',
      value: user?.points?.toLocaleString() || '1,250',
      icon: Coins,
      color: 'accent',
      trend: '+150'
    },
    {
      title: language === 'ar' ? 'الدورات المسجلة' : 'Enrolled Courses',
      value: String(studentCourses.length),
      icon: BookOpen,
      color: 'primary',
      trend: '+2'
    },
    {
      title: language === 'ar' ? 'الشهادات' : 'Certificates',
      value: '3',
      icon: Award,
      color: 'secondary',
      trend: '+1'
    },
    {
      title: language === 'ar' ? 'ساعات الدراسة' : 'Study Hours',
      value: '142',
      icon: Clock,
      color: 'info',
      trend: '+24'
    }
  ];

  const upcomingExams = [
    {
      subject: language === 'ar' ? 'الرياضيات المتقدمة' : 'Advanced Mathematics',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '2 ساعة'
    },
    {
      subject: language === 'ar' ? 'الفيزياء' : 'Physics',
      date: '2024-01-18',
      time: '2:00 PM',
      duration: '1.5 ساعة'
    },
    {
      subject: language === 'ar' ? 'الكيمياء' : 'Chemistry',
      date: '2024-01-22',
      time: '9:00 AM',
      duration: '2 ساعة'
    }
  ];

  const recentCourses = [
    {
      title: language === 'ar' ? 'حساب التفاضل والتكامل' : 'Calculus',
      progress: 75,
      instructor: language === 'ar' ? 'د. أحمد محمد' : 'Dr. Ahmed Mohamed',
      nextLesson: language === 'ar' ? 'الدرس 12: التكامل بالتعويض' : 'Lesson 12: Integration by Substitution'
    },
    {
      title: language === 'ar' ? 'الفيزياء الحديثة' : 'Modern Physics',
      progress: 60,
      instructor: language === 'ar' ? 'د. فاطمة علي' : 'Dr. Fatima Ali',
      nextLesson: language === 'ar' ? 'الدرس 8: النظرية النسبية' : 'Lesson 8: Theory of Relativity'
    },
    {
      title: language === 'ar' ? 'الكيمياء العضوية' : 'Organic Chemistry',
      progress: 40,
      instructor: language === 'ar' ? 'د. محمد أحمد' : 'Dr. Mohamed Ahmed',
      nextLesson: language === 'ar' ? 'الدرس 5: التفاعلات العضوية' : 'Lesson 5: Organic Reactions'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 rounded-2xl p-6 pattern-islamic">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-tajawal text-2xl md:text-3xl font-bold text-secondary mb-2">
              {language === 'ar' ? `مرحباً، ${user?.name}` : `Welcome, ${user?.name}`}
            </h1>
            <p className="font-cairo text-muted-foreground">
              {language === 'ar' 
                ? 'استمر في رحلتك التعليمية وحقق أهدافك الأكاديمية'
                : 'Continue your educational journey and achieve your academic goals'
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
              <Star className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-cultural hover:scale-105 transition-transform">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br from-${stat.color} to-${stat.color}-light rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-success font-medium">
                    {stat.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.title}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Current Courses */}
        <div className="lg:col-span-2">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-tajawal text-xl text-secondary flex items-center">
                <BookOpen className="w-5 h-5 me-2" />
                {language === 'ar' ? 'الدورات الحالية' : 'Current Courses'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentCourses.map((course) => (
                <div key={course.id} className="border border-border rounded-xl p-4 hover:shadow-soft transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-tajawal font-semibold text-foreground mb-1">
                        {course.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {course.instructor} • {language === 'ar' ? 'التقدم' : 'Progress'}: {course.progress}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'دورة نشطة' : 'Active course'}
                    </span>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate('/courses')}>
                      {language === 'ar' ? 'متابعة' : 'Continue'}
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="btn-cultural w-full mt-4" onClick={() => navigate('/courses')}>
                <BookOpen className="w-4 h-4 me-2" />
                {language === 'ar' ? 'عرض جميع الدورات' : 'View All Courses'}
              </Button>
            </CardContent>
          </Card>

          <Card className="card-elevated mt-6">
            <CardHeader>
              <CardTitle className="font-tajawal text-xl text-secondary flex items-center">
                <Award className="w-5 h-5 me-2" />
                {language === 'ar' ? 'الواجبات والمهام' : 'Assignments & Tasks'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-border rounded-xl p-4 hover:shadow-soft transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-tajawal font-semibold text-foreground mb-1">
                        {assignment.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {assignment.subject} • {language === 'ar' ? 'موعد التسليم:' : 'Due:'} {assignment.dueDate}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'submitted' ? 'bg-success/10 text-success' :
                      assignment.status === 'graded' ? 'bg-info/10 text-info' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {assignment.status === 'submitted' ? (language === 'ar' ? 'مُسلّم' : 'Submitted') :
                       assignment.status === 'graded' ? (language === 'ar' ? 'مُقيّم' : 'Graded') :
                       (language === 'ar' ? 'معلق' : 'Pending')}
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button size="sm" variant="outline" className="text-xs">
                      {assignment.status === 'submitted' ? (language === 'ar' ? 'عرض التسليم' : 'View Submission') : (language === 'ar' ? 'تسليم' : 'Submit')}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Exams */}
        <div>
          <Card className="card-cultural">
            <CardHeader>
              <CardTitle className="font-tajawal text-xl text-secondary flex items-center">
                <Calendar className="w-5 h-5 me-2" />
                {language === 'ar' ? 'الامتحانات القادمة' : 'Upcoming Exams'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingExams.map((exam, index) => (
                <div key={index} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <h4 className="font-tajawal font-medium text-foreground mb-2">
                    {exam.subject}
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 me-2" />
                      {exam.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 me-2" />
                      {exam.time} ({exam.duration})
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/exams')}>
                <Target className="w-4 h-4 me-2" />
                {language === 'ar' ? 'جدول الامتحانات' : 'Exam Schedule'}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-cultural mt-6">
            <CardHeader>
              <CardTitle className="font-tajawal text-lg text-secondary">
                {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/buy-points')}>
                <Coins className="w-4 h-4 me-2" />
                {language === 'ar' ? 'شراء النقاط' : 'Buy Points'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};