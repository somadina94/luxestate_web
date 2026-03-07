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

const RECONNECT_INITIAL_MS = 1000;
const RECONNECT_MAX_MS = 30000;

function getWsUrl(token: string): string | null {
  if (!token) return null;
  const base =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_WS_BASE_URL?.trim();
  if (base) {
    return base.endsWith("?") || base.includes("?") ? `${base}${token}` : `${base}?token=${token}`;
  }
  if (typeof window !== "undefined") {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
    if (api) {
      const wsScheme = api.startsWith("https") ? "wss" : "ws";
      const host = api.replace(/^https?:\/\//, "").replace(/\/$/, "");
      return `${wsScheme}://${host}/ws/multi?token=${token}`;
    }
  }
  return null;
}

export const WebSocketProvider = ({
  token,
  children,
}: {
  token: string;
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);

  useEffect(() => {
    const url = getWsUrl(token);
    if (!url) return;

    let currentWs: WebSocket | null = null;

    const connect = () => {
      const ws = new WebSocket(url);
      currentWs = ws;
      socketRef.current = ws;

      ws.onopen = () => {
        reconnectAttemptRef.current = 0;
        setSocket(ws);
      };

      ws.onclose = () => {
        socketRef.current = null;
        setSocket(null);
        const delay = Math.min(
          RECONNECT_INITIAL_MS * 2 ** reconnectAttemptRef.current,
          RECONNECT_MAX_MS
        );
        reconnectAttemptRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connect();
        }, delay);
      };

      ws.onerror = () => {};
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      socketRef.current = null;
      setSocket(null);
      if (
        currentWs?.readyState === WebSocket.CONNECTING ||
        currentWs?.readyState === WebSocket.OPEN
      ) {
        currentWs.close();
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
