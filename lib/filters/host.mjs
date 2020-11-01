const hostnameFilter = hostname => {
  if (!hostname) return false;
  const regexp = new RegExp('^' + hostname.replace(/[^*\w]/g, '$&').replace(/[*]/g, '(?:.*?)') + '$', 'i');
  return req => {
    if (!req.headers || !req.headers.host) return false;
    const host = req.headers.host.split(':')[0];
    return regexp.test(host);
  }
}

export default hostnameFilter;
