// utils/notifications.js
// Envoi de notifications push Firebase Cloud Messaging (HTTP API)
// Node 18+ exposes global fetch, so no external package is required.

/**
 * Envoie une notification push via FCM HTTP v1
 * @param {string} fcmToken - Token FCM de l'appareil cible
 * @param {Object} payload - { title, body, data }
 */
export async function sendPushNotification(fcmToken, { title, body, data = {} }) {
  try {
    const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;
    if (!FCM_SERVER_KEY) {
      console.warn('⚠️  FCM_SERVER_KEY non configuré — notification ignorée');
      return;
    }
    
    const message = {
      to: fcmToken,
      notification: { title, body },
      data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' }
    };
    
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`
      },
      body: JSON.stringify(message)
    });
    
    const result = await response.json();
    if (result.failure > 0) {
      console.error('FCM error:', result);
    } else {
      console.log('✅ Notification envoyée à:', fcmToken.slice(0, 20) + '...');
    }
  } catch (e) {
    console.error('sendPushNotification error:', e.message);
  }
}