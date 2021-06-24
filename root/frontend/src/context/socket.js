import React from "react";
import socketio from "socket.io-client";

//no url since backend is hosted on the same domain
export const socket = socketio.connect();
export const SocketContext = React.createContext();