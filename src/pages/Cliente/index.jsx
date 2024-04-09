import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import PersonIcon from "@mui/icons-material/Person";
import { useParams } from "react-router-dom";
import "./cliente.css";
import { AuthContext } from "../../contexts/auth";

export default function Cliente() {
  const { id } = useParams();
  const { clientes, agendamentos } = useContext(AuthContext);
  const [cliente, setCliente] = useState({});

  useEffect(() => {
    let clienteSelecionado = clientes.find((cliente) => cliente.id === id);
    setCliente(clienteSelecionado);
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
              if (agendamento.cliente === id) {
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
                      {agendamento.status
                        ? "Concluído"
                        : "Aguardando pagamento"}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
