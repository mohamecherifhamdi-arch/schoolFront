import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://192.168.49.2:30080/api',
  chatbotUrl: 'http://192.168.49.2:30080/api/chat'
};
