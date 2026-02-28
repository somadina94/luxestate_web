"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type WSContextType = {
  socket: WebSocket | null;
  send: (data: unknown) => void;
};

const WSContext = createContext<WSContextType>({
  socket: null,
  send: () => {},
});

export const WebSocketProvider = ({
  token,
  children,
}: {
  token: string;
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}${token}`);
    // const ws = new WebSocket(`ws://localhost:8000/ws/multi?token=${token}`);

    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
      setSocket(ws);
    };
    ws.onclose = () => {
      console.log("WS disconnected");
      setSocket(null);
      socketRef.current = null;
    };
    ws.onerror = (err) => console.error("WS error", err);

    return () => {
      ws.close();
      setSocket(null);
      socketRef.current = null;
    };
  }, [token]);

  const send = (data: unknown) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  return (
    <WSContext.Provider value={{ socket, send }}>{children}</WSContext.Provider>
  );
};

export const useWS = () => useContext(WSContext);
