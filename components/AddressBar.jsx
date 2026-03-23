import React from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ShieldAlert, ShieldCheck, Info } from 'lucide-react';
import './AddressBar.css';

const AddressBar = ({ inputValue, setInputValue, handleNavigate, report, toggleThreatPanel }) => {
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNavigate(inputValue);
    }
  };

  const getScoreColor = (score) => {
    if (score < 40) return 'score-pill-danger';
    if (score > 80) return 'score-pill-safe';
    return 'score-pill-warning';
  };

  return (
    <div className="address-bar-container">
      <div className="nav-buttons">
        <button className="nav-btn"><ArrowLeft size={18} /></button>
        <button className="nav-btn"><ArrowRight size={18} /></button>
        <button className="nav-btn"><RotateCw size={18} /></button>
      </div>

      <div className={`address-input-wrapper ${report && report.score < 40 ? 'pulse-border-danger' : ''}`}>
        <input 
          type="text" 
          className="address-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter a URL or search query..."
        />
        
        {report && (
          <div 
            className={`score-pill ${getScoreColor(report.score)}`}
            onClick={toggleThreatPanel}
            title="Click to view full security report"
          >
            {report.score < 40 ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
            <span>Bruh Score: {report.score}</span>
          </div>
        )}
      </div>

      <div className="extensions-area">
        <button className="nav-btn" onClick={toggleThreatPanel} title="Threat Panel">
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default AddressBar;
