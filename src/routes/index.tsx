import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";
import Home from "../pages/Home";
import Private from "./Private";
import Profile from "../pages/Profile";
import Clientes from "../pages/Clientes";
import Produtos from "../pages/Produtos";
import Agendamentos from "../pages/Agendamentos";
import Cliente from "../pages/Cliente";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/cadastro" element={<SignUp />} />
      <Route
        path="/home"
        element={
          <Private>
            <Home />
          </Private>
        }
      />
      <Route
        path="/perfil"
        element={
          <Private>
            <Profile />
          </Private>
        }
      />
      <Route
        path="/clientes"
        element={
          <Private>
            <Clientes />
          </Private>
        }
      />
      <Route
        path="/produtos"
        element={
          <Private>
            <Produtos />
          </Private>
        }
      />
      <Route
        path="/agendamentos"
        element={
          <Private>
            <Agendamentos />
          </Private>
        }
      />
      <Route
        path="/cliente/:id"
        element={
          <Private>
            <Cliente />
          </Private>
        }
      />
    </Routes>
  );
}
