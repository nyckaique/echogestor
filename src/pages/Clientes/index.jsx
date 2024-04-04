/* eslint-disable no-restricted-globals */
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
  doc,
  where,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import { AuthContext } from "../../contexts/auth";
import Cliente from "../../components/Cliente";
import apiCEP from "../../services/cep";
import SearchIcon from "@mui/icons-material/Search";

const listRef = collection(db, "clientes");

export default function Clientes() {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [telefone, setTelefone] = useState("");
  const [clientes, setClientes] = useState([]);
  const [estaAtualizando, setEstaAtualizando] = useState(false);
  const [index, setIndex] = useState("");
  const [inputCEP, setInputCEP] = useState("");
  const [cep, setCEP] = useState({});
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const { user } = useContext(AuthContext);

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
      onSnapshot(listRef, where("user", "==", user.uid), (snapshot) => {
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
    loadClientes();
  }, []);

  function filtrar(e) {
    setFiltro(e.target.value);

    const valor = filtro
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const filtrado = clientes.filter((cliente) =>
      cliente.nomeCliente
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(valor)
    );
    setClientesFiltrados(filtrado);
  }

  function editCliente(index) {
    setEstaAtualizando(true);
    setIndex(index);
    setNome(clientes[index].nomeCliente);
    setInputCEP(clientes[index].cep);
    setEndereco(clientes[index].endereco);
    setNumero(clientes[index].numero);
    setBairro(clientes[index].bairro);
    setCidade(clientes[index].cidade);
    setEstado(clientes[index].estado);
    setTelefone(clientes[index].telefone);
  }

  async function deleteCliente(index) {
    const vaiDeletar = confirm(
      `Confirma deletar o cliente ${clientes[index].nomeCliente}?`
    );
    if (vaiDeletar) {
      const docRef = doc(db, "clientes", clientes[index].id);
      await deleteDoc(docRef)
        .then(() => {
          alert("Deletado com sucesso!");
        })
        .catch((error) => {
          alert("Não foi possível deletar!");
        });
    }
  }

  async function getCEP(e) {
    e.preventDefault();
    if (inputCEP === "") {
      alert("Por favor, preencha o CEP!");
      return;
    }

    try {
      const response = await apiCEP.get(`${inputCEP}/json`);
      setCEP(response.data);
      console.log(response.data);
      setBairro(response.data.bairro);
      setCidade(response.data.localidade);
      setEstado(response.data.uf);
      setEndereco(response.data.logradouro);
    } catch {
      alert("Deu um erro na busca!");
      setInputCEP("");
    }
  }

  async function formSubmit() {
    if (
      nome !== "" &&
      inputCEP !== "" &&
      endereco !== "" &&
      numero !== "" &&
      bairro !== "" &&
      cidade !== "" &&
      estado !== "" &&
      telefone !== ""
    ) {
      if (estaAtualizando) {
        let novoNome =
          nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
        let novoEndereco =
          endereco.charAt(0).toUpperCase() + endereco.slice(1).toLowerCase();
        let novaCidade =
          cidade.charAt(0).toUpperCase() + cidade.slice(1).toLowerCase();
        const docRef = doc(db, "clientes", clientes[index].id);
        await updateDoc(docRef, {
          nomeCliente: novoNome,
          cep: inputCEP,
          endereco: novoEndereco,
          numero: numero,
          bairro: bairro,
          cidade: novaCidade,
          estado: estado,
          telefone: telefone,
        })
          .then(() => {
            alert("Atualizado com sucesso!");
            setIndex("");
            setEstaAtualizando(false);
            setNome("");
            setInputCEP("");
            setEndereco("");
            setNumero("");
            setBairro("");
            setCidade("");
            setEstado("");
            setTelefone("");
          })
          .catch((error) => {
            alert("Não foi possível atualizar dados");
            setIndex("");
            setEstaAtualizando(false);
            setNome("");
            setInputCEP("");
            setEndereco("");
            setNumero("");
            setBairro("");
            setCidade("");
            setEstado("");
            setTelefone("");
          });
      } else {
        let novoNome = nome.charAt(0).toUpperCase() + nome.slice(1);
        let novoEndereco = endereco.charAt(0).toUpperCase() + endereco.slice(1);
        let novaCidade = cidade.charAt(0).toUpperCase() + cidade.slice(1);
        await addDoc(collection(db, "clientes"), {
          nomeCliente: novoNome,
          cep: inputCEP,
          endereco: novoEndereco,
          numero: numero,
          bairro: bairro,
          cidade: novaCidade,
          estado: estado,
          telefone: telefone,
          user: user.uid,
        })
          .then(() => {
            setNome("");
            setInputCEP("");
            setEndereco("");
            setNumero("");
            setBairro("");
            setCidade("");
            setEstado("");
            setTelefone("");
            alert("Cadastrado novo cliente com sucesso!");
          })
          .catch((error) => {
            alert("Não foi possível realizar o cadastro no momento");
            console.log(error);
          });
      }
    } else {
      alert("Preencha todos os campos!");
    }
  }
  function limpar() {
    setEstaAtualizando(false);
    setIndex("");
    setNome("");
    setInputCEP("");
    setEndereco("");
    setNumero("");
    setBairro("");
    setCidade("");
    setEstado("");
    setTelefone("");
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
            className="inputText"
            type="text"
            value={nome}
            placeholder="Nome Sobrenome"
            onChange={(e) => {
              setNome(e.target.value);
            }}
          />
        </div>
        <div>
          <label>CEP</label>
          <input
            className="inputText"
            type="text"
            value={inputCEP}
            placeholder="75500123"
            onChange={(e) => {
              setInputCEP(e.target.value);
            }}
          />
          <button onClick={getCEP} className="btn">
            <SearchIcon fontSize="small" />
          </button>
        </div>
        <div>
          <label>Endereço</label>
          <input
            className="inputText"
            type="text"
            value={endereco}
            placeholder="Rua 1, nº1, Cidade"
            onChange={(e) => {
              setEndereco(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Número</label>
          <input
            className="inputText"
            type="text"
            value={numero}
            placeholder="123"
            onChange={(e) => {
              setNumero(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Bairro</label>
          <input
            className="inputText"
            type="text"
            value={bairro}
            placeholder="bairro"
            onChange={(e) => {
              setBairro(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Cidade</label>
          <input
            className="inputText"
            type="text"
            value={cidade}
            placeholder="cidade"
            onChange={(e) => {
              setCidade(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Estado</label>
          <input
            className="inputText"
            type="text"
            value={estado}
            placeholder="GO"
            onChange={(e) => {
              setEstado(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Telefone</label>
          <input
            className="inputText"
            type="text"
            value={telefone}
            placeholder="(99)99999-9999"
            onChange={(e) => {
              setTelefone(e.target.value);
            }}
          />
        </div>
        <div>
          <Button variant="contained" onClick={formSubmit}>
            {estaAtualizando ? "Atualizar Dados" : "Novo Cliente"}
          </Button>
          <Button variant="contained" onClick={limpar}>
            Limpar
          </Button>
        </div>
      </form>

      <div className="containerCliente">
        <div>
          Buscar:{" "}
          <input
            type="text"
            onChange={filtrar}
            value={filtro}
            className="inputText"
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {filtro !== ""
              ? clientesFiltrados.map((cliente, index) => {
                  return (
                    <Cliente
                      key={index}
                      index={index}
                      nome={cliente.nomeCliente}
                      cidade={cliente.cidade}
                      estado={cliente.estado}
                      telefone={cliente.telefone}
                      editCliente={editCliente}
                      deleteCliente={deleteCliente}
                    />
                  );
                })
              : clientes.map((cliente, index) => {
                  return (
                    <Cliente
                      key={index}
                      index={index}
                      nome={cliente.nomeCliente}
                      cidade={cliente.cidade}
                      estado={cliente.estado}
                      telefone={cliente.telefone}
                      editCliente={editCliente}
                      deleteCliente={deleteCliente}
                    />
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
