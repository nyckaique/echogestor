import { useState, useContext, useEffect } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import "./clientes.css";
import GroupsIcon from "@mui/icons-material/Groups";
import { Button } from "@mui/material";

import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { AuthContext } from "../../contexts/auth";
import Cliente from "../../components/Cliente";
import { useNavigate } from "react-router-dom";
const listRef = collection(db, "clientes");

export default function Clientes() {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [clientes, setClientes] = useState([]);
  const [estaAtualizando, setEstaAtualizando] = useState(false);
  const [index, setIndex] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  function editCliente(index) {
    setEstaAtualizando(true);
    setIndex(index);
    setNome(clientes[index].nomeCliente);
    setEndereco(clientes[index].endereco);
    setTelefone(clientes[index].telefone);
  }
  async function deleteCliente(index) {
    const docRef = doc(db, "clientes", clientes[index].id);
    await deleteDoc(docRef)
      .then(() => {
        alert("Deletado com sucesso!");

        navigate(0);
      })
      .catch((error) => {
        alert("Não foi possível deletar!");
        navigate(0);
      });
  }

  useEffect(() => {
    function ordenar(a, b) {
      if (a.nomeCliente < b.nomeCliente) {
        return -1;
      }
      if (a.nomeCliente > b.nomeCliente) {
        return 1;
      }
      return 0;
    }
    async function loadClientes() {
      const querySnapshot = await getDocs(
        listRef,
        where("user", "==", user.uid)
      )
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeCliente: doc.data().nomeCliente,
              telefone: doc.data().telefone,
              endereco: doc.data().endereco,
            });
          });

          lista.sort(ordenar);

          if (snapshot.docs.size === 0) {
            alert("Não tem clientes cadastrados");
            return;
          }
          setClientes(lista);
        })
        .catch((error) => {
          alert("Não foi possível buscar clientes");
          console.log(error);
        });
    }
    loadClientes();
  }, []);

  async function formSubmit() {
    if (estaAtualizando) {
      if (nome !== "" && endereco !== "" && telefone !== "") {
        let novoNome = nome.charAt(0).toUpperCase() + nome.slice(1);
        let novoEndereco = endereco.charAt(0).toUpperCase() + endereco.slice(1);
        const docRef = doc(db, "clientes", clientes[index].id);
        await updateDoc(docRef, {
          nomeCliente: novoNome,
          endereco: novoEndereco,
          telefone: telefone,
        })
          .then(() => {
            alert("Atualizado com sucesso!");
            setIndex("");
            setEstaAtualizando(false);
            setNome("");
            setEndereco("");
            setTelefone("");
            navigate(0);
          })
          .catch((error) => {
            alert("Não foi possível atualizar dados");
            setIndex("");
            setEstaAtualizando(false);
            setNome("");
            setEndereco("");
            setTelefone("");
            navigate(0);
          });
      } else {
        alert("Preencha todos os campos!");
      }
    } else {
      if (nome !== "" && endereco !== "" && telefone !== "") {
        let novoNome = nome.charAt(0).toUpperCase() + nome.slice(1);
        let novoEndereco = endereco.charAt(0).toUpperCase() + endereco.slice(1);
        await addDoc(collection(db, "clientes"), {
          nomeCliente: novoNome,
          endereco: novoEndereco,
          telefone: telefone,
          user: user.uid,
        })
          .then(() => {
            setNome("");
            setEndereco("");
            setTelefone("");
            alert("Cadastrado novo cliente com sucesso!");
          })
          .catch((error) => {
            alert("Não foi possível realizar o cadastro no momento");
            console.log(error);
          });
      } else {
        alert("Preencha todos os campos!");
      }
    }
  }

  return (
    <div>
      <Header />
      <Title name="Clientes">
        <GroupsIcon fontSize="large" />
      </Title>

      <form className="formCliente">
        <div>
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            placeholder="Nome Sobrenome"
            onChange={(e) => {
              setNome(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Endereço</label>
          <input
            type="text"
            value={endereco}
            placeholder="Rua 1, nº1, Cidade"
            onChange={(e) => {
              setEndereco(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Telefone</label>
          <input
            type="text"
            value={telefone}
            placeholder="(99)99999-9999"
            onChange={(e) => {
              setTelefone(e.target.value);
            }}
          />
        </div>
        <Button variant="contained" onClick={formSubmit}>
          {estaAtualizando ? "Atualizar Dados" : "Novo Cliente"}
        </Button>
      </form>
      <div className="containerCliente">
        {clientes.map((cliente, index) => {
          return (
            <div>
              <Cliente
                index={index}
                nome={cliente.nomeCliente}
                endereco={cliente.endereco}
                telefone={cliente.telefone}
                editCliente={editCliente}
                deleteCliente={deleteCliente}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
