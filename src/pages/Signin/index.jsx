import { TextField, Button } from "@mui/material";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./signin.css";
import { AuthContext } from "../../contexts/auth";
import echogestorlogo from "../../assets/echogestorlogo.png";
import { toast } from "react-toastify";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [emailRec, setEmailRec] = useState("");
  const [senha, setSenha] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorEmailRec, setErrorEmailRec] = useState("");
  const [open, setOpen] = useState(false);

  const {
    signin,
    loadingAuth,
    handleForgotPassword,
    resetPasswordError,
    resetPasswordSuccess,
  } = useContext(AuthContext);
  function handleOpen() {
    setOpen(!open);
  }
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
      toast.warning("Preencha todos os campos!");
    }
  }
  function handleRecuperar(e) {
    e.preventDefault();
    setErrorEmailRec("");
    if (emailRec !== "") {
      if (!isValidEmail(emailRec)) {
        setErrorEmailRec("Por favor, insira um email válido");
      } else {
        handleForgotPassword(emailRec);
      }
    } else {
      toast.warning("Preencha todos os campos!");
    }
  }
  const isValidEmail = (email) => {
    // Expressão regular para validar email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  return (
    <div className="container">
      <p className="titulo">
        <img src={echogestorlogo} alt="Echo CRM Logo" className="logo" />
        <span>ECHO GESTOR</span>
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
        <Link onClick={handleOpen} variant="contained">
          Recuperar acesso
        </Link>
      </form>

      <div className="box" style={{ visibility: open ? "visible" : "hidden" }}>
        <p style={{ textAlign: "justify" }}>
          Informe o e-mail da sua conta para recuperar a senha
        </p>
        <div style={{ display: "flex", width: "100%", gap: "1em" }}>
          <TextField
            className="input"
            type="email"
            label="E-mail de recuperação"
            variant="outlined"
            value={emailRec}
            autoFocus={true}
            error={!!errorEmailRec}
            helperText={errorEmailRec}
            onChange={(e) => setEmailRec(e.target.value)}
          />
          <Button variant="contained" onClick={handleRecuperar}>
            Enviar
          </Button>
        </div>

        {resetPasswordSuccess && (
          <div style={{ color: "green", fontSize: "0.8em" }}>
            {resetPasswordSuccess}
          </div>
        )}
        {resetPasswordError && (
          <div style={{ color: "red", fontSize: "0.8em" }}>
            {resetPasswordError}
          </div>
        )}
      </div>
    </div>
  );
}
