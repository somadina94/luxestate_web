"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
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
    socketRef.current = ws;

    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onclose = () => {
      setSocket(null);
      socketRef.current = null;
    };
    ws.onerror = () => {};

    return () => {
      socketRef.current = null;
      setSocket(null);
      if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [token]);

  const send = useCallback(
    (data: unknown) => {
      const s = socketRef.current ?? socket;
      if (s?.readyState === WebSocket.OPEN) {
        s.send(JSON.stringify(data));
      }
    },
    [socket]
  );

  return (
    <WSContext.Provider value={{ socket, send }}>{children}</WSContext.Provider>
  );
};

export const useWS = () => useContext(WSContext);
