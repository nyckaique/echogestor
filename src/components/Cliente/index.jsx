import "./cliente.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Cliente({
  index,
  nome,
  cidade,
  estado,
  telefone,
  editCliente,
  deleteCliente,
}) {
  return (
    <tr>
      <td>{nome}</td>
      <td className="tdCenter">{telefone}</td>
      <td className="tdCenter">
        {cidade} - {estado}
      </td>
      <td className="tdCenter">
        <button className="btn">
          <EditIcon fontSize="small" onClick={() => editCliente(index)} />
        </button>
      </td>
      <td className="tdCenter">
        <button className="btn">
          <DeleteIcon fontSize="small" onClick={() => deleteCliente(index)} />
        </button>
      </td>
    </tr>
  );
}
