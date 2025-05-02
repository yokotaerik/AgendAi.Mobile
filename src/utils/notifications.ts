import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import api from '../api';

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permissão de notificação negada!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    await api.post('/auth/push-token', { ExpoPushToken:token });
  } else {
    alert('Precisa de um dispositivo físico para usar notificações');
  }
}
