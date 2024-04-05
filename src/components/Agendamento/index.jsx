import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Agendamento({
  index,
  clienteId,
  nomeCliente,
  produtoId,
  nomeProduto,
  valorProduto,
  horario,
  editAgendamento,
  deleteAgendamento,
}) {
  let date = new Date(horario);

  return (
    <tr>
      <td>{nomeCliente}</td>
      <td className="tdCenter">
        {nomeProduto}
        {": "}
        {valorProduto.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })}
      </td>
      <td className="tdCenter">
        {date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        {"h "}
        {date.toLocaleDateString()}
      </td>
      <td className="tdCenter">
        <button className="btn">
          <EditIcon fontSize="small" onClick={() => editAgendamento(index)} />
        </button>
      </td>
      <td className="tdCenter">
        <button className="btn">
          <DeleteIcon
            fontSize="small"
            onClick={() => deleteAgendamento(index)}
          />
        </button>
      </td>
    </tr>
  );
}
