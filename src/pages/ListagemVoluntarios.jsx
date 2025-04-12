import { useState, useEffect } from 'react';
import { Table, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ListagemMantimentos() {
  const [mantimentos, setMantimentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMantimentos, setFilteredMantimentos] = useState([]);
  const navigate = useNavigate(); // Para redirecionamento

  useEffect(() => {
    // Faz a requisição GET para obter os mantimentos do back-end
    const fetchMantimentos = async () => {
      try {
        const response = await axios.get('http://localhost:3306/mantimentos');
        setMantimentos(response.data); // Dados já são passados diretamente
        setFilteredMantimentos(response.data); // Inicializa a lista filtrada com todos os itens
      } catch (error) {
        console.error('Erro ao buscar mantimentos:', error);
      }
    };

    fetchMantimentos();
  }, []);

  // Função para lidar com a pesquisa
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterMantimentos(event.target.value);
  };

  // Função para filtrar os mantimentos com base no termo de pesquisa
  const filterMantimentos = (term) => {
    if (term === '') {
      setFilteredMantimentos(mantimentos); // Exibe todos os mantimentos se a pesquisa estiver vazia
    } else {
      const filtered = mantimentos.filter(mantimento =>
        mantimento.nome_item.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMantimentos(filtered); // Atualiza a lista filtrada
    }
  };

  const handleDelete = async (id) => {
    try {
      // Envia a requisição DELETE para o servidor para remover o mantimento
      const response = await axios.delete(`http://localhost:3306/mantimentos/${id}`);

      // Após excluir, atualiza a lista de mantimentos e a lista filtrada
      setMantimentos(mantimentos.filter(mantimento => mantimento.id !== id));
      setFilteredMantimentos(filteredMantimentos.filter(mantimento => mantimento.id !== id));

      alert('Mantimento excluído com sucesso!'); // Mensagem de sucesso
    } catch (error) {
      console.error('Erro ao excluir mantimento:', error);
      alert('Erro ao excluir o mantimento. Tente novamente.');
    }
  };

  // Função de edição (redireciona para o formulário de atualização)
  const handleEdit = (id) => {
    navigate(`/form-mantimentos/${id}`);
  };

  return (
    <Container>
      <div className="formMantimentos">
        {/* Campo de Pesquisa */}
        <Form.Group className="mb-3">
          <Form.Label>Pesquisar Item</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome do item"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome do Item</th>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>Doador</th>
              <th>Contato do Doador</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {(filteredMantimentos.length > 0 ? filteredMantimentos : mantimentos).map((mantimento, index) => (
              <tr
                key={mantimento.id}
                style={{
                  backgroundColor: searchTerm && mantimento.nome_item.toLowerCase().includes(searchTerm.toLowerCase()) ? '#f8d7da' : ''
                }}
              >
                <td>{index + 1}</td>
                <td>{mantimento.nome_item}</td>
                <td>{mantimento.descricao}</td>
                <td>{mantimento.quantidade}</td>
                <td>{mantimento.doador}</td>
                <td>{mantimento.contato_doador}</td>
                <td>
                  {/* Botão para editar */}
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleEdit(mantimento.id)}
                  >
                    Atualizar
                  </button>
                  {/* Botão para excluir */}
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(mantimento.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default ListagemMantimentos;
