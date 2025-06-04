import * as Notifications from 'expo-notifications';
import * as Localization from 'expo-localization';
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

    const { data: token } = await Notifications.getDevicePushTokenAsync();
    const Language = Localization.locale; // pega a linguagem do dispositivo do usuário

    await api.post('/auth/push-token', { ExpoPushToken:token, Language });
  } else {
    alert('Precisa de um dispositivo físico para usar notificações');
  }
}
