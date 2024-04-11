import { useState, createContext, useEffect } from "react";
import { auth, db } from "../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();
  const [resetPasswordError, setResetPasswordError] = useState(null);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const storageUser = localStorage.getItem("@echoCrmUser");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  async function resetPass(email) {
    await sendPasswordResetEmail(auth, email);
  }
  // Função para lidar com a recuperação de senha
  async function handleForgotPassword(email) {
    await fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        // Verifique se o email fornecido tem um método de login associado a ele
        if (signInMethods && signInMethods.includes("password")) {
          // Email válido, envie o email de recuperação de senha

          resetPass(email);
        } else {
          // O email fornecido não está associado a uma conta
          throw new Error("O email fornecido não está cadastrado");
        }
      })
      .then(() => {
        // Email de recuperação de senha enviado com sucesso
        setResetPasswordSuccess(
          "Um email de recuperação de senha foi enviado para o email cadastrado."
        );
        setResetPasswordError(null);
      })
      .catch((error) => {
        // Ocorreu um erro ao enviar o email de recuperação de senha
        setResetPasswordError("Erro ao enviar email de recuperação de senha");
        setResetPasswordSuccess(null);
      });
  }

  async function loadClientes(uid) {
    function ordenar(a, b) {
      if (a.nomeCliente < b.nomeCliente) {
        return -1;
      }
      if (a.nomeCliente > b.nomeCliente) {
        return 1;
      }
      return 0;
    }
    const listRef1 = collection(db, "clientes");
    const q1 = query(listRef1, where("user", "==", uid));
    onSnapshot(q1, (snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nomeCliente: doc.data().nomeCliente,
          cep: doc.data().cep,
          endereco: doc.data().endereco,
          numero: doc.data().numero,
          bairro: doc.data().bairro,
          cidade: doc.data().cidade,
          estado: doc.data().estado,
          telefone: doc.data().telefone,
        });
      });
      lista.sort(ordenar);
      setClientes(lista);
    });
  }

  async function loadAgendamentos(uid) {
    const listRef2 = collection(db, "agendamentos");
    const q2 = query(
      listRef2,
      where("user", "==", uid),
      orderBy("date", "asc")
    );
    onSnapshot(q2, (snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          cliente: doc.data().cliente,
          nomeCliente: doc.data().nomeCliente,
          produto: doc.data().produto,
          nomeProduto: doc.data().nomeProduto,
          valorProduto: doc.data().valorProduto,
          date: doc.data().date,
          status: doc.data().status,
        });
      });
      setAgendamentos(lista);
    });
  }

  function ordenar(a, b) {
    if (a.nomeProduto < b.nomeProduto) {
      return -1;
    }
    if (a.nomeProduto > b.nomeProduto) {
      return 1;
    }
    return 0;
  }

  async function loadProdutos(uid) {
    const listRef3 = collection(db, "produtos");
    const q3 = query(listRef3, where("user", "==", uid));
    onSnapshot(q3, (snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nomeProduto: doc.data().nomeProduto,
          valorProduto: doc.data().valorProduto,
        });
      });
      lista.sort(ordenar);
      setProdutos(lista);
    });
  }

  async function signin(email, senha) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        let uid = value.user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        let data = {
          uid: uid,
          nome: docSnap.data()?.nome,
          email: value.user.email,
          avatarUrl: docSnap.data()?.avatarUrl,
        };
        setUser(data);
        storageUser(data);

        loadClientes(uid);
        loadAgendamentos(uid);
        loadProdutos(uid);

        setLoadingAuth(false);
        navigate("/home");
      })
      .catch((error) => {
        toast.error("Usuário e/ou senha incorreto(s).");
        setLoadingAuth(false);
      });
  }

  async function signup(nome, email, senha) {
    setLoadingAuth(true);
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        let uid = value.user.uid;
        await setDoc(doc(db, "users", uid), {
          nome: nome,
          avatarUrl: null,
        }).then(() => {
          toast.success("Cadastrado com sucesso!");
          let data = {
            uid: uid,
            nome: nome,
            email: value.user.email,
            avatarUrl: null,
          };
          setUser(data);
          storageUser(data);

          loadClientes(uid);
          loadAgendamentos(uid);
          loadProdutos(uid);

          setLoadingAuth(false);
          navigate("/home");
        });
      })
      .catch((error) => {
        toast.error("Não foi possível realizar o cadastro!");
        setLoadingAuth(false);
      });
  }

  function storageUser(data) {
    localStorage.setItem("@echoCrmUser", JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@echoCrmUser");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        setUser,
        clientes,
        agendamentos,
        produtos,
        loadClientes,
        loadAgendamentos,
        loadProdutos,
        signin,
        signup,
        logout,
        loadingAuth,
        loading,
        storageUser,
        handleForgotPassword,
        resetPasswordError,
        resetPasswordSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
