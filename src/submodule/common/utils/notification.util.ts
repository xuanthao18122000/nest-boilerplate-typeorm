import axios from 'axios';
import { getEnv } from '../../configs/env.config';

export const sendNotificationToStaff = (payload: {
  firebaseToken: string;
  title: string;
  shortBody: string;
}) => {
  try {
    axios.post(`${getEnv('URL_NOTIFICATION')}/firebase/send-message`, payload);
    console.log('🚀 Send Notification To Staff Successful 🚀');
    return true;
  } catch (error) {
    console.log('🚀 Send Notification To Staff Failed 🚀');
  }
};
