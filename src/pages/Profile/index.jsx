import Header from "../../components/Header";
import Title from "../../components/Title";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import UploadIcon from "@mui/icons-material/Upload";
import { AuthContext } from "../../contexts/auth";
import { useContext, useState } from "react";
import avatar from "../../assets/avatar.jpg";
import "./profile.css";
import { Button } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, setUser, storageUser } = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imagemAvatar, setImagemAvatar] = useState(null);

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);

  async function formSubmit() {
    if (imagemAvatar === null && nome !== "") {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        nome: nome,
      }).then(() => {
        let data = {
          ...user,
          nome: nome,
        };
        setUser(data);
        storageUser(data);
        toast.success("atualizado com sucesso");
      });
    } else if (imagemAvatar !== null && nome !== "") {
      handleFileUpload();
    }
  }

  async function handleFileUpload() {
    const currentUid = user.uid;
    if (imagemAvatar !== null) {
      const uploadRef = ref(
        storage,
        `images/${currentUid}/${imagemAvatar.name}`
      );
      const uploadTask = uploadBytes(uploadRef, imagemAvatar).then(
        (snapshot) => {
          getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
            let urlFoto = downloadUrl;
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
              avatarUrl: urlFoto,
              nome: nome,
            }).then(() => {
              let data = {
                ...user,
                nome: nome,
                avatarUrl: urlFoto,
              };
              setUser(data);
              storageUser(data);
              toast.success("atualizado com sucesso");
            });
          });
        }
      );
    }
  }

  function handleFile(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (
        image.type === "image/png" ||
        image.type === "image/jpg" ||
        image.type === "image/jpeg"
      ) {
        setImagemAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        toast.warning("Por favor, selecione imagens tipo PNG, JPG ou JPEG");
      }
    }
  }

  return (
    <div>
      <Header />
      <Title name="Perfil">
        <ManageAccountsIcon fontSize="large" />
      </Title>
      <form className="formProfile">
        <label className="labelAvatar">
          <span>
            <UploadIcon fontSize="large" />
          </span>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleFile}
          />
          {avatarUrl === null ? (
            <img src={avatar} alt="Foto de Perfil" className="fotoPerfil" />
          ) : (
            <img src={avatarUrl} alt="Foto de Perfil" className="fotoPerfil" />
          )}
        </label>
        <label>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label>Email</label>
        <input type="text" value={email} disabled />

        <Button
          variant="contained"
          onClick={formSubmit}
          style={{ backgroundColor: "#52648b" }}
        >
          Salvar
        </Button>
      </form>
    </div>
  );
}
