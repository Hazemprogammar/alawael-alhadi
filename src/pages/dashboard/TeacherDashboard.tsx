import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Plus, Trash2, FileText, Link as LinkIcon, Timer, Settings, LayoutList } from 'lucide-react';

// Local types (mock persistence)
export type TeacherCourse = {
  id: string;
  title: string;
  description?: string;
  resources: { title: string; url: string }[];
  createdAt: string;
};

export type MCQQuestion = {
  id: string;
  text: string;
  options: string[]; // 4 by default
  correctIndex: number; // 0..3
};

export type TimerMode = 'perExam' | 'perQuestion';

export type TeacherExam = {
  id: string;
  title: string;
  courseId?: string;
  source: 'internal' | 'external';
  externalLink?: string;
  questions: MCQQuestion[]; // empty if external
  pricePerQuestion: number; // must be <= 5
  timerMode: TimerMode;
  examDurationMinutes?: number; // when perExam
  perQuestionSeconds?: number; // when perQuestion
  createdAt: string;
};

const COURSES_KEY = 'teacher_courses';
const EXAMS_KEY = 'teacher_exams';

function useLocalArray<T>(key: string, initial: T[] = []) {
  const [list, setList] = useState<T[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T[]) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(list));
  }, [key, list]);

  return [list, setList] as const;
}

export const TeacherDashboard: React.FC = () => {
  const { user, language } = useAuth();
  const [courses, setCourses] = useLocalArray<TeacherCourse>(COURSES_KEY, []);
  const [exams, setExams] = useLocalArray<TeacherExam>(EXAMS_KEY, []);

  // SEO
  useEffect(() => {
    document.title = language === 'ar' ? 'لوحة المعلم | الأوائل' : 'Teacher Dashboard | Al-Awael';
    const metaDesc = document.querySelector('meta[name="description"]');
    const desc = language === 'ar' ? 'إنشاء وإدارة الدورات والامتحانات للمعلمين على منصة الأوائل' : 'Create and manage courses and exams for teachers on Al-Awael';
    if (metaDesc) metaDesc.setAttribute('content', desc);
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href);
    if (!canonical.parentNode) document.head.appendChild(canonical);
  }, [language]);

  // ----- Create Course -----
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resources, setResources] = useState<{ title: string; url: string }[]>([]);

  const addResource = () => {
    if (!resourceTitle || !resourceUrl) return;
    setResources(prev => [...prev, { title: resourceTitle, url: resourceUrl }]);
    setResourceTitle('');
    setResourceUrl('');
  };

  const removeResource = (idx: number) => {
    setResources(prev => prev.filter((_, i) => i !== idx));
  };

  const saveCourse = () => {
    if (!courseTitle.trim()) {
      toast({
        title: language === 'ar' ? 'عنوان مطلوب' : 'Title required',
        variant: 'destructive',
      });
      return;
    }
    const newCourse: TeacherCourse = {
      id: crypto.randomUUID(),
      title: courseTitle.trim(),
      description: courseDesc.trim() || undefined,
      resources,
      createdAt: new Date().toISOString(),
    };
    setCourses(prev => [newCourse, ...prev]);
    setCourseTitle('');
    setCourseDesc('');
    setResources([]);
    toast({ title: language === 'ar' ? 'تم إنشاء الدورة' : 'Course created' });
  };

  // ----- Create Exam -----
  const [examTitle, setExamTitle] = useState('');
  const [examCourseId, setExamCourseId] = useState<string>('');
  const [source, setSource] = useState<'internal' | 'external'>('internal');
  const [externalLink, setExternalLink] = useState('');
  const [pricePerQuestion, setPricePerQuestion] = useState<number>(1);
  const [timerMode, setTimerMode] = useState<TimerMode>('perExam');
  const [examDurationMinutes, setExamDurationMinutes] = useState<number>(30);
  const [perQuestionSeconds, setPerQuestionSeconds] = useState<number>(60);

  const [questions, setQuestions] = useState<MCQQuestion[]>([]);

  const addQuestion = () => {
    const q: MCQQuestion = {
      id: crypto.randomUUID(),
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0,
    };
    setQuestions(prev => [...prev, q]);
  };

  const updateQuestion = (id: string, updater: (q: MCQQuestion) => MCQQuestion) => {
    setQuestions(prev => prev.map(q => (q.id === id ? updater(q) : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const clampedPrice = useMemo(() => Math.min(5, Math.max(0, pricePerQuestion || 0)), [pricePerQuestion]);

  const saveExam = () => {
    if (!examTitle.trim()) {
      toast({ title: language === 'ar' ? 'عنوان الامتحان مطلوب' : 'Exam title required', variant: 'destructive' });
      return;
    }
    if (source === 'external' && !externalLink.trim()) {
      toast({ title: language === 'ar' ? 'رابط مطلوب' : 'Link required', variant: 'destructive' });
      return;
    }
    if (source === 'internal' && questions.length === 0) {
      toast({ title: language === 'ar' ? 'أضف سؤالاً واحداً على الأقل' : 'Add at least one question', variant: 'destructive' });
      return;
    }

    if (pricePerQuestion > 5) {
      toast({ title: language === 'ar' ? 'سعر السؤال لا يتجاوز 5 نقاط' : 'Price per question must be ≤ 5', variant: 'destructive' });
      setPricePerQuestion(5);
      return;
    }

    const newExam: TeacherExam = {
      id: crypto.randomUUID(),
      title: examTitle.trim(),
      courseId: examCourseId || undefined,
      source,
      externalLink: source === 'external' ? externalLink.trim() : undefined,
      questions: source === 'internal' ? questions : [],
      pricePerQuestion: clampedPrice,
      timerMode,
      examDurationMinutes: timerMode === 'perExam' ? examDurationMinutes : undefined,
      perQuestionSeconds: timerMode === 'perQuestion' ? perQuestionSeconds : undefined,
      createdAt: new Date().toISOString(),
    };

    setExams(prev => [newExam, ...prev]);

    // reset form
    setExamTitle('');
    setExamCourseId('');
    setSource('internal');
    setExternalLink('');
    setPricePerQuestion(1);
    setTimerMode('perExam');
    setExamDurationMinutes(30);
    setPerQuestionSeconds(60);
    setQuestions([]);

    toast({ title: language === 'ar' ? 'تم إنشاء الامتحان' : 'Exam created' });
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    toast({ title: language === 'ar' ? 'تم حذف الدورة' : 'Course deleted' });
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    toast({ title: language === 'ar' ? 'تم حذف الامتحان' : 'Exam deleted' });
  };

  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <div className="space-y-8">
      {/* Create Course */}
      <Card className="card-cultural">
        <CardHeader>
          <CardTitle className="font-tajawal text-xl flex items-center">
            <BookOpen className="w-5 h-5 me-2" /> {t('إنشاء دورة جديدة', 'Create New Course')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseTitle">{t('عنوان الدورة', 'Course Title')}</Label>
              <Input id="courseTitle" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder={t('مثال: أساسيات الفيزياء', 'e.g., Physics Fundamentals')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseDesc">{t('وصف مختصر', 'Short Description')}</Label>
              <Textarea id="courseDesc" value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} placeholder={t('نبذة عن الدورة...', 'Course summary...')} />
            </div>
          </div>

          {/* Resources from teacher sources */}
          <div className="space-y-3">
            <Label className="font-medium flex items-center"><FileText className="w-4 h-4 me-2" />{t('مصادر الدورة (روابط)', 'Course Resources (Links)')}</Label>
            <div className="grid md:grid-cols-3 gap-3">
              <Input placeholder={t('عنوان المصدر', 'Resource title')} value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)} />
              <Input placeholder={t('رابط المصدر (URL)', 'Resource URL')} value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} />
              <Button type="button" onClick={addResource} className="btn-cultural"><Plus className="w-4 h-4 me-1" />{t('إضافة', 'Add')}</Button>
            </div>
            {resources.length > 0 && (
              <ul className="space-y-2">
                {resources.map((r, idx) => (
                  <li key={idx} className="flex items-center justify-between border border-border rounded-lg p-2">
                    <div className="flex items-center gap-2 text-sm">
                      <LinkIcon className="w-4 h-4" />
                      <span className="font-medium">{r.title}</span>
                      <a href={r.url} target="_blank" rel="noreferrer" className="text-accent underline">{r.url}</a>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeResource(idx)}><Trash2 className="w-4 h-4" /></Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={saveCourse} className="btn-cultural"><Plus className="w-4 h-4 me-1" />{t('حفظ الدورة', 'Save Course')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Exam */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-tajawal text-xl flex items-center">
            <Settings className="w-5 h-5 me-2" /> {t('إنشاء امتحان', 'Create Exam')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="examTitle">{t('عنوان الامتحان', 'Exam Title')}</Label>
              <Input id="examTitle" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} placeholder={t('مثال: اختبار الوحدة الأولى', 'e.g., Unit 1 Quiz')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseSelect">{t('ربط بدورة (اختياري)', 'Link to Course (optional)')}</Label>
              <select id="courseSelect" className="w-full rounded-md border border-border bg-background px-3 py-2" value={examCourseId} onChange={(e) => setExamCourseId(e.target.value)}>
                <option value="">{t('بدون', 'None')}</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('المصدر', 'Source')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={source === 'internal' ? 'default' : 'outline'} onClick={() => setSource('internal')}>{t('داخلي', 'Internal')}</Button>
                <Button type="button" variant={source === 'external' ? 'default' : 'outline'} onClick={() => setSource('external')}>{t('خارجي', 'External')}</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t('سعر السؤال (نقطة) ≤ 5', 'Price per question (points) ≤ 5')}</Label>
              <Input id="price" type="number" min={0} max={5} value={pricePerQuestion} onChange={(e) => setPricePerQuestion(Number(e.target.value))} />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center"><Timer className="w-4 h-4 me-2" />{t('نمط المؤقت', 'Timer Mode')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={timerMode === 'perExam' ? 'default' : 'outline'} onClick={() => setTimerMode('perExam')}>{t('لكل الامتحان', 'Per exam')}</Button>
                <Button type="button" variant={timerMode === 'perQuestion' ? 'default' : 'outline'} onClick={() => setTimerMode('perQuestion')}>{t('لكل سؤال', 'Per question')}</Button>
              </div>
            </div>
          </div>

          {timerMode === 'perExam' ? (
            <div className="space-y-2">
              <Label htmlFor="examDur">{t('مدة الامتحان (بالدقائق)', 'Exam duration (minutes)')}</Label>
              <Input id="examDur" type="number" min={1} value={examDurationMinutes} onChange={(e) => setExamDurationMinutes(Number(e.target.value))} />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="perQ">{t('زمن كل سؤال (بالثواني)', 'Per-question time (seconds)')}</Label>
              <Input id="perQ" type="number" min={10} value={perQuestionSeconds} onChange={(e) => setPerQuestionSeconds(Number(e.target.value))} />
            </div>
          )}

          {source === 'external' ? (
            <div className="space-y-2">
              <Label htmlFor="externalLink">{t('رابط الامتحان الخارجي', 'External exam link')}</Label>
              <Input id="externalLink" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium flex items-center"><LayoutList className="w-4 h-4 me-2" />{t('الأسئلة (اختيار من متعدد)', 'Questions (MCQ)')}</Label>
                <Button type="button" onClick={addQuestion} className="btn-cultural"><Plus className="w-4 h-4 me-1" />{t('إضافة سؤال', 'Add Question')}</Button>
              </div>
              {questions.length === 0 && (
                <p className="text-sm text-muted-foreground">{t('لم تتم إضافة أي أسئلة بعد.', 'No questions added yet.')}</p>
              )}
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="border border-border rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-muted-foreground mt-2">{idx + 1}.</span>
                      <div className="flex-1 space-y-2">
                        <Input placeholder={t('نص السؤال', 'Question text')} value={q.text} onChange={(e) => updateQuestion(q.id, (prev) => ({ ...prev, text: e.target.value }))} />
                        <div className="grid md:grid-cols-2 gap-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input type="radio" name={`correct-${q.id}`} checked={q.correctIndex === i} onChange={() => updateQuestion(q.id, (prev) => ({ ...prev, correctIndex: i }))} />
                              <Input value={opt} placeholder={t(`الخيار ${i + 1}`, `Option ${i + 1}`)} onChange={(e) => updateQuestion(q.id, (prev) => {
                                const next = [...prev.options];
                                next[i] = e.target.value;
                                return { ...prev, options: next };
                              })} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={saveExam} className="btn-cultural"><Plus className="w-4 h-4 me-1" />{t('حفظ الامتحان', 'Save Exam')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Management lists */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-cultural">
          <CardHeader>
            <CardTitle className="font-tajawal text-lg flex items-center"><BookOpen className="w-5 h-5 me-2" />{t('إدارة الدورات', 'Manage Courses')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('لا توجد دورات حالياً.', 'No courses yet.')}</p>
            ) : (
              courses.map((c) => (
                <div key={c.id} className="border border-border rounded-xl p-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-foreground">{c.title}</div>
                    {c.description && <div className="text-sm text-muted-foreground mt-1">{c.description}</div>}
                    {c.resources.length > 0 && (
                      <ul className="list-disc ps-5 mt-2 space-y-1 text-sm">
                        {c.resources.map((r, i) => (
                          <li key={i}><a href={r.url} target="_blank" rel="noreferrer" className="text-accent underline">{r.title}</a></li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteCourse(c.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-tajawal text-lg flex items-center"><Settings className="w-5 h-5 me-2" />{t('إدارة الامتحانات', 'Manage Exams')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {exams.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('لا توجد امتحانات حالياً.', 'No exams yet.')}</p>
            ) : (
              exams.map((e) => (
                <div key={e.id} className="border border-border rounded-xl p-3 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{e.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('المصدر', 'Source')}: {e.source === 'internal' ? t('داخلي', 'Internal') : t('خارجي', 'External')} · {t('السعر/سؤال', 'Price/Q')}: {e.pricePerQuestion} · {t('المؤقت', 'Timer')}: {e.timerMode === 'perExam' ? t('لكل الامتحان', 'Per exam') : t('لكل سؤال', 'Per question')}
                    </div>
                    {e.source === 'external' && e.externalLink && (
                      <a className="text-accent underline text-sm" href={e.externalLink} target="_blank" rel="noreferrer">{t('فتح الرابط الخارجي', 'Open external link')}</a>
                    )}
                    {e.courseId && (
                      <div className="text-xs text-muted-foreground">{t('الدورة المرتبطة', 'Linked Course')}: {courses.find(c => c.id === e.courseId)?.title || '-'}</div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteExam(e.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
