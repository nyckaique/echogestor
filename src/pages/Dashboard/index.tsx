import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";

export default function Dashboard() {
  const { logout }: any = useContext(AuthContext);

  return (
    <div>
      <h1>Pagina de dashboard</h1>
      <button onClick={logout}>Sair da conta</button>
    </div>
  );
}
