import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
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
