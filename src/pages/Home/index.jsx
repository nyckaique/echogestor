import { AuthContext } from "../../contexts/auth";
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import HomeIcon from "@mui/icons-material/Home";
import BemVindo from "../../components/BemVindo";
import "./home.css";

export default function Home() {
  const { agendamentos } = useContext(AuthContext);
  const [qtdAgendamentos, setQtdAgendamentos] = useState(0);
  const [agendamentosHoje, setAgendamentosHoje] = useState([]);
  const [faturamento, setFaturamento] = useState(0);

  useEffect(() => {
    function filtroAgendamentosHoje() {
      let hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      hoje = hoje.getTime();

      let a = agendamentos.filter((agendamento) => {
        let dateInicio = hoje;
        let dateFim = hoje + 86400000;
        if (agendamento.date >= dateInicio && agendamento.date <= dateFim) {
          return agendamento;
        }
      });
      let b = 0;
      a.map((item) => {
        if (item.status) {
          b = b + Number(item.valorProduto);
        }
      });

      setFaturamento(b);
      setAgendamentosHoje(a);
      setQtdAgendamentos(a.length);
    }
    filtroAgendamentosHoje();
  }, []);

  return (
    <div>
      <Header />
      <Title name="Home">
        <HomeIcon fontSize="large" />
      </Title>
      <BemVindo />
      <div className="cardContent">
        <div className="agendaCard">
          <p>Hoje você tem</p>
          <span>{qtdAgendamentos}</span>
          <p>agendamentos</p>
        </div>
        <div className="agendaCard">
          <p>Seu faturamento hoje</p>
          <span>
            {faturamento.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>
      <h2 style={{ width: "100%", textAlign: "center" }}>
        Agendamentos do dia
      </h2>
      <div className="agendaTable">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Produto / Serviço</th>
              <th>Horário</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {agendamentosHoje.map((agendamento, index) => {
              let date = new Date(agendamento.date);

              return (
                <tr key={index}>
                  <td>{agendamento.nomeCliente}</td>
                  <td>
                    {agendamento.nomeProduto}
                    {": "}
                    <b>
                      {agendamento.valorProduto.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </b>
                  </td>
                  <td>
                    {date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {"h "}
                    {date.toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {agendamento.status ? (
                      <p
                        style={{
                          backgroundColor: "#5cb85c",
                          borderRadius: "0.5em",
                          padding: "0.25em",
                        }}
                      >
                        Concluído
                      </p>
                    ) : (
                      <p
                        style={{
                          backgroundColor: "#d9534f",
                          borderRadius: "0.5em",
                          padding: "0.25em",
                        }}
                      >
                        Aguardando pagamento
                      </p>
                    )}
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
