import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import Agendamento from "../Agendamento";

export default function AgendamentosTable({
  filtro,
  filtroStatus,
  dateRange,
  editAgendamento,
  deleteAgendamento,
}) {
  const { agendamentos } = useContext(AuthContext);

  function filtraNome(agendamento) {
    return agendamento.nomeCliente
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(filtro);
  }
  function filtraStatus(agendamento) {
    if (agendamento.status === filtroStatus.value) {
      return agendamento;
    }
  }

  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    let dateInicio = dateRange[0];
    let dateFim = dateRange[1];
    if (dateInicio !== null && dateFim !== null) {
      dateInicio = new Date(dateInicio).getTime();
      dateFim = new Date(dateFim + 86400000).getTime();
      if (agendamento.date >= dateInicio && agendamento.date <= dateFim) {
        if ((filtro !== "") & (filtroStatus.value !== null)) {
          if (filtraNome(agendamento) && filtraStatus(agendamento)) {
            return agendamento;
          }
        } else if (filtro !== "") {
          return filtraNome(agendamento);
        } else if (filtroStatus.value !== null) {
          return filtraStatus(agendamento);
        } else {
          return agendamento;
        }
      }
    } else {
      if ((filtro !== "") & (filtroStatus.value !== null)) {
        if (filtraNome(agendamento) && filtraStatus(agendamento)) {
          return agendamento;
        }
      } else if (filtro !== "") {
        return filtraNome(agendamento);
      } else if (filtroStatus.value !== null) {
        return filtraStatus(agendamento);
      } else {
        return agendamento;
      }
    }
  });

  return (
    <div>
      <div className="containerAgendamentos">
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
            {agendamentosFiltrados.map((agendamento, index) => {
              return (
                <Agendamento
                  key={index}
                  index={index}
                  id={agendamento.id}
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
