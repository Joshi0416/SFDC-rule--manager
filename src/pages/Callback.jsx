import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { parseHash } from '../services/salesforce';
import { setSession } from '../utils/auth';
import { Loader2 } from 'lucide-react';
import './Callback.css';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    const authData = parseHash(hash);

    if (authData && authData.accessToken) {
      setSession(authData.accessToken, authData.instanceUrl);
      navigate('/dashboard', { replace: true });
    } else {
      // If there's an error or no token, redirect to login
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="callback-container">
      <Loader2 className="spinner" size={48} />
      <p>Authenticating with Salesforce...</p>
    </div>
  );
};

export default Callback;
