import { TextField, Button } from "@mui/material";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./signin.css";
import { AuthContext } from "../../contexts/auth";
import echocrmlogo from "../../assets/echocrmlogo.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { signin, loadingAuth }: any = useContext(AuthContext);

  async function handleSignIn() {
    if (email !== "" && senha !== "") {
      await signin(email, senha);
    }
  }
  return (
    <div className="container">
      <p className="titulo align-center">
        {" "}
        <img src={echocrmlogo} alt="Echo CRM Logo" className="logo" /> ECHO CRM
      </p>
      <div className="box">
        <TextField
          className="input"
          type="email"
          label="E-mail"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className="input"
          type="password"
          label="Senha"
          variant="outlined"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Button variant="contained" onClick={handleSignIn}>
          {loadingAuth ? "Carregando..." : "Login"}
        </Button>
        <Link to="/cadastro">Criar uma conta</Link>
      </div>
    </div>
  );
}
