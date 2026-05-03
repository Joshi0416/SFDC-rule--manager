import React from 'react';
import { getAuthUrl } from '../services/salesforce';
import { Cloud } from 'lucide-react';
import './Login.css';

const Login = () => {
  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="icon-wrapper">
          <Cloud size={48} className="cloud-icon" />
        </div>
        <h1>SFDC Rule Manager</h1>
        <p>Manage your Salesforce Account Validation Rules seamlessly.</p>
        <button onClick={handleLogin} className="sf-button">
          Log in with Salesforce
        </button>
      </div>
    </div>
  );
};

export default Login;
