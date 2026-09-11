
import React from 'react';
export default function Dashboard({ backendUrl, user }){
  return (
    <div style={{maxWidth:'800px', margin:'40px auto', padding:'20px'}}>
      <h1>Dashboard</h1>
      <p style={{color:'#888'}}>User: {user?.email || 'Not logged in'}</p>
      <p style={{color:'#888'}}>Backend: {backendUrl}</p>
      <div style={{marginTop:'20px', padding:'20px', background:'#111', borderRadius:'12px'}}>
        <p>Projects will appear here after backend integration.</p>
      </div>
    </div>
  );
}
