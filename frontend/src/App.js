import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Studio from './pages/Studio';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    const saved = localStorage.getItem('vectra_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  return (
    <Router>
      <div style={{background:'#070708', color:'white', minHeight:'100vh', fontFamily:'Inter, sans-serif'}}>
        <nav style={{display:'flex', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid #222', alignItems:'center'}}>
          <Link to="/" style={{fontWeight:900, fontSize:'20px', letterSpacing:'2px', color:'white', textDecoration:'none'}}>VECTRA AI</Link>
          <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
            <Link to="/studio" style={{color:'#aaa', textDecoration:'none'}}>Studio</Link>
            <Link to="/pricing" style={{color:'#aaa', textDecoration:'none'}}>Pricing</Link>
            <Link to="/dashboard" style={{color:'#aaa', textDecoration:'none'}}>Dashboard</Link>
            {user ? <span style={{color:'#666'}}>{user.email}</span> : <Link to="/login" style={{background:'white', color:'black', padding:'8px 16px', borderRadius:'20px', textDecoration:'none'}}>Login</Link>}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Studio backendUrl={backendUrl} user={user} />} />
          <Route path="/studio" element={<Studio backendUrl={backendUrl} user={user} />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login backendUrl={backendUrl} setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard backendUrl={backendUrl} user={user} />} />
        </Routes>
        <div style={{textAlign:'center', padding:'20px', color:'#444', fontSize:'12px', borderTop:'1px solid #111', marginTop:'40px'}}>
          Swastik AI Labs | UPI: 7359777788@UPI | Founder: akhil718@gmail.com
        </div>
      </div>
    </Router>
  );
}
export default App;
