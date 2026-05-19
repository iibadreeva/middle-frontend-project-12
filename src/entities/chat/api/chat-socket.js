import { io } from 'socket.io-client'

const socketState = {
  socket: null,
}

export const connectChatSocket = () => {
  if (socketState.socket === null) {
    socketState.socket = io({
      // Подключаемся вручную после подписки на события в useChatSocket.
      autoConnect: false,
      // При обрыве сети клиент сам переподключается; пользователю не нужен Retry.
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })
  }

  if (!socketState.socket.connected) {
    socketState.socket.connect()
  }

  return socketState.socket
}

export const disconnectChatSocket = () => {
  if (socketState.socket !== null) {
    socketState.socket.removeAllListeners()
    socketState.socket.disconnect()
    socketState.socket = null
  }
}
