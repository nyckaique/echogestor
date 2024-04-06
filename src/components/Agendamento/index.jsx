import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: "0.5em",
  boxShadow: 24,
  p: 4,
};

export default function Agendamento({
  index,
  clienteId,
  nomeCliente,
  produtoId,
  nomeProduto,
  valorProduto,
  horario,
  status,
  editAgendamento,
  deleteAgendamento,
}) {
  let date = new Date(horario);

  const [cliente, setCliente] = useState({});
  useEffect(() => {
    async function loadCliente() {
      let docRef = doc(db, "clientes", clienteId);

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
    loadCliente();
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <tr>
      <td
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {nomeCliente}{" "}
        <button className="btn" onClick={handleOpen}>
          <VisibilityIcon fontSize="small" />
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <b>{cliente.nomeCliente}</b>
              <button onClick={handleClose} className="btn">
                <CloseIcon fontSize="small" />
              </button>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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
            </Typography>
          </Box>
        </Modal>
      </td>
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
        {status ? "Concluído" : "Aguardando pagamento"}
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
