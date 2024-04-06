import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import PersonIcon from "@mui/icons-material/Person";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { useParams } from "react-router-dom";
import "./cliente.css";

export default function Cliente() {
  const [cliente, setCliente] = useState({});
  const [agendamentos, setAgendamentos] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    async function loadCliente() {
      let docRef = doc(db, "clientes", id);

      await getDoc(docRef).then((doc) => {
        setCliente({
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
    }
    async function loadAgendamentos() {
      let listRef = collection(db, "agendamentos");
      const q = query(
        listRef,
        where("cliente", "==", id),
        orderBy("date", "asc")
      );
      await getDocs(q).then((docs) => {
        let lista = [];
        docs.forEach((doc) => {
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

    loadCliente();
    loadAgendamentos();
  }, []);
  return (
    <div>
      <Header />
      <Title name={cliente.nomeCliente}>
        <PersonIcon fontSize="large" />
      </Title>
      <div className="clienteInfo">
        <p>
          <b>Nome:</b> {cliente.nomeCliente}
        </p>
        <p>
          <b>Telefone:</b> {cliente.telefone}
        </p>
        <p>
          <b>Endereço:</b> {cliente.endereco}, {cliente.numero},{" "}
          {cliente.bairro}, {cliente.cidade} - {cliente.estado}
        </p>
        <p>
          <b>CEP: </b> {cliente.cep}
        </p>
      </div>

      <div className="tableHistorico">
        <h2>Histórico</h2>
        <table>
          <thead>
            <tr>
              <th>Produto/Serviço</th>
              <th>Horário</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((agendamento, index) => {
              let date = new Date(agendamento.date);

              return (
                <tr key={index}>
                  <td>
                    {agendamento.nomeProduto} -{" "}
                    {agendamento.valorProduto.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="tdCenter">
                    {" "}
                    {date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {"h "}
                    {date.toLocaleDateString()}
                  </td>
                  <td className="tdCenter">
                    {agendamento.status ? "Concluído" : "Aguardando pagamento"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
