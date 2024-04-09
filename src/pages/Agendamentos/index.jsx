import Header from "../../components/Header";
import Title from "../../components/Title";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Select from "react-select";
import { useEffect, useState, useRef } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Button } from "@mui/material";
import AgendamentosTable from "../../components/AgendamentosTable";
import "./agendamentos.css";
import dayjs from "dayjs";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Agendamentos() {
  const { user, clientes, agendamentos, produtos } = useContext(AuthContext);
  const statusOptions = [
    {
      value: true,
      label: "Concluído",
    },
    {
      value: false,
      label: "Aguardando pagamento",
    },
  ];
  const filtroStatusOptions = [
    {
      value: null,
      label: "Todos",
    },
    {
      value: true,
      label: "Concluído",
    },
    {
      value: false,
      label: "Aguardando pagamento",
    },
  ];
  const [clientesLista, setClientesLista] = useState([]);
  const [produtosLista, setProdutosLista] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedFiltroStatus, setSelectedFiltroStatus] = useState(
    filtroStatusOptions[0]
  );
  const [estaAtualizando, setEstaAtualizando] = useState(false);
  const [index, setIndex] = useState("");
  const [date, setDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const select = useRef(null);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleAccordionClick = () => {
    setAccordionOpen(!accordionOpen);
  };

  const handleButtonClick = () => {
    setAccordionOpen(true);
  };

  useEffect(() => {
    let listaClientes = [];
    clientes.forEach((cliente) => {
      listaClientes.push({
        value: cliente.id,
        label: cliente.nomeCliente,
      });
    });
    setClientesLista(listaClientes);

    let listaProdutos = [];
    produtos.forEach((produto) => {
      listaProdutos.push({
        value: produto.id,
        label: produto.nomeProduto,
        valorProduto: produto.valorProduto,
      });
    });
    setProdutosLista(listaProdutos);
  }, []);

  async function formSubmit() {
    if (selectedCliente !== null && selectedProduto !== null && date !== null) {
      //console.log(date);
      let novadata = new Date(date);
      novadata = novadata.getTime();
      //console.log(novadata);
      if (estaAtualizando) {
        const docRef = doc(db, "agendamentos", agendamentos[index].id);
        await updateDoc(docRef, {
          cliente: selectedCliente.value,
          nomeCliente: selectedCliente.label,
          produto: selectedProduto.value,
          nomeProduto: selectedProduto.label,
          valorProduto: selectedProduto.valorProduto,
          date: novadata,
          status: selectedStatus.value,
        })
          .then(() => {
            limpar();
            alert("Atualizado com sucesso");
          })
          .catch((error) => {
            limpar();
            alert("Não foi possível atualizar no momento");
            console.log(error);
          });
      } else {
        await addDoc(collection(db, "agendamentos"), {
          cliente: selectedCliente.value,
          nomeCliente: selectedCliente.label,
          produto: selectedProduto.value,
          nomeProduto: selectedProduto.label,
          valorProduto: selectedProduto.valorProduto,
          date: novadata,
          status: false,
          user: user.uid,
        })
          .then(() => {
            limpar();
            alert("Agendado com sucesso");
          })
          .catch((error) => {
            limpar();
            alert("Não foi possível agendar no momento");
            console.log(error);
          });
      }
    } else {
      alert("Preencha todos os campos!");
    }
  }
  function limpar() {
    setSelectedCliente(null);
    setSelectedProduto(null);
    setEstaAtualizando(false);
    setDate(null);
  }

  function handleFiltro(e) {
    const valor = e.target.value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    setFiltro(valor);
  }
  async function deleteAgendamento(index) {
    let date = new Date(agendamentos[index].date);
    date =
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " " +
      date.toLocaleDateString();
    // eslint-disable-next-line no-restricted-globals
    const vaiDeletar = confirm(
      `Confirma cancelar o agendamento de ${agendamentos[index].nomeCliente} - ${agendamentos[index].nomeProduto} às ${date} ?`
    );
    if (vaiDeletar) {
      const docRef = doc(db, "agendamentos", agendamentos[index].id);
      await deleteDoc(docRef)
        .then(() => {
          alert("Cancelado com sucesso!");
        })
        .catch((error) => {
          alert("Não foi possível cancelar!");
        });
    }
  }
  function editAgendamento(index) {
    setEstaAtualizando(true);
    setIndex(index);
    handleButtonClick();
    select.current.focus();
    let cliente = clientesLista.find(
      (cliente) => cliente.value === agendamentos[index].cliente
    );
    let produto = produtosLista.find(
      (produto) => produto.value === agendamentos[index].produto
    );
    let date = dayjs(new Date(agendamentos[index].date));
    console.log(agendamentos[index]);
    console.log(date);
    console.log(cliente);
    console.log(produto);
    setSelectedCliente(cliente);
    setSelectedProduto(produto);
    setSelectedStatus(
      agendamentos[index].status ? statusOptions[0] : statusOptions[1]
    );
    setDate(date);
  }
  function limpaFiltros() {
    setFiltro("");
    setSelectedFiltroStatus(filtroStatusOptions[0]);
    setDateRange([null, null]);
  }

  return (
    <div>
      <Header />
      <Title name="Agendamentos">
        <CalendarMonthIcon fontSize="large" />
      </Title>

      <div className="formContent">
        <form className="formAgendamentos">
          <Accordion expanded={accordionOpen} onChange={handleAccordionClick}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <h2>Agendar serviço</h2>
            </AccordionSummary>
            <AccordionDetails className="formAgendamentos">
              <div>
                <label>Cliente</label>
                <Select
                  className="Select"
                  ref={select}
                  options={clientesLista}
                  value={selectedCliente}
                  onChange={(e) => setSelectedCliente(e)}
                />
              </div>
              <div>
                <label>Produto/Serviço</label>
                <Select
                  className="Select"
                  options={produtosLista}
                  value={selectedProduto}
                  onChange={(e) => setSelectedProduto(e)}
                />
              </div>
              <div>
                <label>Data e horário</label>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                >
                  <DateTimePicker
                    className="Select"
                    onChange={(e) => {
                      setDate(e);
                      console.log(e);
                    }}
                    value={date}
                    inputFormat="dd.MM.yyyy"
                  />
                </LocalizationProvider>
              </div>
              {estaAtualizando ? (
                <div>
                  <label>Status</label>
                  <Select
                    className="Select"
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e)}
                  />
                </div>
              ) : (
                <></>
              )}
              <div className="divBtn">
                <Button variant="contained" onClick={formSubmit}>
                  {estaAtualizando ? "Atualizar" : "Confirmar"}
                </Button>
                <Button variant="contained" onClick={limpar}>
                  Limpar
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>
        </form>

        <form className="formFiltros">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <h2>Filtros</h2>
            </AccordionSummary>
            <AccordionDetails className="formFiltros">
              <div>
                <label>Nome:</label>
                <input
                  type="text"
                  onChange={handleFiltro}
                  value={filtro}
                  className="inputText"
                />
              </div>

              <div>
                <label>Data:</label>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                >
                  <DatePicker
                    label="Início"
                    value={dateRange[0]}
                    onChange={(e) => setDateRange([e, dateRange[1]])}
                    //defaultValue={dayjs(new Date())}
                  />
                  <DatePicker
                    label="Fim"
                    value={dateRange[1]}
                    onChange={(e) => setDateRange([dateRange[0], e])}
                    //defaultValue={dayjs(new Date())}
                  />
                </LocalizationProvider>
              </div>
              <div>
                <label>Status:</label>
                <Select
                  className="Select"
                  options={filtroStatusOptions}
                  value={selectedFiltroStatus}
                  onChange={(e) => setSelectedFiltroStatus(e)}
                />
              </div>
              <Button
                variant="contained"
                onClick={limpaFiltros}
                style={{ width: "fit-content", margin: "auto" }}
              >
                Limpar filtros
              </Button>
            </AccordionDetails>
          </Accordion>
        </form>
      </div>

      <AgendamentosTable
        filtro={filtro}
        filtroStatus={selectedFiltroStatus}
        dateRange={dateRange}
        editAgendamento={editAgendamento}
        deleteAgendamento={deleteAgendamento}
      />
    </div>
  );
}
