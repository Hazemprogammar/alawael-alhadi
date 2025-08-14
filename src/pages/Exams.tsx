import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  Clock, 
  FileText, 
  Award, 
  Calendar,
  Timer,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Star,
  BarChart3
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number; // minutes
  questionsCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  passingScore: number;
  maxScore: number;
  attempts: number;
  maxAttempts: number;
  status: 'available' | 'in-progress' | 'completed' | 'locked';
  startDate?: string;
  endDate?: string;
  description: string;
  topics: string[];
}

interface ExamResult {
  examId: string;
  score: number;
  maxScore: number;
  completedAt: string;
  timeSpent: number; // minutes
  passed: boolean;
}

export const Exams: React.FC = () => {
  const { user, language } = useAuth();
  const [activeTab, setActiveTab] = useState<'available' | 'completed' | 'results'>('available');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  useEffect(() => {
    document.title = language === 'ar' ? 'الامتحانات | الأوائل' : 'Exams | Al-Awael';
    const metaDesc = document.querySelector('meta[name="description"]');
    const desc = language === 'ar' 
      ? 'اختبر معرفتك وقيس تقدمك من خلال امتحانات شاملة في مختلف المواد الدراسية'
      : 'Test your knowledge and measure your progress through comprehensive exams in various subjects';
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [language]);

  const [availableExams] = useState<Exam[]>([
    {
      id: '1',
      title: language === 'ar' ? 'امتحان الجبر المتقدم' : 'Advanced Algebra Exam',
      subject: language === 'ar' ? 'الرياضيات' : 'Mathematics',
      duration: 90,
      questionsCount: 30,
      difficulty: 'hard',
      passingScore: 70,
      maxScore: 100,
      attempts: 0,
      maxAttempts: 3,
      status: 'available',
      startDate: '2024-01-15T09:00:00Z',
      endDate: '2024-01-20T23:59:59Z',
      description: language === 'ar' 
        ? 'امتحان شامل يغطي جميع مواضيع الجبر المتقدم والمعادلات التفاضلية'
        : 'Comprehensive exam covering all advanced algebra topics and differential equations',
      topics: language === 'ar' 
        ? ['المعادلات التفاضلية', 'الجبر الخطي', 'الأعداد المركبة', 'المصفوفات']
        : ['Differential Equations', 'Linear Algebra', 'Complex Numbers', 'Matrices']
    },
    {
      id: '2',
      title: language === 'ar' ? 'اختبار الفيزياء الحديثة' : 'Modern Physics Quiz',
      subject: language === 'ar' ? 'الفيزياء' : 'Physics',
      duration: 60,
      questionsCount: 25,
      difficulty: 'medium',
      passingScore: 65,
      maxScore: 100,
      attempts: 1,
      maxAttempts: 2,
      status: 'available',
      startDate: '2024-01-12T10:00:00Z',
      endDate: '2024-01-25T22:00:00Z',
      description: language === 'ar'
        ? 'اختبار يركز على مبادئ الفيزياء الحديثة والنظرية النسبية'
        : 'Quiz focusing on modern physics principles and relativity theory',
      topics: language === 'ar'
        ? ['النظرية النسبية', 'فيزياء الكم', 'الذرة والنواة', 'الإشعاع']
        : ['Relativity Theory', 'Quantum Physics', 'Atomic and Nuclear', 'Radiation']
    },
    {
      id: '3',
      title: language === 'ar' ? 'امتحان الكيمياء العضوية' : 'Organic Chemistry Exam',
      subject: language === 'ar' ? 'الكيمياء' : 'Chemistry',
      duration: 120,
      questionsCount: 40,
      difficulty: 'hard',
      passingScore: 75,
      maxScore: 100,
      attempts: 0,
      maxAttempts: 2,
      status: 'available',
      startDate: '2024-01-18T08:00:00Z',
      endDate: '2024-01-30T20:00:00Z',
      description: language === 'ar'
        ? 'امتحان متقدم في الكيمياء العضوية يشمل التفاعلات والمركبات'
        : 'Advanced organic chemistry exam covering reactions and compounds',
      topics: language === 'ar'
        ? ['المركبات العضوية', 'التفاعلات الكيميائية', 'الآليات', 'التخليق']
        : ['Organic Compounds', 'Chemical Reactions', 'Mechanisms', 'Synthesis']
    }
  ]);

  const [completedExams] = useState<Exam[]>([
    {
      id: '4',
      title: language === 'ar' ? 'اختبار أساسيات الجبر' : 'Basic Algebra Test',
      subject: language === 'ar' ? 'الرياضيات' : 'Mathematics',
      duration: 45,
      questionsCount: 20,
      difficulty: 'easy',
      passingScore: 60,
      maxScore: 100,
      attempts: 1,
      maxAttempts: 3,
      status: 'completed',
      description: language === 'ar'
        ? 'اختبار في أساسيات الجبر والمعادلات البسيطة'
        : 'Test on algebra fundamentals and simple equations',
      topics: language === 'ar'
        ? ['المعادلات الخطية', 'الحل الجذري', 'الرسم البياني']
        : ['Linear Equations', 'Radical Solutions', 'Graphing']
    }
  ]);

  const [examResults] = useState<ExamResult[]>([
    {
      examId: '4',
      score: 85,
      maxScore: 100,
      completedAt: '2024-01-10T14:30:00Z',
      timeSpent: 35,
      passed: true
    }
  ]);

  const getDifficultyColor = (difficulty: Exam['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: Exam['difficulty']) => {
    switch (difficulty) {
      case 'easy': return language === 'ar' ? 'سهل' : 'Easy';
      case 'medium': return language === 'ar' ? 'متوسط' : 'Medium';
      case 'hard': return language === 'ar' ? 'صعب' : 'Hard';
      default: return '';
    }
  };

  const getStatusColor = (status: Exam['status']) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'completed': return 'text-gray-600';
      case 'locked': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: Exam['status']) => {
    switch (status) {
      case 'available': return PlayCircle;
      case 'in-progress': return Timer;
      case 'completed': return CheckCircle;
      case 'locked': return AlertCircle;
      default: return FileText;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return language === 'ar' ? `${hours} ساعة ${mins} دقيقة` : `${hours}h ${mins}m`;
    }
    return language === 'ar' ? `${mins} دقيقة` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStartExam = (exam: Exam) => {
    if (exam.attempts >= exam.maxAttempts) {
      toast({
        title: language === 'ar' ? 'تم استنفاد المحاولات' : 'Attempts exhausted',
        description: language === 'ar' 
          ? 'لقد استنفدت جميع المحاولات المتاحة لهذا الامتحان'
          : 'You have used all available attempts for this exam',
        variant: 'destructive'
      });
      return;
    }

    setSelectedExam(exam);
    toast({
      title: language === 'ar' ? 'بدء الامتحان' : 'Starting Exam',
      description: language === 'ar' 
        ? 'سيتم توجيهك إلى صفحة الامتحان...'
        : 'Redirecting to exam page...'
    });
  };

  const getOverallProgress = () => {
    const totalExams = availableExams.length + completedExams.length;
    const completedCount = completedExams.length;
    return totalExams > 0 ? (completedCount / totalExams) * 100 : 0;
  };

  const getAverageScore = () => {
    if (examResults.length === 0) return 0;
    const totalScore = examResults.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / examResults.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-amiri text-4xl md:text-5xl font-bold text-secondary mb-4">
            {language === 'ar' ? 'الامتحانات' : 'Exams'}
          </h1>
          <p className="font-cairo text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اختبر معرفتك وقيس تقدمك من خلال امتحانات شاملة في مختلف المواد'
              : 'Test your knowledge and measure your progress through comprehensive exams'
            }
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="card-cultural">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-secondary mb-1">
                {availableExams.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'امتحانات متاحة' : 'Available Exams'}
              </div>
            </CardContent>
          </Card>

          <Card className="card-cultural">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-secondary mb-1">
                {completedExams.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'امتحانات مكتملة' : 'Completed Exams'}
              </div>
            </CardContent>
          </Card>

          <Card className="card-cultural">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-secondary mb-1">
                {getAverageScore()}%
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'متوسط الدرجات' : 'Average Score'}
              </div>
            </CardContent>
          </Card>

          <Card className="card-cultural">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-info" />
              </div>
              <div className="text-2xl font-bold text-secondary mb-1">
                {Math.round(getOverallProgress())}%
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'التقدم العام' : 'Overall Progress'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'available' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('available')}
              className="me-1"
            >
              <PlayCircle className="w-4 h-4 me-2" />
              {language === 'ar' ? 'متاحة' : 'Available'}
            </Button>
            <Button
              variant={activeTab === 'completed' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('completed')}
              className="me-1"
            >
              <CheckCircle className="w-4 h-4 me-2" />
              {language === 'ar' ? 'مكتملة' : 'Completed'}
            </Button>
            <Button
              variant={activeTab === 'results' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('results')}
            >
              <Award className="w-4 h-4 me-2" />
              {language === 'ar' ? 'النتائج' : 'Results'}
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'available' && (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {availableExams.map((exam) => {
              const StatusIcon = getStatusIcon(exam.status);
              return (
                <Card key={exam.id} className="card-elevated hover:shadow-soft transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="font-tajawal text-lg text-secondary mb-2">
                          {exam.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                          <Badge variant="outline">{exam.subject}</Badge>
                          <Badge className={getDifficultyColor(exam.difficulty)}>
                            {getDifficultyLabel(exam.difficulty)}
                          </Badge>
                        </div>
                      </div>
                      <StatusIcon className={`w-5 h-5 ${getStatusColor(exam.status)}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground font-cairo">
                      {exam.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Timer className="w-4 h-4 me-2 text-muted-foreground" />
                        {formatDuration(exam.duration)}
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 me-2 text-muted-foreground" />
                        {exam.questionsCount} {language === 'ar' ? 'سؤال' : 'questions'}
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 me-2 text-muted-foreground" />
                        {exam.passingScore}% {language === 'ar' ? 'للنجاح' : 'to pass'}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 me-2 text-muted-foreground" />
                        {exam.attempts}/{exam.maxAttempts} {language === 'ar' ? 'محاولات' : 'attempts'}
                      </div>
                    </div>

                    {exam.topics && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">
                          {language === 'ar' ? 'المواضيع:' : 'Topics:'}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {exam.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {exam.startDate && exam.endDate && (
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 me-1" />
                          {language === 'ar' ? 'متاح من' : 'Available from'}: {formatDate(exam.startDate)}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="w-3 h-3 me-1" />
                          {language === 'ar' ? 'ينتهي في' : 'Ends on'}: {formatDate(exam.endDate)}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <Button 
                      className="w-full btn-cultural"
                      onClick={() => handleStartExam(exam)}
                      disabled={exam.attempts >= exam.maxAttempts}
                    >
                      <PlayCircle className="w-4 h-4 me-2" />
                      {exam.attempts >= exam.maxAttempts 
                        ? (language === 'ar' ? 'تم استنفاد المحاولات' : 'No Attempts Left')
                        : (language === 'ar' ? 'بدء الامتحان' : 'Start Exam')
                      }
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {completedExams.map((exam) => {
              const result = examResults.find(r => r.examId === exam.id);
              return (
                <Card key={exam.id} className="card-elevated">
                  <CardHeader>
                    <CardTitle className="font-tajawal text-lg text-secondary flex items-center">
                      <CheckCircle className="w-5 h-5 me-2 text-success" />
                      {exam.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Badge variant="outline">{exam.subject}</Badge>
                      <Badge className={getDifficultyColor(exam.difficulty)}>
                        {getDifficultyLabel(exam.difficulty)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {language === 'ar' ? 'النتيجة النهائية' : 'Final Score'}
                          </span>
                          <Badge variant={result.passed ? 'default' : 'destructive'}>
                            {result.score}/{result.maxScore}
                          </Badge>
                        </div>
                        <Progress value={(result.score / result.maxScore) * 100} className="mb-2" />
                        <div className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'مكتمل في' : 'Completed on'}: {formatDate(result.completedAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'الوقت المستغرق' : 'Time taken'}: {formatDuration(result.timeSpent)}
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground font-cairo">
                      {exam.description}
                    </p>

                    <Button variant="outline" className="w-full">
                      <Award className="w-4 h-4 me-2" />
                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="font-tajawal text-xl text-secondary">
                  {language === 'ar' ? 'تقرير الأداء' : 'Performance Report'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {examResults.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'امتحانات مكتملة' : 'Exams Completed'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">
                      {examResults.filter(r => r.passed).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'امتحانات ناجحة' : 'Passed Exams'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      {getAverageScore()}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'متوسط الدرجات' : 'Average Score'}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-tajawal text-lg font-semibold text-secondary">
                    {language === 'ar' ? 'النتائج التفصيلية' : 'Detailed Results'}
                  </h3>
                  {examResults.map((result) => {
                    const exam = completedExams.find(e => e.id === result.examId);
                    if (!exam) return null;

                    return (
                      <div key={result.examId} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-tajawal font-semibold">{exam.title}</h4>
                          <Badge variant={result.passed ? 'default' : 'destructive'}>
                            {result.passed ? (language === 'ar' ? 'ناجح' : 'Passed') : (language === 'ar' ? 'راسب' : 'Failed')}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {language === 'ar' ? 'النتيجة:' : 'Score:'}
                            </span>
                            <div className="font-semibold">
                              {result.score}/{result.maxScore} ({Math.round((result.score / result.maxScore) * 100)}%)
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {language === 'ar' ? 'الوقت المستغرق:' : 'Time Taken:'}
                            </span>
                            <div className="font-semibold">{formatDuration(result.timeSpent)}</div>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {language === 'ar' ? 'تاريخ الإكمال:' : 'Completed:'}
                            </span>
                            <div className="font-semibold">{formatDate(result.completedAt)}</div>
                          </div>
                        </div>

                        <Progress value={(result.score / result.maxScore) * 100} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Exam Modal/Details */}
        {selectedExam && (
          <Card className="fixed inset-4 md:inset-8 z-50 overflow-auto card-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-tajawal text-xl text-secondary">
                  {language === 'ar' ? 'تأكيد بدء الامتحان' : 'Confirm Exam Start'}
                </CardTitle>
                <Button variant="ghost" onClick={() => setSelectedExam(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-tajawal text-lg font-semibold">{selectedExam.title}</h3>
              
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <h4 className="font-semibold text-warning mb-2">
                  {language === 'ar' ? 'تعليمات مهمة' : 'Important Instructions'}
                </h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{language === 'ar' ? 'تأكد من اتصال الإنترنت المستقر' : 'Ensure stable internet connection'}</li>
                  <li>{language === 'ar' ? `مدة الامتحان: ${formatDuration(selectedExam.duration)}` : `Exam duration: ${formatDuration(selectedExam.duration)}`}</li>
                  <li>{language === 'ar' ? 'لا يمكن إيقاف الامتحان بعد البدء' : 'Exam cannot be paused once started'}</li>
                  <li>{language === 'ar' ? `المحاولات المتبقية: ${selectedExam.maxAttempts - selectedExam.attempts}` : `Remaining attempts: ${selectedExam.maxAttempts - selectedExam.attempts}`}</li>
                </ul>
              </div>

              <div className="flex space-x-4 rtl:space-x-reverse">
                <Button 
                  className="flex-1 btn-cultural"
                  onClick={() => {
                    toast({
                      title: language === 'ar' ? 'بدء الامتحان' : 'Starting Exam',
                      description: language === 'ar' ? 'جاري تحميل الامتحان...' : 'Loading exam...'
                    });
                    setSelectedExam(null);
                  }}
                >
                  {language === 'ar' ? 'بدء الامتحان الآن' : 'Start Exam Now'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedExam(null)}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};