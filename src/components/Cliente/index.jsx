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
    // <div className="cliente">
    //   <div
    //     style={{
    //       display: "flex",
    //       flexDirection: "row",
    //       flexGrow: "1",
    //     }}
    //   >
    //     <p>
    //       <b>{nome}</b>
    //     </p>
    //     <p>
    //       <PhoneIphoneIcon fontSize="small" className="icon" />
    //       {telefone}
    //     </p>
    //     <p>
    //       <LocationOnIcon fontSize="small" className="icon" />
    //       {cidade} - {estado}
    //     </p>
    //   </div>
    //   <div
    //     style={{
    //       display: "flex",
    //       gap: "0.5em",
    //     }}
    //   >
    //     <button className="btn">
    //       <EditIcon fontSize="small" onClick={() => editCliente(index)} />
    //     </button>
    //     <button className="btn">
    //       <DeleteIcon fontSize="small" onClick={() => deleteCliente(index)} />
    //     </button>
    //   </div>
    // </div>
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
