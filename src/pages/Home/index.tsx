import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import HomeIcon from "@mui/icons-material/Home";
export default function Home() {
  const { logout }: any = useContext(AuthContext);

  return (
    <div>
      <Header />
      <Title name="Home">
        <HomeIcon fontSize="large" />
      </Title>
    </div>
  );
}
