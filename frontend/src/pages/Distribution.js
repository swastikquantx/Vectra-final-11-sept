
import { useEffect, useState } from 'react';
import axios from 'axios';
export default function Distribution() {
  const [status, setStatus] = useState({});
  useEffect(() => { axios.get('/api/distribution/status').then(r=>setStatus(r.data)).catch(()=>{}); }, []);
  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Distribution Hub</h1>
      {Object.entries(status).map(([platform, st]) => (
        <div key={platform} className="p-3 border border-white/10 rounded mb-2">
          {platform}: {st.state} {st.reason && `- ${st.reason}`}
        </div>
      ))}
    </div>
  );
}
