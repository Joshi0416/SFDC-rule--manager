import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';
import { getValidationRules, deployValidationRules } from '../services/salesforce';
import { LogOut, CloudUpload, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const session = getSession();

  useEffect(() => {
    if (!session.token) {
      navigate('/');
    }
  }, [session, navigate]);

  const fetchRules = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const fetchedRules = await getValidationRules(session.token, session.url);
      setRules(fetchedRules);
    } catch (err) {
      setError('Failed to fetch validation rules. Please check your connection or CORS settings in Salesforce.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setRules(rules.map(rule => 
      rule.Id === id ? { ...rule, Active: !rule.Active } : rule
    ));
    setSuccess('');
  };

  const toggleAll = (state) => {
    setRules(rules.map(rule => ({ ...rule, Active: state })));
    setSuccess('');
  };

  const handleDeploy = async () => {
    if (rules.length === 0) return;
    setDeploying(true);
    setError('');
    setSuccess('');
    try {
      await deployValidationRules(session.token, session.url, rules);
      setSuccess('Successfully deployed rules to Salesforce!');
    } catch (err) {
      setError('Failed to deploy some or all rules.');
      console.error(err);
    } finally {
      setDeploying(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  if (!session.token) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Account Validation Rules</h1>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="actions-bar">
          <button onClick={fetchRules} disabled={loading || deploying} className="btn-primary">
            {loading ? <RefreshCw className="spin" size={18} /> : 'Fetch Rules'}
          </button>
          
          <div className="bulk-actions">
            <button onClick={() => toggleAll(true)} disabled={rules.length === 0 || loading || deploying} className="btn-secondary">
              Enable All
            </button>
            <button onClick={() => toggleAll(false)} disabled={rules.length === 0 || loading || deploying} className="btn-secondary outline">
              Disable All
            </button>
          </div>

          <button onClick={handleDeploy} disabled={rules.length === 0 || deploying || loading} className="btn-success">
            {deploying ? <RefreshCw className="spin" size={18} /> : <CloudUpload size={18} />}
            Deploy Changes
          </button>
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="rules-list">
          {rules.length === 0 && !loading && (
            <div className="empty-state">
              <p>No rules loaded. Click "Fetch Rules" to load Account validation rules from Salesforce.</p>
            </div>
          )}

          {rules.map((rule) => (
            <div key={rule.Id} className={`rule-card ${rule.Active ? 'active' : 'inactive'}`}>
              <div className="rule-info">
                <h3>{rule.ValidationName}</h3>
                {rule.Description && <p className="description">{rule.Description}</p>}
                <p className="error-message">Error: {rule.ErrorMessage}</p>
              </div>
              <div className="rule-actions">
                <span className={`status-badge ${rule.Active ? 'active' : 'inactive'}`}>
                  {rule.Active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {rule.Active ? 'Active' : 'Inactive'}
                </span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={rule.Active} 
                    onChange={() => handleToggle(rule.Id)} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
