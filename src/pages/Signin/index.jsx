import { TextField, Button } from "@mui/material";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./signin.css";
import { AuthContext } from "../../contexts/auth";
import echogestorlogo from "../../assets/echogestorlogo.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const { signin, loadingAuth } = useContext(AuthContext);

  async function handleSignIn(e) {
    e.preventDefault();
    setErrorEmail("");
    if (email !== "" && senha !== "") {
      if (!isValidEmail(email)) {
        setErrorEmail("Por favor, insira um email válido");
      } else {
        await signin(email, senha);
      }
    } else {
      alert("Preencha todos os campos!");
    }
  }
  const isValidEmail = (email) => {
    // Expressão regular para validar email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  return (
    <div className="container">
      <p className="titulo align-center">
        {" "}
        <img src={echogestorlogo} alt="Echo CRM Logo" className="logo" /> ECHO
        GESTOR
      </p>
      <form onSubmit={handleSignIn} className="box">
        <TextField
          className="input"
          type="email"
          label="E-mail"
          variant="outlined"
          value={email}
          autoFocus={true}
          error={!!errorEmail}
          helperText={errorEmail}
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
        <Button type="submit" variant="contained">
          {loadingAuth ? "Carregando..." : "Login"}
        </Button>
        <Link to="/cadastro">Criar uma conta</Link>
      </form>
    </div>
  );
}
