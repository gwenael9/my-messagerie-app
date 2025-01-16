import { Outlet } from "@remix-run/react";
import "./styles/global.css";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Layout title="Accueil">
      <Outlet />;
    </Layout>
  );
}
