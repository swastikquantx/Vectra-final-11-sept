
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = ['founder','admin'].includes(user?.role);
  const items = [
    { label: 'Unified Studio', path: '/studio', adminOnly: false },
    { label: 'Faceless Factory', path: '/faceless', adminOnly: false },
    { label: 'Operations Center', path: '/operations', adminOnly: true },
    { label: 'Admin Panel', path: '/admin', adminOnly: true },
    { label: 'Performance Map', path: '/performance', adminOnly: true },
    { label: 'Engine Manager', path: '/engines', adminOnly: false },
    { label: 'Voice & Dubbing', path: '/voice', adminOnly: false },
    { label: 'Avatar Studio', path: '/avatar', adminOnly: false },
    { label: 'Workflow Studio', path: '/workflow', adminOnly: false },
    { label: 'Cost Governor', path: '/cost', adminOnly: false },
    { label: 'Prepaid Packs', path: '/billing', adminOnly: false },
    { label: 'My Account', path: '/account', adminOnly: false },
    { label: 'Quality Studio', path: '/quality', adminOnly: false },
    { label: 'Distribution Hub', path: '/distribution', adminOnly: false },
    { label: 'Security Center', path: '/security', adminOnly: false },
  ];
  const visible = items.filter(i => !i.adminOnly || isAdmin);
  return (
    <div className="w-64 bg-[#0a0a0f] border-r border-white/5 p-2 space-y-1">
      {visible.map(it => (
        <NavLink key={it.path} to={it.path} className={({isActive}) => `block px-3 py-2 rounded text-sm ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}>
          {it.label}
        </NavLink>
      ))}
    </div>
  );
}
