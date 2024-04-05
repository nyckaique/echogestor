import { Button, TextField } from "@mui/material";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./signup.css";
import { AuthContext } from "../../contexts/auth";
import echogestorlogo from "../../assets/echogestorlogo.png";

export default function SignUp() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { signup, loadingAuth }: any = useContext(AuthContext);

  async function handleSignUp() {
    await signup(nome, email, senha);
  }

  return (
    <div className="container">
      <p className="titulo align-center">
        {" "}
        <img src={echogestorlogo} alt="Echo CRM Logo" className="logo" /> ECHO
        GESTOR
      </p>
      <div className="box">
        <TextField
          className="input"
          type="name"
          label="Nome"
          variant="outlined"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
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
        <Button variant="contained" onClick={handleSignUp}>
          {loadingAuth ? "Carregando..." : "Cadastrar"}
        </Button>
        <Link to="/">Já tem uma conta? Faça login!</Link>
      </div>
    </div>
  );
}
