import { useEffect, useState } from 'react';
import { Table, Container, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

function ListagemMantimentos() {
  const [mantimentos, setMantimentos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMantimento, setEditingMantimento] = useState(null);
  const [formData, setFormData] = useState({
    nome_item: '',
    descricao: '',
    quantidade: '',
    doador: '',
    contato_doador: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mantimentoToDelete, setMantimentoToDelete] = useState(null);

  // Função para buscar os mantimentos
  const fetchMantimentos = async (search = '') => {
    try {
      const response = await axios.get('http://localhost:3002/mantimentos', {
        params: { search },
      });
      setMantimentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar mantimentos:', error);
      setErrorMessage('Erro ao carregar os mantimentos. Tente novamente mais tarde.');
    }
  };

  // Carrega os mantimentos ao montar o componente
  useEffect(() => {
    fetchMantimentos();
  }, []);

  // Função para deletar um mantimento
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3002/mantimentos/${mantimentoToDelete.id}`);
      setMantimentos(mantimentos.filter((item) => item.id !== mantimentoToDelete.id));
      setSuccessMessage('Mantimento excluído com sucesso!');
      setShowDeleteConfirm(false); // Fecha o modal de confirmação
    } catch (error) {
      console.error('Erro ao excluir mantimento:', error);
      setErrorMessage('Erro ao excluir mantimento. Tente novamente.');
      setShowDeleteConfirm(false);
    }
  };

  // Função para pesquisar mantimentos
  const handleSearch = () => {
    fetchMantimentos(searchQuery);
  };

  // Função para editar mantimento
  const handleEdit = (mantimento) => {
    setEditingMantimento(mantimento);
    setFormData({
      nome_item: mantimento.nome_item,
      descricao: mantimento.descricao,
      quantidade: mantimento.quantidade,
      doador: mantimento.doador,
      contato_doador: mantimento.contato_doador,
    });
  };

  // Função para salvar alterações no mantimento
  const handleUpdate = async (event) => {
    event.preventDefault();
    const { nome_item, descricao, quantidade, doador, contato_doador } = formData;

    try {
      await axios.put(`http://localhost:3002/mantimentos/${editingMantimento.id}`, {
        nome_item,
        descricao,
        quantidade,
        doador,
        contato_doador,
      });
      setSuccessMessage('Mantimento atualizado com sucesso!');
      fetchMantimentos(); // Atualiza a lista
      setEditingMantimento(null); // Fecha o modal
      setFormData({
        nome_item: '',
        descricao: '',
        quantidade: '',
        doador: '',
        contato_doador: '',
      }); // Reseta o formulário
    } catch (error) {
      console.error('Erro ao editar mantimento:', error);
      setErrorMessage('Erro ao atualizar mantimento. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Container>
      <h2 className="my-4">Lista de Mantimentos</h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form.Control
        type="text"
        placeholder="Pesquisar por nome do item"
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
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Doador</th>
            <th>Contato do Doador</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {mantimentos.length > 0 ? (
            mantimentos.map((mantimento) => (
              <tr key={mantimento.id}>
                <td>{mantimento.id}</td>
                <td>{mantimento.nome_item}</td>
                <td>{mantimento.descricao}</td>
                <td>{mantimento.quantidade}</td>
                <td>{mantimento.doador}</td>
                <td>{mantimento.contato_doador}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(mantimento)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setMantimentoToDelete(mantimento);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Nenhum mantimento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        backdrop="static"
        keyboard
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Você tem certeza de que deseja excluir este mantimento?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        show={editingMantimento !== null}
        onHide={() => setEditingMantimento(null)}
        backdrop="static"
        keyboard
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Mantimento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="nome_item" className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do item"
                value={formData.nome_item}
                onChange={(e) => setFormData({ ...formData, nome_item: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="descricao" className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Descrição do item"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="quantidade" className="mb-3">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control
                type="number"
                placeholder="Quantidade"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="doador" className="mb-3">
              <Form.Label>Doador</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do doador"
                value={formData.doador}
                onChange={(e) => setFormData({ ...formData, doador: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="contato_doador" className="mb-3">
              <Form.Label>Contato do Doador</Form.Label>
              <Form.Control
                type="text"
                placeholder="Contato do doador"
                value={formData.contato_doador}
                onChange={(e) => setFormData({ ...formData, contato_doador: e.target.value })}
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

export default ListagemMantimentos;
