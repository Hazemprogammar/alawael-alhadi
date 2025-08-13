import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Award, Link as LinkIcon, Timer, Coins, FileText } from 'lucide-react';

// Local types to mirror TeacherDashboard storage
type FileResource = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

type TeacherCourse = {
  id: string;
  title: string;
  description?: string;
  resources: { title: string; url: string }[];
  files?: FileResource[];
  createdAt: string;
};

type MCQQuestion = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
};

type TimerMode = 'perExam' | 'perQuestion';

type TeacherExam = {
  id: string;
  title: string;
  courseId?: string;
  source: 'internal' | 'external';
  externalLink?: string;
  questions: MCQQuestion[];
  pricePerQuestion: number;
  timerMode: TimerMode;
  examDurationMinutes?: number;
  perQuestionSeconds?: number;
  createdAt: string;
};

type Homework = {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueAt: string;
  createdAt: string;
};

type HomeworkSubmission = {
  homeworkId: string;
  studentId: string;
  studentName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl: string;
  submittedAt: string;
};

const COURSES_KEY = 'teacher_courses';
const EXAMS_KEY = 'teacher_exams';
const HOMEWORKS_KEY = 'teacher_homeworks';
const SUBMISSIONS_KEY = 'homework_submissions';

const Courses: React.FC = () => {
  const { user, language } = useAuth();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [exams, setExams] = useState<TeacherExam[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);

  useEffect(() => {
    document.title = language === 'ar' ? 'الدورات والامتحانات | الأوائل' : 'Courses & Exams | Al-Awael';
    const metaDesc = document.querySelector('meta[name="description"]');
    const desc = language === 'ar'
      ? 'استعرض الدورات التعليمية والامتحانات المرتبطة بكل دورة على منصة الأوائل'
      : 'Browse educational courses and their associated exams on Al-Awael';
    if (metaDesc) metaDesc.setAttribute('content', desc);
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href);
    if (!canonical.parentNode) document.head.appendChild(canonical);
  }, [language]);

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(COURSES_KEY) || '[]') as TeacherCourse[];
      const e = JSON.parse(localStorage.getItem(EXAMS_KEY) || '[]') as TeacherExam[];
      const h = JSON.parse(localStorage.getItem(HOMEWORKS_KEY) || '[]') as Homework[];
      const s = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]') as HomeworkSubmission[];
      setCourses(Array.isArray(c) ? c : []);
      setExams(Array.isArray(e) ? e : []);
      setHomeworks(Array.isArray(h) ? h : []);
      setSubmissions(Array.isArray(s) ? s : []);
    } catch {
      setCourses([]);
      setExams([]);
      setHomeworks([]);
      setSubmissions([]);
    }
  }, []);

  // Enrollments per student
  const [enrollBump, setEnrollBump] = useState(0);
  const enrolledIds = useMemo(() => {
    if (!user) return [] as string[];
    try {
      const ids = JSON.parse(localStorage.getItem(`enrollments:${user.id}`) || '[]') as string[];
      return Array.isArray(ids) ? ids : [];
    } catch {
      return [] as string[];
    }
  }, [user, courses, enrollBump]);

  const toggleEnroll = (courseId: string) => {
    if (!user) return;
    const key = `enrollments:${user.id}`;
    const next = enrolledIds.includes(courseId)
      ? enrolledIds.filter((id) => id !== courseId)
      : [...enrolledIds, courseId];
    localStorage.setItem(key, JSON.stringify(next));
    toast({ title: language === 'ar' ? (enrolledIds.includes(courseId) ? 'تم إلغاء التسجيل' : 'تم التسجيل') : (enrolledIds.includes(courseId) ? 'Unenrolled' : 'Enrolled') });
    setEnrollBump((v) => v + 1);
  };

  const examsByCourse = useMemo(() => {
    const map: Record<string, TeacherExam[]> = {};
    for (const ex of exams) {
      const key = ex.courseId || '__unlinked__';
      if (!map[key]) map[key] = [];
      map[key].push(ex);
    }
    return map;
  }, [exams]);

  const homeworksByCourse = useMemo(() => {
    const map: Record<string, Homework[]> = {};
    for (const hw of homeworks) {
      const key = hw.courseId || '__unlinked__';
      if (!map[key]) map[key] = [];
      map[key].push(hw);
    }
    return map;
  }, [homeworks]);

  const getMySubmission = (homeworkId: string) => submissions.find(s => s.homeworkId === homeworkId && s.studentId === (user?.id || ''));

  const MAX_SIZE = 10 * 1024 * 1024;
  const ALLOWED_MIMES = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ]);

  const handleHomeworkUpload = async (homework: Homework, fileList: FileList | null) => {
    if (!user || user.role !== 'student') { toast({ title: t('سجّل دخولك كطالب', 'Login as a student') }); return; }
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!ALLOWED_MIMES.has(file.type)) { toast({ title: t('نوع الملف غير مسموح', 'File type not allowed'), variant: 'destructive' }); return; }
    if (file.size > MAX_SIZE) { toast({ title: t('الملف كبير جداً (10MB كحد أقصى)', 'File too large (max 10MB)'), variant: 'destructive' }); return; }

    const now = new Date();
    const due = new Date(homework.dueAt);
    if (now > due) { toast({ title: t('انتهى موعد التسليم', 'Due date passed'), variant: 'destructive' }); return; }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const existingIdx = submissions.findIndex(s => s.homeworkId === homework.id && s.studentId === user.id);
    const newSubmission: HomeworkSubmission = {
      homeworkId: homework.id,
      studentId: user.id,
      studentName: user.name,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      dataUrl,
      submittedAt: new Date().toISOString(),
    };

    let next = [...submissions];
    if (existingIdx >= 0) next[existingIdx] = newSubmission; else next.unshift(newSubmission);
    setSubmissions(next);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(next));
    toast({ title: t('تم تسليم الواجب', 'Homework submitted') });
  };

  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="font-tajawal text-2xl md:text-3xl font-bold text-secondary">
            {t('الدورات والامتحانات', 'Courses and Exams')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('تجد هنا الامتحانات المرتبطة بكل دورة أنشأها المعلم', 'Here you will find exams linked to each teacher-created course')}
          </p>
        </header>

        {courses.length === 0 ? (
          <Card className="card-cultural">
            <CardContent className="py-8 text-center text-muted-foreground">
              {t('لا توجد دورات متاحة حالياً.', 'No courses available yet.')}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => {
              const linkedExams = examsByCourse[course.id] || [];
              return (
                <Card key={course.id} className="card-cultural">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-tajawal text-xl flex items-center">
                      <BookOpen className="w-5 h-5 me-2" /> {course.title}
                    </CardTitle>
                    {user?.role === 'student' && (
                      <Button size="sm" variant={enrolledIds.includes(course.id) ? 'secondary' : 'default'} onClick={() => toggleEnroll(course.id)}>
                        {enrolledIds.includes(course.id) ? t('مسجل', 'Enrolled') : t('سجل الآن', 'Enroll')}
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.description && (
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    )}

                    {(course.resources?.length || course.files?.length) ? (
                      <div>
                        {course.resources?.length ? (
                          <div>
                            <div className="font-medium mb-2">{t('مصادر الدورة', 'Course Resources')}</div>
                            <ul className="space-y-2">
                              {course.resources.map((r, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                  <LinkIcon className="w-4 h-4" />
                                  <span className="font-medium">{r.title}</span>
                                  <a className="text-accent underline" href={r.url} target="_blank" rel="noreferrer">
                                    {r.url}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {course.files?.length ? (
                          <div className="mt-4">
                            <div className="font-medium mb-2">{t('ملفات الدورة', 'Course Files')}</div>
                            <ul className="space-y-2">
                              {course.files.map((f) => (
                                <li key={f.id} className="flex items-center gap-2 text-sm">
                                  <LinkIcon className="w-4 h-4" />
                                  <span className="font-medium">{f.name}</span>
                                  <a className="text-accent underline" href={f.dataUrl} download={f.name} target="_blank" rel="noreferrer">
                                    {t('تنزيل/فتح', 'Open/Download')}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <Separator className="my-2" />

                    <div>
                      <div className="font-medium mb-2 flex items-center">
                        <Award className="w-4 h-4 me-2" />
                        {t('الامتحانات المرتبطة', 'Linked Exams')}
                      </div>

                      {linkedExams.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t('لا توجد امتحانات لهذه الدورة بعد.', 'No exams for this course yet.')}</p>
                      ) : (
                        <ul className="space-y-3">
                          {linkedExams.map((ex) => (
                            <li key={ex.id} className="border border-border rounded-lg p-3">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                  <div className="font-medium">{ex.title}</div>
                                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                                    <span>{t('المصدر:', 'Source:')} {t(ex.source === 'internal' ? 'داخلي' : 'خارجي', ex.source === 'internal' ? 'Internal' : 'External')}</span>
                                    <span className="flex items-center"><Coins className="w-3 h-3 me-1" />{t('سعر السؤال', 'Price/question')}: {Math.min(5, ex.pricePerQuestion)} {t('نقطة', 'pt')}</span>
                                    <span className="flex items-center"><Timer className="w-3 h-3 me-1" />{t('المؤقت', 'Timer')}: {ex.timerMode === 'perExam' ? `${ex.examDurationMinutes} ${t('دقيقة', 'min')}` : `${ex.perQuestionSeconds} ${t('ثانية/سؤال', 'sec/q')}`}</span>
                                    {ex.source === 'internal' && (
                                      <span>{t('عدد الأسئلة', 'Questions')}: {ex.questions.length}</span>
                                    )}
                                  </div>
                                </div>

                                {ex.source === 'external' ? (
                                  <a href={ex.externalLink} target="_blank" rel="noreferrer">
                                    <Button variant="outline">{t('الذهاب للرابط', 'Open link')}</Button>
                                  </a>
                                ) : (
                                  <Button variant="outline" disabled>
                                    {t('بدء (قريباً)', 'Start (soon)')}
                                  </Button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <div className="font-medium mb-2 flex items-center">
                        <FileText className="w-4 h-4 me-2" />
                        {t('الواجبات', 'Homeworks')}
                      </div>
                      {(() => {
                        const list = homeworksByCourse[course.id] || [];
                        if (list.length === 0) return (
                          <p className="text-sm text-muted-foreground">{t('لا توجد واجبات لهذه الدورة بعد.', 'No homeworks for this course yet.')}</p>
                        );
                        return (
                          <ul className="space-y-3">
                            {list.map((hw) => {
                              const sub = getMySubmission(hw.id);
                              const due = new Date(hw.dueAt);
                              const overdue = new Date() > due;
                              return (
                                <li key={hw.id} className="border border-border rounded-lg p-3">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                      <div className="font-medium">{hw.title}</div>
                                      <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                                        <span>{t('الاستحقاق:', 'Due:')} {due.toLocaleString()}</span>
                                        <span>{sub ? t('تم التسليم', 'Submitted') : overdue ? t('متأخر', 'Overdue') : t('لم يُسلّم', 'Not submitted')}</span>
                                      </div>
                                    </div>
                                    {user?.role === 'student' && enrolledIds.includes(course.id) && (
                                      <div className="flex items-center gap-2">
                                        <Input type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={(e) => handleHomeworkUpload(hw, e.target.files)} />
                                      </div>
                                    )}
                                  </div>
                                  {sub && (
                                    <div className="text-xs text-muted-foreground mt-2">
                                      {t('آخر تسليم:', 'Last submission:')} {new Date(sub.submittedAt).toLocaleString()} — {sub.fileName}
                                      {' '}· <a className="text-accent underline" href={sub.dataUrl} download={sub.fileName} target="_blank" rel="noreferrer">{t('عرض/تنزيل', 'View/Download')}</a>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
