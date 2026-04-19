import React, { useState, useEffect } from 'react';
import { Monitor, Grid, Wifi, Volume2, Battery } from 'lucide-react';
import './Desktop.css';

const Desktop = ({ children }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="os-desktop">
      <div className="os-workspace">
        {children}
      </div>
      <div className="os-taskbar glass-panel">
        <div className="taskbar-start-btn">
          <Grid size={20} />
        </div>
        <div className="taskbar-apps">
          <div className="taskbar-app active">
            <img src="/logo.png" className="app-icon" alt="Bruhwser Logo" style={{ width: 18, height: 18, objectFit: 'contain' }} />
            <span>Bruhwser</span>
          </div>
        </div>
        <div className="taskbar-system-tray">
          <div className="tray-icon"><Wifi size={16} /></div>
          <div className="tray-icon"><Volume2 size={16} /></div>
          <div className="tray-icon"><Battery size={16} /></div>
          <div className="taskbar-clock">
            <div className="clock-time">{formatTime(time)}</div>
            <div className="clock-date">{formatDate(time)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
