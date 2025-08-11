import React, { useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Coins, MessageCircle } from 'lucide-react';

const BuyPoints: React.FC = () => {
  useEffect(() => {
    document.title = 'شراء النقاط | الأوائل';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'شراء النقاط في منصة الأوائل: 1000 نقطة مقابل 100 جنيه سوداني عبر واتساب.');
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href);
    if (!canonical.parentNode) document.head.appendChild(canonical);
  }, []);

  const whatsappUrl = `https://wa.me/249925385818?text=${encodeURIComponent('أرغب في شراء 1000 نقطة مقابل 100 جنيه سوداني')}`;

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card className="card-cultural max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-tajawal text-2xl flex items-center">
              <Coins className="w-5 h-5 me-2" />
              شراء النقاط
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-cairo">
            <p>سعر الحزمة: 1000 نقطة = 100 جنيه سوداني.</p>
            <p>لطلب الشراء والدفع عبر واتساب، اضغط الزر أدناه وسيتم توجيهك للمحادثة:</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button className="btn-cultural w-full">
                <MessageCircle className="w-4 h-4 me-2" />
                تواصل عبر واتساب (+249 92 538 5818)
              </Button>
            </a>
            <p className="text-sm text-muted-foreground">بعد إتمام الدفع سيتم إضافة النقاط إلى حسابك بواسطة فريق الدعم.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BuyPoints;
