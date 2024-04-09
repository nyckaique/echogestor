import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import Cliente from "../Cliente";

export default function ClientesTable({ filtro, editCliente, deleteCliente }) {
  const { clientes } = useContext(AuthContext);
  const clientesFiltrados = clientes.filter((cliente) => {
    if (filtro !== "") {
      return cliente.nomeCliente
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(filtro);
    } else {
      return cliente;
    }
  });

  return (
    <div>
      <div className="containerCliente">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Informações</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente, index) => {
              return (
                <Cliente
                  key={index}
                  index={index}
                  id={cliente.id}
                  nome={cliente.nomeCliente}
                  cidade={cliente.cidade}
                  estado={cliente.estado}
                  telefone={cliente.telefone}
                  editCliente={editCliente}
                  deleteCliente={deleteCliente}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
