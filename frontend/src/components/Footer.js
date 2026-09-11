
import { useAuth } from '../context/AuthContext';
export default function Footer() {
  const { user } = useAuth();
  const isAdmin = ['founder','admin'].includes(user?.role);
  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5 p-6 text-xs text-white/40">
      <div className="grid grid-cols-4 gap-6">
        <div><div className="text-white font-bold">VECTRA</div><div>Create Cinematic Magic</div></div>
        <div><div>PLATFORM</div><a href="/cinematic-arsenal">Cinematic Arsenal</a><br/><a href="/templates">Templates</a></div>
        <div><div>COMPANY</div><a href="/about">About Swastik</a><br/><a href="/pricing">Pricing</a></div>
        <div><div>LEGAL</div><a href="/privacy">Privacy Policy</a><br/><a href="/terms">Terms</a></div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between">
        <span>© 2026 Vectra Cinematic Magic Studio Pro - A Swastik AI Labs venture - vectra-ai.in - Payments via UPI {isAdmin && <a href="/admin" className="ml-2 opacity-70">- Admin console</a>}</span>
      </div>
    </footer>
  );
}
