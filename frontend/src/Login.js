
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Login({ backendUrl, setUser }){
  const [email, setEmail] = useState('akhil718@gmail.com');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password})});
      const data = await res.json();
      if (data.token) { localStorage.setItem('vectra_user', JSON.stringify(data.user)); localStorage.setItem('token', data.token); setUser(data.user); navigate('/studio'); }
      else alert(JSON.stringify(data));
    } catch(err){ alert('Backend error: '+backendUrl) }
  };
  return (
    <div style={{maxWidth:'400px', margin:'80px auto', padding:'30px', background:'#111', borderRadius:'16px'}}>
      <h2>Login to Vectra</h2>
      <form onSubmit={handleLogin} style={{marginTop:'20px', display:'flex', flexDirection:'column', gap:'12px'}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{padding:'12px', background:'#000', color:'white', border:'1px solid #333', borderRadius:'8px'}} />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{padding:'12px', background:'#000', color:'white', border:'1px solid #333', borderRadius:'8px'}} />
        <button type="submit" style={{padding:'12px', background:'white', color:'black', borderRadius:'8px', fontWeight:700}}>Login</button>
      </form>
      <p style={{marginTop:'20px', color:'#666', fontSize:'12px'}}>Backend: {backendUrl}</p>
    </div>
  );
}
