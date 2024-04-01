import { useState, createContext, useEffect } from "react";
import { auth, db } from "../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext({});

function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
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
  }, []);

  async function signin(email: string, senha: string) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        let uid = value.user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        let data: any = {
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

  async function signup(nome: string, email: string, senha: string) {
    setLoadingAuth(true);
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        let uid = value.user.uid;
        await setDoc(doc(db, "users", uid), {
          nome: nome,
          avatarUrl: null,
        }).then(() => {
          alert("Cadastrado com sucesso!");
          let data: any = {
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

  function storageUser(data: any) {
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
