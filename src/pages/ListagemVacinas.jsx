import { useEffect, useState } from 'react';
import { Table, Container, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

function ListagemVacinas() {
  const [vacinas, setVacinas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingVacina, setEditingVacina] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    fabricante: '',
    lote: '',
    dados_fabricacao: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState(''); // Estado para mensagem de exclusão

  // Função para buscar vacinas
  const fetchVacinas = async (search = '') => {
    try {
      const response = await axios.get('http://localhost:3002/vacinas', {
        params: { search },
      });
      setVacinas(response.data);
    } catch (error) {
      console.error('Erro ao buscar vacinas:', error);
      setErrorMessage('Erro ao carregar as vacinas. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    fetchVacinas();
  }, []);

  // Função para excluir uma vacina
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/vacinas/${id}`);
      setVacinas(vacinas.filter((vacina) => vacina.id !== id));
      setDeleteMessage('Vacina excluída com sucesso!');
      setTimeout(() => {
        setDeleteMessage(''); // Limpar a mensagem após 3 segundos
      }, 3000);
    } catch (error) {
      console.error('Erro ao excluir vacina:', error);
      setErrorMessage('Erro ao excluir vacina. Tente novamente.');
    }
  };

  // Função para realizar a pesquisa
  const handleSearch = () => {
    fetchVacinas(searchQuery);
  };

  // Função para abrir o modal de edição
  const handleEdit = (vacina) => {
    setEditingVacina(vacina);
    setFormData({
      nome: vacina.nome,
      tipo: vacina.tipo,
      fabricante: vacina.fabricante,
      lote: vacina.lote,
      dados_fabricacao: vacina.dados_fabricacao,
    });
  };

  // Função para salvar alterações
  const handleUpdate = async (event) => {
    event.preventDefault();
    const { nome, tipo, fabricante, lote, dados_fabricacao } = formData;

    try {
      await axios.put(`http://localhost:3002/vacinas/${editingVacina.id}`, {
        nome,
        tipo,
        fabricante,
        lote,
        dados_fabricacao,
      });
      setSuccessMessage('Vacina atualizada com sucesso!');
      fetchVacinas();
      setEditingVacina(null);
      setFormData({ nome: '', tipo: '', fabricante: '', lote: '', dados_fabricacao: '' });
    } catch (error) {
      console.error('Erro ao atualizar vacina:', error);
      setErrorMessage('Erro ao atualizar vacina. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Container>
      <h2 className="my-4">Lista de Vacinas</h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {deleteMessage && <Alert variant="success">{deleteMessage}</Alert>} {/* Mensagem de exclusão */}

      <Form.Control
        type="text"
        placeholder="Pesquisar por nome da vacina"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-2"
      />
      <Button onClick={handleSearch} variant="primary">
        Pesquisar
      </Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Fabricante</th>
            <th>Lote</th>
            <th>Dados de Fabricação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vacinas.length > 0 ? (
            vacinas.map((vacina) => (
              <tr key={vacina.id}>
                <td>{vacina.id}</td>
                <td>{vacina.nome}</td>
                <td>{vacina.tipo}</td>
                <td>{vacina.fabricante}</td>
                <td>{vacina.lote}</td>
                <td>{vacina.dados_fabricacao}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(vacina)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(vacina.id)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Nenhuma vacina encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal de Edição */}
      <Modal
        show={editingVacina !== null}
        onHide={() => setEditingVacina(null)}
        backdrop="static"
        keyboard
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Vacina</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="nome" className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome da vacina"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="tipo" className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="fabricante" className="mb-3">
              <Form.Label>Fabricante</Form.Label>
              <Form.Control
                type="text"
                placeholder="Fabricante"
                value={formData.fabricante}
                onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="lote" className="mb-3">
              <Form.Label>Lote</Form.Label>
              <Form.Control
                type="text"
                placeholder="Lote"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="dados_fabricacao" className="mb-3">
              <Form.Label>Dados de Fabricação</Form.Label>
              <Form.Control
                type="text"
                placeholder="Dados de fabricação"
                value={formData.dados_fabricacao}
                onChange={(e) => setFormData({ ...formData, dados_fabricacao: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Atualizar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ListagemVacinas;
