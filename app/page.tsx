import Header from './home/components/Header';
import ScheduleManager from './home/components/ScheduleManager';
import BackgroundTexture from './home/components/BackgroundTexture';
import WhatsAppButton from './home/components/WhatsAppButton';

/*
  Main Page component.
  Integrates the background, header, and the interactive schedule manager.
*/

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 relative font-sans selection:bg-blue-100 selection:text-blue-900">
      <BackgroundTexture />
      
      <div className="relative z-10">
        <Header />
        
        <div className="container mx-auto">
           <ScheduleManager />
        </div>
      </div>
      
      {/* WhatsApp Button */}
      <WhatsAppButton />
      
      {/* Footer / Copyright */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 text-center z-20">
         <p className="text-xs text-slate-500 font-semibold">
           منظمة التجديد الطلابي - فرع طنجة &copy; 2025
         </p>
      </footer>
    </main>
  );
}
