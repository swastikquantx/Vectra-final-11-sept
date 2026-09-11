
import { Link } from 'react-router-dom';
const PUBLIC_NAV = [
  { label: 'Home', path: '/' },
  { label: 'Create Studio', path: '/studio' },
  { label: 'Templates', path: '/templates' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Login / Create Account', path: '/auth' },
];
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex gap-6 p-4 border-b border-white/10">
        {PUBLIC_NAV.map(i => <Link key={i.path} to={i.path} className="text-sm opacity-70 hover:opacity-100">{i.label}</Link>)}
      </nav>
      <div className="p-8">VECTRA - CREATE + BUILD + PRODUCE by Swastik AI Labs</div>
    </div>
  );
}
