import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import Produto from "../Produto";

export default function ProdutoTable({ filtro, editProduto, deleteProduto }) {
  const { produtos } = useContext(AuthContext);
  const produtosFiltrados = produtos.filter((produto) => {
    if (filtro !== "") {
      return produto.nomeProduto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(filtro);
    } else {
      return produto;
    }
  });

  return (
    <div>
      <div className="containerProduto">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((produto, index) => {
              return (
                <Produto
                  key={index}
                  index={index}
                  id={produto.id}
                  nomeProduto={produto.nomeProduto}
                  valorProduto={produto.valorProduto}
                  editProduto={editProduto}
                  deleteProduto={deleteProduto}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
