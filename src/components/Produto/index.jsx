import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Produto({
  index,
  nomeProduto,
  valorProduto,
  editProduto,
  deleteProduto,
}) {
  return (
    <tr>
      <td>{nomeProduto}</td>
      <td className="tdCenter">{valorProduto}</td>
      <td className="tdCenter">
        <button className="btn">
          <EditIcon fontSize="small" onClick={() => editProduto(index)} />
        </button>
      </td>
      <td className="tdCenter">
        <button className="btn">
          <DeleteIcon fontSize="small" onClick={() => deleteProduto(index)} />
        </button>
      </td>
    </tr>
  );
}
