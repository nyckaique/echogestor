import Header from "../../components/Header";
import Title from "../../components/Title";
import StoreIcon from "@mui/icons-material/Store";
import "./produtos.css";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
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
import { toast } from "react-toastify";

export default function Produtos() {
  const { user, produtos, loadProdutos } = useContext(AuthContext);
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

  useEffect(() => {
    loadProdutos(user.uid);
  }, []);

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
              toast.success("Atualizado com sucesso!");
            })
            .catch((error) => {
              limpar();
              toast.error("Não foi possível atualizar dados");
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
              toast.success("Cadastrado novo produto com sucesso!");
            })
            .catch((error) => {
              limpar();
              toast.error("Não foi possível cadastrar o produto no momento");
            });
        }
      }
    } else {
      toast.warning("Preencha todos os campos!");
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
          toast.success("Deletado com sucesso!");
        })
        .catch((error) => {
          toast.error("Não foi possível deletar!");
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
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  return (
    <div>
      <Header />
      <Title name="Produtos">
        <StoreIcon fontSize="large" />
      </Title>
      <div className="tab-container">
        <div className="block-tabs">
          <div
            className={toggleState === 1 ? "active-tabs tab" : "tabs tab"}
            onClick={() => toggleTab(1)}
          >
            Cadastro de Produtos
          </div>
          <div
            className={toggleState === 2 ? "active-tabs tab" : "tabs tab"}
            onClick={() => toggleTab(2)}
          >
            Meus Produtos
          </div>
        </div>
        <div className="content-tabs">
          <div className={toggleState === 1 ? "active-content" : "content"}>
            <form className="formProduto">
              <h2 style={{ textAlign: "center" }}>
                Cadastro do Produto/Serviço
              </h2>
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
                <Button
                  variant="contained"
                  onClick={formSubmit}
                  style={{ backgroundColor: "#52648b" }}
                >
                  {estaAtualizando ? "Atualizar Produto" : "Novo Produto"}
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
        </div>
      </div>
    </div>
  );
}
