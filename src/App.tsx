import { useEffect, useState, type JSX } from "react";
import Login from "./pages/login";
import LocationPage from "./pages/location";
import PeoplePage from "./pages/people";
import SymptomsPage from "./pages/symptoms";
import ConfirmPage from "./pages/confirm";
import StatusPage from "./pages/status";
import AdminDashboard from "./pages/admin";

function useHashRoute() {
  const [route, setRoute] = useState<string>(() => window.location.hash.replace(/^#/, "") || "/login");
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#/, "") || "/login");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

export default function App() {
  const route = useHashRoute();

  let element: JSX.Element;
  switch (route) {
    case "/location": element = <LocationPage />; break;
    case "/people":   element = <PeoplePage />;   break;
    case "/symptoms":  return <SymptomsPage />; break;
    case "/confirm":   element = <ConfirmPage />;  break;
    case "/status":   element = <StatusPage />; break;
    case "/admin":    element = <AdminDashboard />; break;
    case "/socorrista": element = <AdminDashboard />; break;
    case "/colaborador": element = <AdminDashboard />; break;
    case "/login":
    default:          element = <Login />;        break;
  }

  // key={route} força remontagem e dispara a animação a cada navegação
  return <div key={route} className="page-transition">{element}</div>;
}
