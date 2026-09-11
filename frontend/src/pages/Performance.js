
import { useEffect, useState } from 'react';
import axios from 'axios';
export default function Performance() {
  const [data, setData] = useState([]);
  useEffect(() => { axios.get('/api/performance/tasks').then(r=>setData(r.data)).catch(()=>{}); }, []);
  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Performance Management - COMPANY → DEPARTMENT → TEAM → EMPLOYEE/AI → KPI/KRA → TASK → RESULT</h1>
      <div className="grid gap-2">
        {data.map(t => (
          <div key={t._id} className="border border-white/10 p-3 rounded text-sm">
            {t.title} - {t.target}/{t.actual} = {t.achievement_percent}% - RAG: {t.rag} - SLA: {t.sla} - Cost: {t.cost}
          </div>
        ))}
      </div>
    </div>
  );
}
