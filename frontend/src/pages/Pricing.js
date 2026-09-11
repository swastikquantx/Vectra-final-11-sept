
import React from 'react';
export default function Pricing(){
  return (
    <div style={{maxWidth:'1000px', margin:'40px auto', padding:'20px'}}>
      <h1 style={{fontSize:'48px', fontWeight:900, textAlign:'center'}}>Pricing</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'20px', marginTop:'40px'}}>
        <div style={{background:'#111', padding:'30px', borderRadius:'16px', border:'1px solid #222'}}>
          <h3>Starter</h3><p style={{fontSize:'32px', fontWeight:800}}>₹499</p><p style={{color:'#888'}}>10 videos / month</p>
          <div style={{marginTop:'20px', padding:'12px', background:'#000', borderRadius:'8px', textAlign:'center'}}>UPI: 7359777788@UPI</div>
        </div>
        <div style={{background:'white', color:'black', padding:'30px', borderRadius:'16px'}}>
          <h3>Pro</h3><p style={{fontSize:'32px', fontWeight:800}}>₹1999</p><p style={{color:'#555'}}>100 videos / month</p>
          <div style={{marginTop:'20px', padding:'12px', background:'black', color:'white', borderRadius:'8px', textAlign:'center'}}>UPI: 7359777788@UPI</div>
        </div>
        <div style={{background:'#111', padding:'30px', borderRadius:'16px', border:'1px solid #222'}}>
          <h3>Founder</h3><p style={{fontSize:'32px', fontWeight:800}}>₹4999</p><p style={{color:'#888'}}>Unlimited + API</p>
          <div style={{marginTop:'20px', padding:'12px', background:'#000', borderRadius:'8px', textAlign:'center'}}>Contact: akhil718@gmail.com</div>
        </div>
      </div>
    </div>
  );
}
