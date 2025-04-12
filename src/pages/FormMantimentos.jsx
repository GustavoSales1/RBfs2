import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './FormMantimentos.css';

function FormMantimentos() {
  const [mantimentoData, setMantimentoData] = useState({
    nome_item: '',
    descricao: '',
    quantidade: '',
    doador: '',
    contato_doador: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { id } = useParams(); // Pega o ID do mantimento para edição
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Carrega os dados do mantimento para edição
      axios
        .get(`http://localhost:3002/mantimentos/${id}`)
        .then((response) => {
          setMantimentoData(response.data);
        })
        .catch((error) => {
          console.error('Erro ao buscar mantimento:', error);
          setErrorMessage('Erro ao carregar os dados do mantimento.');
        });
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMantimentoData((prevState) => ({ ...prevState, [name]: value }));
  };

  const isFormValid = () => {
    const { nome_item, descricao, quantidade, doador, contato_doador } = mantimentoData;
    if (!nome_item || !descricao || !doador || !contato_doador) {
      return false;
    }

    const quantidadeValida = parseInt(quantidade, 10);
    return !isNaN(quantidadeValida) && quantidadeValida > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      setErrorMessage('Preencha todos os campos corretamente antes de enviar.');
      setSuccessMessage('');
      return;
    }

    try {
      let response;
      const formattedData = {
        ...mantimentoData,
        quantidade: parseInt(mantimentoData.quantidade, 10),
      };

      if (id) {
        response = await axios.put(`http://localhost:3002/mantimentos/${id}`, formattedData);
        setSuccessMessage('Mantimento atualizado com sucesso!');
      } else {
        response = await axios.post('http://localhost:3002/mantimentos', formattedData);
        setSuccessMessage('Mantimento cadastrado com sucesso!');
      }

      setErrorMessage('');
      setTimeout(() => {
        navigate('/listagem-mantimentos');
      }, 2000);
    } catch (error) {
      console.error('Erro ao cadastrar ou atualizar mantimento:', error);
      const message = error.response?.data?.erro || 'Erro ao processar a requisição. Tente novamente mais tarde.';
      setErrorMessage(message);
      setSuccessMessage('');
    }
  };

  return (
    <Container>
      <h2 className="my-4">{id ? 'Atualizar Mantimento' : 'Cadastro de Mantimentos'}</h2>

      <Form onSubmit={handleSubmit} className="formMantimentos">
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form.Group as={Row} className="mb-3" controlId="formNomeItem">
          <Form.Label column sm={2}>Nome do Item</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="nome_item"
              value={mantimentoData.nome_item}
              onChange={handleChange}
              placeholder="Digite o nome do item"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDescricao">
          <Form.Label column sm={2}>Descrição</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              name="descricao"
              value={mantimentoData.descricao}
              onChange={handleChange}
              rows={3}
              placeholder="Descreva o item"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formQuantidade">
          <Form.Label column sm={2}>Quantidade</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              name="quantidade"
              value={mantimentoData.quantidade}
              onChange={handleChange}
              placeholder="Informe a quantidade"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDoador">
          <Form.Label column sm={2}>Doador</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="doador"
              value={mantimentoData.doador}
              onChange={handleChange}
              placeholder="Nome do doador"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formContatoDoador">
          <Form.Label column sm={2}>Contato do Doador</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="contato_doador"
              value={mantimentoData.contato_doador}
              onChange={handleChange}
              placeholder="Telefone ou e-mail"
              required
            />
          </Col>
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit">
            {id ? 'Atualizar Mantimento' : 'Cadastrar Mantimento'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default FormMantimentos;
