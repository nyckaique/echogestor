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
  const [errorSenha, setErrorSenha] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const { signup, loadingAuth } = useContext(AuthContext);

  async function handleSignUp(e) {
    e.preventDefault();
    setErrorSenha("");
    if (nome !== "" && email !== "" && senha !== "") {
      if (senha.length < 6 || senha.length > 20) {
        setErrorSenha("A senha deve ter entre 6 e 20 caracteres");
      } else if (!isValidEmail(email)) {
        setErrorEmail("Por favor, insira um email válido");
      } else {
        await signup(nome, email, senha);
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
      <form onSubmit={handleSignUp} className="box">
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
          error={!!errorSenha}
          helperText={errorSenha}
        />
        <Button variant="contained" type="submit">
          {loadingAuth ? "Carregando..." : "Cadastrar"}
        </Button>
        <Link to="/">Já tem uma conta? Faça login!</Link>
      </form>
    </div>
  );
}
