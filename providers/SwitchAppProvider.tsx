"use client";
import React, { useCallback, useEffect } from "react";

interface SwitchAppProps {
  children: React.ReactNode;
}

export type APP_LIST = "coom-video" | "coom-chat" | "coom-notes";

const SwitchAppContext = React.createContext({
  currentApp: "coom-video",
  action: {
    changeApp: (app: APP_LIST) => {},
  },
});

export function useCurrentApp() {
  return React.useContext(SwitchAppContext);
}

const SwitchAppProvider = ({ children }: SwitchAppProps) => {
  const [currentApp, setCurrentApp] = React.useState<APP_LIST>("coom-video");

  const changeApp = useCallback((app: APP_LIST) => {
    setCurrentApp(app);
    window.location.pathname = `/${app}`;
  }, []);

  useEffect(() => {
    const pathname = window.location.pathname.split("/")[1];
    if (pathname !== "") {
      setCurrentApp(pathname as APP_LIST);
    }
  }, []);

  const switchApp = {
    currentApp,
    action: { changeApp },
  };
  return (
    <SwitchAppContext.Provider value={switchApp}>
      {children}
    </SwitchAppContext.Provider>
  );
};

export default SwitchAppProvider;
