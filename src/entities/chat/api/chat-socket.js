import { io } from 'socket.io-client'

const socketState = {
  socket: null,
}

export const connectChatSocket = () => {
  if (socketState.socket === null) {
    socketState.socket = io({
      autoConnect: false,
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
