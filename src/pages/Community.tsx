import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Users, 
  BookOpen, 
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Eye,
  Star,
  Plus
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: 'student' | 'teacher';
  };
  content: string;
  subject?: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
}

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  description: string;
  isJoined: boolean;
}

export const Community: React.FC = () => {
  const { user, language } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'groups'>('posts');
  const [newPost, setNewPost] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  React.useEffect(() => {
    document.title = language === 'ar' ? 'المجتمع التعليمي | الأوائل' : 'Learning Community | Al-Awael';
    const metaDesc = document.querySelector('meta[name="description"]');
    const desc = language === 'ar' 
      ? 'انضم إلى المجتمع التعليمي التفاعلي، شارك الأفكار والاستفسارات مع الطلاب والمعلمين'
      : 'Join the interactive learning community, share ideas and questions with students and teachers';
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [language]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: { 
        name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed', 
        role: 'student' 
      },
      content: language === 'ar' 
        ? 'مرحباً جميعاً! هل يمكن لأحد أن يشرح لي مفهوم التفاضل في الرياضيات بطريقة مبسطة؟'
        : 'Hello everyone! Can someone explain the concept of derivatives in mathematics in a simple way?',
      subject: language === 'ar' ? 'الرياضيات' : 'Mathematics',
      createdAt: '2024-01-10T10:30:00Z',
      likes: 15,
      comments: 8,
      views: 45,
      isLiked: false
    },
    {
      id: '2',
      author: { 
        name: language === 'ar' ? 'د. فاطمة علي' : 'Dr. Fatima Ali', 
        role: 'teacher' 
      },
      content: language === 'ar'
        ? 'نصيحة للطلاب: حاولوا ربط المفاهيم النظرية بالتطبيقات العملية في الحياة اليومية لفهم أفضل.'
        : 'Tip for students: Try to connect theoretical concepts with practical applications in daily life for better understanding.',
      subject: language === 'ar' ? 'عام' : 'General',
      createdAt: '2024-01-09T14:20:00Z',
      likes: 32,
      comments: 12,
      views: 78,
      isLiked: true
    },
    {
      id: '3',
      author: { 
        name: language === 'ar' ? 'سارة أحمد' : 'Sara Ahmed', 
        role: 'student' 
      },
      content: language === 'ar'
        ? 'شاركت اليوم في مناقشة رائعة حول الكيمياء العضوية. التعلم التفاعلي يجعل المواد أكثر متعة!'
        : 'Had an amazing discussion about organic chemistry today. Interactive learning makes subjects so much more enjoyable!',
      subject: language === 'ar' ? 'الكيمياء' : 'Chemistry',
      createdAt: '2024-01-08T16:45:00Z',
      likes: 18,
      comments: 5,
      views: 32,
      isLiked: false
    }
  ]);

  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: language === 'ar' ? 'مجموعة الرياضيات المتقدمة' : 'Advanced Mathematics Group',
      subject: language === 'ar' ? 'الرياضيات' : 'Mathematics',
      members: 127,
      description: language === 'ar' 
        ? 'مجموعة لمناقشة مواضيع الرياضيات المتقدمة وحل المسائل معاً'
        : 'Group for discussing advanced mathematics topics and solving problems together',
      isJoined: true
    },
    {
      id: '2',
      name: language === 'ar' ? 'نادي الفيزياء التطبيقية' : 'Applied Physics Club',
      subject: language === 'ar' ? 'الفيزياء' : 'Physics',
      members: 89,
      description: language === 'ar'
        ? 'استكشاف تطبيقات الفيزياء في الحياة العملية والتجارب المثيرة'
        : 'Exploring physics applications in real life and exciting experiments',
      isJoined: false
    },
    {
      id: '3',
      name: language === 'ar' ? 'مختبر الكيمياء الافتراضي' : 'Virtual Chemistry Lab',
      subject: language === 'ar' ? 'الكيمياء' : 'Chemistry',
      members: 156,
      description: language === 'ar'
        ? 'مناقشة التجارب الكيميائية ومشاركة النتائج والملاحظات'
        : 'Discussing chemical experiments and sharing results and observations',
      isJoined: true
    }
  ]);

  const subjects = [
    language === 'ar' ? 'الرياضيات' : 'Mathematics',
    language === 'ar' ? 'الفيزياء' : 'Physics',
    language === 'ar' ? 'الكيمياء' : 'Chemistry',
    language === 'ar' ? 'الأحياء' : 'Biology',
    language === 'ar' ? 'اللغة العربية' : 'Arabic Language',
    language === 'ar' ? 'اللغة الإنجليزية' : 'English Language'
  ];

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast({
        title: language === 'ar' ? 'المحتوى مطلوب' : 'Content required',
        variant: 'destructive'
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: user?.name || (language === 'ar' ? 'مستخدم مجهول' : 'Anonymous User'),
        role: user?.role as 'student' | 'teacher' || 'student'
      },
      content: newPost,
      subject: selectedSubject || (language === 'ar' ? 'عام' : 'General'),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0,
      isLiked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setSelectedSubject('');
    
    toast({
      title: language === 'ar' ? 'تم نشر المنشور' : 'Post published'
    });
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return language === 'ar' ? 'منذ قليل' : 'Just now';
    if (diffInHours < 24) return language === 'ar' ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return language === 'ar' ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;
    
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-amiri text-4xl md:text-5xl font-bold text-secondary mb-4">
            {language === 'ar' ? 'المجتمع التعليمي' : 'Learning Community'}
          </h1>
          <p className="font-cairo text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'تواصل مع زملائك، شارك الأفكار، واطرح الأسئلة في بيئة تعليمية تفاعلية'
              : 'Connect with peers, share ideas, and ask questions in an interactive learning environment'
            }
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'posts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('posts')}
              className="me-1"
            >
              <MessageSquare className="w-4 h-4 me-2" />
              {language === 'ar' ? 'المنشورات' : 'Posts'}
            </Button>
            <Button
              variant={activeTab === 'groups' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('groups')}
            >
              <Users className="w-4 h-4 me-2" />
              {language === 'ar' ? 'المجموعات الدراسية' : 'Study Groups'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-cultural mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 me-2" />
                  {language === 'ar' ? 'الإحصائيات' : 'Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'إجمالي المنشورات' : 'Total Posts'}
                  </span>
                  <span className="font-bold text-primary">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المجموعات النشطة' : 'Active Groups'}
                  </span>
                  <span className="font-bold text-secondary">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'الأعضاء المتفاعلون' : 'Active Members'}
                  </span>
                  <span className="font-bold text-accent">892</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 me-2" />
                  {language === 'ar' ? 'البحث في المنشورات' : 'Search Posts'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="w-4 h-4 me-2" />
                  {language === 'ar' ? 'تصفية حسب المادة' : 'Filter by Subject'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 me-2" />
                  {language === 'ar' ? 'الأحداث القادمة' : 'Upcoming Events'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {/* Create Post */}
                <Card className="card-cultural">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Plus className="w-5 h-5 me-2" />
                      {language === 'ar' ? 'إنشاء منشور جديد' : 'Create New Post'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Textarea
                          placeholder={language === 'ar' 
                            ? 'شارك أفكارك أو اطرح سؤالاً...' 
                            : 'Share your thoughts or ask a question...'
                          }
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-3">
                        <select 
                          className="w-full rounded-md border border-border bg-background px-3 py-2"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                          <option value="">{language === 'ar' ? 'اختر المادة' : 'Select Subject'}</option>
                          {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                        <Button onClick={handleCreatePost} className="w-full btn-cultural">
                          {language === 'ar' ? 'نشر' : 'Post'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts List */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="card-elevated hover:shadow-soft transition-shadow">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Avatar>
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback>
                                {post.author.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <h4 className="font-tajawal font-semibold text-foreground">
                                  {post.author.name}
                                </h4>
                                <Badge variant={post.author.role === 'teacher' ? 'default' : 'secondary'}>
                                  {post.author.role === 'teacher' 
                                    ? (language === 'ar' ? 'معلم' : 'Teacher')
                                    : (language === 'ar' ? 'طالب' : 'Student')
                                  }
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                                <span>{formatDate(post.createdAt)}</span>
                                {post.subject && (
                                  <>
                                    <span>•</span>
                                    <span className="text-primary">{post.subject}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <p className="font-cairo text-foreground leading-relaxed">
                            {post.content}
                          </p>
                        </div>

                        <Separator className="my-4" />

                        {/* Post Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 rtl:space-x-reverse">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className={`${post.isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
                            >
                              <ThumbsUp className={`w-4 h-4 me-2 ${post.isLiked ? 'fill-current' : ''}`} />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <MessageSquare className="w-4 h-4 me-2" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <Share2 className="w-4 h-4 me-2" />
                              {language === 'ar' ? 'مشاركة' : 'Share'}
                            </Button>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Eye className="w-4 h-4 me-1" />
                            {post.views} {language === 'ar' ? 'مشاهدة' : 'views'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="space-y-6">
                {/* Study Groups */}
                <div className="grid md:grid-cols-2 gap-6">
                  {studyGroups.map((group) => (
                    <Card key={group.id} className="card-cultural hover:scale-105 transition-transform">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-tajawal text-lg font-bold text-secondary mb-2">
                              {group.name}
                            </h3>
                            <Badge variant="outline" className="mb-3">
                              {group.subject}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                              <Users className="w-4 h-4 me-1" />
                              {group.members}
                            </div>
                          </div>
                        </div>
                        
                        <p className="font-cairo text-muted-foreground text-sm mb-4 leading-relaxed">
                          {group.description}
                        </p>
                        
                        <Button 
                          className={`w-full ${group.isJoined ? 'btn-secondary' : 'btn-cultural'}`}
                          variant={group.isJoined ? 'outline' : 'default'}
                        >
                          {group.isJoined 
                            ? (language === 'ar' ? 'عضو بالفعل' : 'Already Joined')
                            : (language === 'ar' ? 'انضم للمجموعة' : 'Join Group')
                          }
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Create New Group */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Plus className="w-5 h-5 me-2" />
                      {language === 'ar' ? 'إنشاء مجموعة دراسية جديدة' : 'Create New Study Group'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-cairo text-muted-foreground mb-4">
                      {language === 'ar' 
                        ? 'هل تريد إنشاء مجموعة دراسية جديدة؟ تواصل مع الإدارة للحصول على المساعدة.'
                        : 'Want to create a new study group? Contact administration for assistance.'
                      }
                    </p>
                    <Button variant="outline" className="btn-cultural">
                      {language === 'ar' ? 'طلب إنشاء مجموعة' : 'Request Group Creation'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};