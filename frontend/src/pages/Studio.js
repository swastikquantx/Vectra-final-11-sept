
import React, { useState } from 'react';
export default function Studio({ backendUrl, user }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const handleGenerate = async () => {
    if (!prompt) return alert('Enter prompt');
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/video/generate`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({prompt, style: 'cinematic'})
      });
      const data = await res.json();
      setResult(data);
    } catch(e){ alert('Backend not connected: '+backendUrl) }
    setLoading(false);
  };
  return (
    <div style={{maxWidth:'800px', margin:'40px auto', padding:'20px'}}>
      <h1 style={{fontSize:'48px', fontWeight:900, marginBottom:'10px'}}>Create Faceless Videos</h1>
      <p style={{color:'#888', marginBottom:'30px'}}>Powered by Veo 3.1 | Backend: {backendUrl}</p>
      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="A cinematic shot of a future city at night, neon lights..." style={{width:'100%', height:'120px', background:'#111', color:'white', border:'1px solid #333', borderRadius:'12px', padding:'16px', fontSize:'16px'}} />
      <button onClick={handleGenerate} disabled={loading} style={{marginTop:'16px', width:'100%', padding:'16px', background:'white', color:'black', borderRadius:'12px', fontWeight:700, fontSize:'16px', cursor:'pointer'}}>{loading?'Generating...':'Generate Video'}</button>
      {result && <div style={{marginTop:'20px', padding:'20px', background:'#111', borderRadius:'12px'}}><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(result, null, 2)}</pre></div>}
    </div>
  );
}
