let socket = null;

export const connectSocket = (userEmail) => {
  socket = new WebSocket(`ws://localhost:8080/ws/notification/${userEmail}`); 

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error", error);
  };

  return socket;
};

export const getSocket = () => socket;
