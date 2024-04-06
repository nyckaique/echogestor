import Header from "../../components/Header";
import Title from "../../components/Title";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Select from "react-select";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";

import { Button } from "@mui/material";
import Agendamento from "../../components/Agendamento";
import "./agendamentos.css";
import dayjs from "dayjs";

const listRef1 = collection(db, "clientes");
const listRef2 = collection(db, "produtos");
const listRef3 = collection(db, "agendamentos");

export default function Agendamentos() {
  const { user } = useContext(AuthContext);

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [estaAtualizando, setEstaAtualizando] = useState(false);
  const [index, setIndex] = useState("");
  const [date, setDate] = useState(null);
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

  useEffect(() => {
    function ordenar(a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    }
    async function loadClientesProdutos() {
      onSnapshot(listRef1, where("user", "==", user.uid), (snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            value: doc.id,
            label: doc.data().nomeCliente,
          });
        });
        lista.sort(ordenar);
        setClientes(lista);
      });
      onSnapshot(listRef2, where("user", "==", user.uid), (snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            value: doc.id,
            label: doc.data().nomeProduto,
            valorProduto: doc.data().valorProduto,
          });
        });
        //console.log(lista);
        lista.sort(ordenar);
        setProdutos(lista);
      });
    }
    loadClientesProdutos();

    async function loadAgendamentos() {
      const q = query(
        listRef3,
        where("user", "==", user.uid),
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
    loadAgendamentos();
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
  function filtrar(e) {
    setFiltro(e.target.value);

    const valor = filtro
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const filtrado = agendamentos.filter((agendamento) =>
      agendamento.nomeCliente
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(valor)
    );
    setAgendamentosFiltrados(filtrado);
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
    let cliente = clientes.find(
      (cliente) => cliente.value === agendamentos[index].cliente
    );
    let produto = produtos.find(
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

  return (
    <div>
      <Header />
      <Title name="Agendamentos">
        <CalendarMonthIcon fontSize="large" />
      </Title>
      <form className="formAgendamentos">
        <h2>Agendar serviço</h2>
        <div>
          <label>Cliente</label>
          <Select
            className="Select"
            options={clientes}
            value={selectedCliente}
            onChange={(e) => setSelectedCliente(e)}
          />
        </div>
        <div>
          <label>Produto/Serviço</label>
          <Select
            className="Select"
            options={produtos}
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
      </form>

      <div className="containerAgendamentos">
        <div>
          Buscar por nome:{" "}
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
              <th>Produto/Serviço</th>
              <th>Horário</th>
              <th>Status</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {filtro !== ""
              ? agendamentosFiltrados.map((agendamento, index) => {
                  return (
                    <Agendamento
                      key={index}
                      index={index}
                      clienteId={agendamento.cliente}
                      nomeCliente={agendamento.nomeCliente}
                      produtoId={agendamento.produto}
                      nomeProduto={agendamento.nomeProduto}
                      valorProduto={agendamento.valorProduto}
                      horario={agendamento.date}
                      status={agendamento.status}
                      editAgendamento={editAgendamento}
                      deleteAgendamento={deleteAgendamento}
                    />
                  );
                })
              : agendamentos.map((agendamento, index) => {
                  return (
                    <Agendamento
                      key={index}
                      index={index}
                      clienteId={agendamento.cliente}
                      nomeCliente={agendamento.nomeCliente}
                      produtoId={agendamento.produto}
                      nomeProduto={agendamento.nomeProduto}
                      valorProduto={agendamento.valorProduto}
                      horario={agendamento.date}
                      status={agendamento.status}
                      editAgendamento={editAgendamento}
                      deleteAgendamento={deleteAgendamento}
                    />
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
