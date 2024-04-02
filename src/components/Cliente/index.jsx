import "./cliente.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
export default function Cliente({
  index,
  nome,
  endereco,
  telefone,
  editCliente,
  deleteCliente,
}) {
  return (
    <div className="cliente">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p>
          <b>{nome}</b>
        </p>
        <p>
          <PhoneIphoneIcon fontSize="small" className="icon" />
          {telefone}
        </p>
        <p>
          <LocationOnIcon fontSize="small" className="icon" />
          {endereco}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.5em",
        }}
      >
        <button className="btn">
          <EditIcon fontSize="medium" onClick={() => editCliente(index)} />
        </button>
        <button className="btn">
          <DeleteIcon fontSize="medium" onClick={() => deleteCliente(index)} />
        </button>
      </div>
    </div>
  );
}
