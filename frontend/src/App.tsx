import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { useToast } from "./hooks/useToast";

function App() {
  const { push } = useToast();

  useEffect(() => {
    push({
      variant: "success",
      title: "Context OK",
      message: "ToastProvider montado",
    });
  }, [push]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="container py-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
