import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  authorizer: (channel) => {
    return {
      authorize: (socketId, callback) => {
        fetch('http://localhost:8000/api/broadcasting/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Your JWT token
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then((response) => response.json())
          .then((data) => callback(null, data))
          .catch((error) => callback(error));
      },
    };
  },
});

export default echo;
