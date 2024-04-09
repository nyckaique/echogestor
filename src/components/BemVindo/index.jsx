import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import "./bemvindo.css";
import avatar from "../../assets/avatar.jpg";
export default function BemVindo() {
  const { user } = useContext(AuthContext);
  const avatarUrl = user?.avatarUrl || avatar;
  return (
    <div className="bemvindo">
      <img src={avatarUrl} alt="Foto de perfil" />
      <h1>Bem vindo {user.nome}!</h1>
    </div>
  );
}
