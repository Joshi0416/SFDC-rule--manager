// Salesforce Service for OAuth and API requests

const SF_LOGIN_URL = import.meta.env.VITE_SF_LOGIN_URL || 'https://login.salesforce.com';
const CLIENT_ID = import.meta.env.VITE_SF_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_APP_URL + '/callback';

export const getAuthUrl = () => {
  return `${SF_LOGIN_URL}/services/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
};

export const parseHash = (hash) => {
  if (!hash) return null;
  const params = new URLSearchParams(hash.substring(1));
  return {
    accessToken: params.get('access_token'),
    instanceUrl: params.get('instance_url'),
  };
};

export const getValidationRules = async (accessToken, instanceUrl) => {
  // Query Account Validation Rules using Tooling API
  const query = `SELECT Id, ValidationName, Active, Description, ErrorMessage FROM ValidationRule WHERE EntityDefinitionId = 'Account'`;
  const url = `${instanceUrl}/services/data/v60.0/tooling/query/?q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch validation rules');
  }

  const data = await response.json();
  return data.records;
};

export const deployValidationRules = async (accessToken, instanceUrl, rules) => {
  // We can use the Composite API to update multiple records at once, 
  // but for Tooling API, we might need to update them individually or use composite tooling.
  // For simplicity and since there are only 4-5 rules, we can do multiple PATCH requests using Promise.all
  
  const promises = rules.map(async rule => {
    const url = `${instanceUrl}/services/data/v60.0/tooling/sobjects/ValidationRule/${rule.Id}`;
    
    // First, fetch the current rule which includes the full Metadata object
    const getResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch metadata for rule ${rule.Id}`);
    }

    const currentRuleData = await getResponse.json();

    // Merge the updated Active state into the existing Metadata object
    const updatedMetadata = {
      ...currentRuleData.Metadata,
      active: rule.Active
    };

    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Metadata: updatedMetadata
      })
    });
  });

  const responses = await Promise.all(promises);
  
  const failed = responses.filter(r => !r.ok);
  if (failed.length > 0) {
    const errorDetails = await failed[0].text();
    console.error('Deploy error details:', errorDetails);
    throw new Error(`Failed to update ${failed.length} rules.`);
  }
  
  return true;
};
