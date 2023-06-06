import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
export const requestNotificationPermission = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('token', token);
    return token;
  } catch (error) {
    console.error('Failed to request notification permission:', error.message);
  }
};

export const sendNotificationToJoin = async (key, name) => {
  const serverKey =
    'AAAAmmnCrgE:APA91bEjSH1rzdFfIX4xPL7e-4AuC33ipvc5uQgNQsY1D2PCgL15lUjfIxFKnCyVXa18l_4vm24_AgrE1mKhOba8Rkdi5GbBDiQfsqH8Wow6MWCAyOYwdFQozAW31aYRX2UzDXM7u0zO';
  const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';

  const notificationData = {
    to: key,
    notification: {
      title: name + ' is trying to reach you ',
      body: 'Click here to Answer',
    },
  };

  try {
    const response = await axios.post(fcmEndpoint, notificationData, {
      headers: {
        Authorization: `Bearer ${serverKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Failed to send notification:', error.message);
  }
};
export const getMessage = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
};
