import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://localhost:8080/api',
  chatbotUrl: 'http://localhost:8080/api/chat'
};
