import { useState, createContext, useEffect } from "react";
import { auth, db } from "../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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
export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

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
    loadClientes();
    loadAgendamentos();
    loadProdutos();
  }, []);

  async function loadClientes() {
    function ordenar(a, b) {
      if (a.nomeCliente < b.nomeCliente) {
        return -1;
      }
      if (a.nomeCliente > b.nomeCliente) {
        return 1;
      }
      return 0;
    }
    const listRef = collection(db, "clientes");
    onSnapshot(
      listRef,
      where("user", "==", "dPC5ptWI79cvMw5e3fam9KXp5902"),
      (snapshot) => {
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
      }
    );
  }

  async function loadAgendamentos() {
    const listRef3 = collection(db, "agendamentos");
    const q = query(
      listRef3,
      where("user", "==", "dPC5ptWI79cvMw5e3fam9KXp5902"),
      orderBy("date", "asc")
    );
    onSnapshot(q, (snapshot) => {
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
      //console.log(lista);
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

  async function loadProdutos() {
    const listRef = collection(db, "produtos");
    onSnapshot(
      listRef,
      where("user", "==", "dPC5ptWI79cvMw5e3fam9KXp5902"),
      (snapshot) => {
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
      }
    );
  }

  async function signin(email, senha) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        let uid = value.user.uid;
        console.log(uid);
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
        setLoadingAuth(false);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
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
          alert("Cadastrado com sucesso!");
          let data = {
            uid: uid,
            nome: nome,
            email: value.user.email,
            avatarUrl: null,
          };
          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          navigate("/home");
        });
      })
      .catch((error) => {
        console.log(error);
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
        signin,
        signup,
        logout,
        loadingAuth,
        loading,
        storageUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
