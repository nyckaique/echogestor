import Header from "../../components/Header";
import Title from "../../components/Title";
import StoreIcon from "@mui/icons-material/Store";
import "./produtos.css";
import { Button } from "@mui/material";
import { useState } from "react";
import {
  updateDoc,
  collection,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

import ProdutosTable from "../../components/ProdutosTable";

export default function Produtos() {
  const { user, produtos } = useContext(AuthContext);
  const [estaAtualizando, setEstaAtualizando] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [valorProduto, setValorProduto] = useState("");
  const [index, setIndex] = useState("");
  const [filtro, setFiltro] = useState("");
  const [errorValor, setErrorValor] = useState("");

  const handleNumero = (event) => {
    const valor = event.target.value.replace(/[^0-9,.]/g, "");
    setValorProduto(valor);
    if (!isValidNumber(valor)) {
      setErrorValor("Insira apenas números");
    } else {
      setErrorValor("");
    }
  };
  const isValidNumber = (number) => {
    number = parseFloat(number);
    const regex = /^[0-9]+$/;
    return regex.test(number);
  };

  async function formSubmit() {
    if (nomeProduto !== "" && valorProduto !== "") {
      setErrorValor("");
      if (!isValidNumber(valorProduto)) {
        setErrorValor("Insira apenas números");
      } else {
        if (estaAtualizando) {
          let novoNomeProduto =
            nomeProduto.charAt(0).toUpperCase() +
            nomeProduto.slice(1).toLowerCase();
          const docRef = doc(db, "produtos", produtos[index].id);
          await updateDoc(docRef, {
            nomeProduto: novoNomeProduto,
            valorProduto: Number(valorProduto.replace(",", ".")),
          })
            .then(() => {
              limpar();
              alert("Atualizado com sucesso!");
            })
            .catch((error) => {
              limpar();
              alert("Não foi possível atualizar dados");
            });
        } else {
          let novoNomeProduto =
            nomeProduto.charAt(0).toUpperCase() +
            nomeProduto.slice(1).toLowerCase();
          await addDoc(collection(db, "produtos"), {
            nomeProduto: novoNomeProduto,
            valorProduto: Number(valorProduto.replace(",", ".")),
            user: user.uid,
          })
            .then(() => {
              limpar();
              alert("Cadastrado novo produto com sucesso!");
            })
            .catch((error) => {
              limpar();
              alert("Não foi possível cadastrar o produto no momento");
            });
        }
      }
    } else {
      alert("Preencha todos os campos!");
    }
  }

  function limpar() {
    setNomeProduto("");
    setValorProduto("");
    setIndex("");
    setEstaAtualizando(false);
  }

  function editProduto(index) {
    setEstaAtualizando(true);
    setIndex(index);
    setNomeProduto(produtos[index].nomeProduto);
    setValorProduto(produtos[index].valorProduto);
  }

  async function deleteProduto(index) {
    // eslint-disable-next-line no-restricted-globals
    const vaiDeletar = confirm(
      `Confirma deletar o produto ${produtos[index].nomeProduto}?`
    );
    if (vaiDeletar) {
      const docRef = doc(db, "produtos", produtos[index].id);
      await deleteDoc(docRef)
        .then(() => {
          alert("Deletado com sucesso!");
        })
        .catch((error) => {
          alert("Não foi possível deletar!");
        });
    }
  }

  function handleFiltro(e) {
    const valor = e.target.value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    setFiltro(valor);
  }

  return (
    <div>
      <Header />
      <Title name="Produtos">
        <StoreIcon fontSize="large" />
      </Title>
      <form className="formProduto">
        <h2>Cadastro do Produto/Serviço</h2>
        <div>
          <label>Nome</label>
          <input
            type="text"
            className="inputText"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
          />
        </div>
        <div>
          <label>Valor</label>
          <input
            type="text"
            className="inputText"
            value={`R$ ${valorProduto}`}
            onChange={handleNumero}
          />
        </div>
        {errorValor && <p>{errorValor}</p>}
        <div>
          <Button variant="contained" onClick={formSubmit}>
            {estaAtualizando ? "Atualizar Produto" : "Novo Produto"}
          </Button>
          <Button variant="contained" onClick={limpar}>
            Limpar
          </Button>
        </div>
      </form>

      <div className="divBusca">
        <h2>Produtos/Serviços</h2>
        <div>
          Buscar:{" "}
          <input
            type="text"
            onChange={handleFiltro}
            value={filtro}
            className="inputText"
          />
        </div>
      </div>

      <ProdutosTable
        filtro={filtro}
        editProduto={editProduto}
        deleteProduto={deleteProduto}
      />
    </div>
  );
}
