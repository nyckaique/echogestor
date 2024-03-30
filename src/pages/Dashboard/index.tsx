import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";
import Header from "../../components/Header";

export default function Dashboard() {
  const { logout }: any = useContext(AuthContext);

  return (
    <div>
      <Header />
      <h1>Pagina de dashboard</h1>
    </div>
  );
}
