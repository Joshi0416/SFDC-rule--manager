export const setSession = (token, url) => {
  sessionStorage.setItem('sf_token', token);
  sessionStorage.setItem('sf_url', url);
};

export const getSession = () => {
  return {
    token: sessionStorage.getItem('sf_token'),
    url: sessionStorage.getItem('sf_url'),
  };
};

export const clearSession = () => {
  sessionStorage.removeItem('sf_token');
  sessionStorage.removeItem('sf_url');
};
