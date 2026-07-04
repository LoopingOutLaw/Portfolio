import { useEffect, useState } from 'react';

function getTime() {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(new Date());
}

export default function StatusPanel() {
  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(getTime()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="status-panel">
      <div className="flex items-center justify-between">
        <span className="status-panel__label">SYSTEM STATUS</span>
        <div className="flex items-center gap-2">
          <span className="status-pulse h-1.5 w-1.5 rounded-full" />
          <span className="status-panel__online">ONLINE</span>
        </div>
      </div>

      <div className="status-panel__divider" />

      <div className="grid gap-2.5">
        {[
          ['POWER', '98%'],
          ['NETWORK', 'NOMINAL'],
          ['SYSTEMS', 'OPERATIONAL'],
          ['LAST CHECK', time],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <span className="status-panel__row-label">{label}</span>
            <span className="status-panel__value">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="status-panel__ready">ALL SYSTEMS GO</span>
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
          <polyline
            className="ekg-line"
            points="0,8 6,8 8,2 10,14 12,8 20,8"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
