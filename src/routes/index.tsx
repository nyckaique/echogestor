import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Private from "./Private";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/cadastro" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <Private>
            <Dashboard />
          </Private>
        }
      />
    </Routes>
  );
}
