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
  updateDoc,
  deleteDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";

import { AuthContext } from "../../contexts/auth";
import apiCEP from "../../services/cep";
import SearchIcon from "@mui/icons-material/Search";
import ClientesTable from "../../components/ClientesTable";
import { toast } from "react-toastify";

export default function Clientes() {
  const { user, clientes, loadClientes } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [telefone, setTelefone] = useState("");
  const [estaAtualizando, setEstaAtualizando] = useState(false);
  const [index, setIndex] = useState("");
  const [inputCEP, setInputCEP] = useState("");
  const [filtro, setFiltro] = useState("");
  const [errorCEP, setErrorCEP] = useState("");
  const [errorNumero, setErrorNumero] = useState("");
  const [errorTelefone, setErrorTelefone] = useState("");

  useEffect(() => {
    loadClientes(user.uid);
  }, []);

  function handleFiltro(e) {
    const valor = e.target.value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    setFiltro(valor);
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
      //deleta os agendamentos daquele cliente
      let docs = await getDocs(
        query(
          collection(db, "agendamentos"),
          where("cliente", "==", clientes[index].id)
        )
      );
      docs.forEach((document) => {
        deleteDoc(document.ref);
      });
      //delete aquele cliente
      const docRef = doc(db, "clientes", clientes[index].id);
      await deleteDoc(docRef)
        .then(() => {
          toast.success("Deletado com sucesso!");
        })
        .catch((error) => {
          toast.error("Não foi possível deletar!");
        });
    }
  }

  async function getCEP(e) {
    e.preventDefault();
    if (inputCEP === "") {
      toast.warning("Por favor, preencha o CEP!");
      return;
    }

    try {
      const response = await apiCEP.get(`${inputCEP}/json`);
      setBairro(response.data.bairro);
      setCidade(response.data.localidade);
      setEstado(response.data.uf);
      setEndereco(response.data.logradouro);
    } catch {
      toast.error("Deu um erro na busca!");
      setInputCEP("");
    }
  }

  const handleCEP = (event) => {
    const newCep = event.target.value;
    setInputCEP(newCep);
    // Verifica se o CEP é válido
    if (!isValidCep(newCep)) {
      setErrorCEP("Insira um CEP válido");
    } else {
      setErrorCEP("");
    }
  };
  const isValidCep = (cep) => {
    // Expressão regular para validar o CEP
    const regex = /^[0-9]{5}-?[0-9]{3}$/;
    return regex.test(cep);
  };

  const handleNumero = (event) => {
    const valor = event.target.value;
    setNumero(valor);
    if (!isValidNumber(valor)) {
      setErrorNumero("Insira apenas números");
    } else {
      setErrorNumero("");
    }
  };
  const isValidNumber = (Number) => {
    const regex = /^[0-9]+$/;
    return regex.test(Number);
  };

  const handlePhone = (event) => {
    const valor = event.target.value;
    const formattedValue = formatPhoneNumber(valor);
    setTelefone(formattedValue);
    // Verifica se o número de telefone é válido
    if (!isValidPhoneNumber(valor)) {
      setErrorTelefone("Insira um telefone válido");
    } else {
      setErrorTelefone("");
    }
  };
  const formatPhoneNumber = (value) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, "");
    // Formata o número de telefone (XX)99999-9999
    const formattedValue = numericValue.replace(
      /(\d{2})(\d{5})(\d{4})/,
      "($1)$2-$3"
    );
    return formattedValue;
  };
  const isValidPhoneNumber = (phoneNumber) => {
    // Verifica se o número de telefone tem 11 dígitos
    return phoneNumber.replace(/\D/g, "").length === 11;
  };

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
      setErrorNumero("");
      setErrorCEP("");
      setErrorTelefone("");
      if (!isValidNumber(inputCEP)) {
        setErrorCEP("Insira um CEP válido");
      } else if (!isValidNumber(numero)) {
        setErrorNumero("Insira apenas números");
      } else if (!isValidPhoneNumber(telefone)) {
        setErrorTelefone("Insira um telefone válido");
      } else {
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
              toast.success("Atualizado com sucesso!");
              limpar();
            })
            .catch((error) => {
              toast.error("Não foi possível atualizar dados");
              limpar();
            });
        } else {
          let novoNome = nome.charAt(0).toUpperCase() + nome.slice(1);
          let novoEndereco =
            endereco.charAt(0).toUpperCase() + endereco.slice(1);
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
              toast.success("Cadastrado novo cliente com sucesso!");
              limpar();
            })
            .catch((error) => {
              toast.error("Não foi possível realizar o cadastro no momento");
              limpar();
            });
        }
      }
    } else {
      toast.warning("Preencha todos os campos!");
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
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div>
      <Header />
      <Title name="Clientes">
        <GroupsIcon fontSize="large" />
      </Title>

      <div className="tab-container">
        <div className="block-tabs">
          <div
            className={toggleState === 1 ? "active-tabs tab" : "tabs tab"}
            onClick={() => toggleTab(1)}
          >
            Cadastro de Clientes
          </div>
          <div
            className={toggleState === 2 ? "active-tabs tab" : "tabs tab"}
            onClick={() => toggleTab(2)}
          >
            Meus Clientes
          </div>
        </div>
        <div className="content-tabs">
          <div className={toggleState === 1 ? "active-content" : "content"}>
            <h2 className="tdCenter">Cadastro de Clientes</h2>
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
                <button onClick={getCEP} className="btn">
                  <SearchIcon fontSize="small" />
                </button>
                <input
                  className="inputText"
                  type="text"
                  value={inputCEP}
                  placeholder="75500123"
                  onChange={handleCEP}
                />
              </div>
              {errorCEP && <p>{errorCEP}</p>}
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
                  onChange={handleNumero}
                />{" "}
              </div>
              {errorNumero && <p>{errorNumero}</p>}
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
                  onChange={handlePhone}
                />
              </div>
              {errorTelefone && <p>{errorTelefone}</p>}
              <div>
                <Button
                  variant="contained"
                  onClick={formSubmit}
                  style={{ backgroundColor: "#52648b" }}
                >
                  {estaAtualizando ? "Atualizar Dados" : "Novo Cliente"}
                </Button>
                <Button
                  variant="contained"
                  onClick={limpar}
                  style={{ backgroundColor: "#52648b" }}
                >
                  Limpar
                </Button>
              </div>
            </form>
          </div>
          <div className={toggleState === 2 ? "active-content" : "content"}>
            <div className="divBusca">
              <div>
                <h2 style={{ textAlign: "center" }}>Meus Clientes</h2>
                Buscar:{" "}
                <input
                  type="text"
                  onChange={handleFiltro}
                  value={filtro}
                  className="inputText"
                />
              </div>
            </div>

            <ClientesTable
              filtro={filtro}
              editCliente={editCliente}
              deleteCliente={deleteCliente}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
