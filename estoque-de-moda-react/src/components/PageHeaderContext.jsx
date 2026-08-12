import { createContext, useContext, useEffect } from "react";

export const PageHeaderContext = createContext(() => {});

// Hook usado dentro de cada página para definir a migalha de pão (crumb) e o título
export function usePageHeader(crumb, title) {
  const setHeader = useContext(PageHeaderContext);
  useEffect(() => {
    setHeader({ crumb, title });
  }, [crumb, title, setHeader]);
}
