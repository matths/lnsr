import { atob } from '../utils/base64.mjs';

const hasUsers = users => Object.entries(users).length > 0;

const userIncludedAndCorrect = (users, authorizationHeader) => {
  if (!authorizationHeader) return false;
  if (!hasUsers(users)) return false;

  const [type, value] = authorizationHeader.split(' ');
  if (type.toLowerCase() !== 'basic') return false;

  const [username, password] = atob(value).split(':');
  if (!Object.keys(users).includes(username)) return false;

  return users[username] === password;
}

const authorizationInteractor = (config, middleware) => {
  return (req, res, next) => {
    if (config['users'] && userIncludedAndCorrect(config.users, req.headers.authorization)) {
      middleware(req, res, next);
    } else {
      const realm = config['realm'] ? config.realm : 'Authorized users only.';
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="' + realm + '"' });
      res.end('Unauthorized');
    }
  }
}

export default authorizationInteractor;
