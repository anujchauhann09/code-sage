import "@/styles/globals.css";
import "@/styles/variables.css";
import { useEffect } from "react";
import { AppProvider, useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";

function AppInner({ Component, pageProps }) {
  const { theme } = useAppContext();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <AppInner Component={Component} pageProps={pageProps} />
    </AppProvider>
  );
}
