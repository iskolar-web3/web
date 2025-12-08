import { useEffect } from "react";

/**
 * Custom hook to dynamically set the browser tab title
 * @param title - Page title 
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const appName = "iSkolar"; 
    document.title = title ? `${appName} | ${title}` : appName;
  }, [title]);
}