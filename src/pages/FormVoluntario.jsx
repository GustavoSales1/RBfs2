import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './FormVoluntario.css';

function FormVoluntario() {
  const [voluntarioData, setVoluntarioData] = useState({
    nome: '',
    contato: '',
    habilidades: '',
    disponibilidade: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { id } = useParams(); // Pega o ID do voluntário se for edição
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3306/voluntarios/${id}`)
        .then(response => setVoluntarioData(response.data))
        .catch(error => {
          console.error('Erro ao buscar voluntário:', error);
          setErrorMessage('Erro ao carregar os dados do voluntário.');
        });
    }
  }, [id]);

  const handleChange = (event) => {
    setVoluntarioData({ ...voluntarioData, [event.target.name]: event.target.value });
  };

  const isFormValid = () => {
    const { nome, contato, habilidades, disponibilidade } = voluntarioData;
    return nome && contato && habilidades && disponibilidade;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      setErrorMessage('Preencha todos os campos corretamente antes de enviar.');
      setSuccessMessage('');
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:3306/voluntarios/${id}`, voluntarioData);
        setSuccessMessage('Voluntário atualizado com sucesso!');
      } else {
        await axios.post('http://localhost:3306/voluntarios', voluntarioData);
        setSuccessMessage('Voluntário cadastrado com sucesso!');
      }
      setErrorMessage('');
      setTimeout(() => navigate('/listagem-voluntarios'), 2000);
    } catch (error) {
      console.error('Erro ao cadastrar ou atualizar voluntário:', error);
      setErrorMessage(error.response?.data || 'Erro ao processar a requisição.');
      setSuccessMessage('');
    }
  };

  return (
    <Container>
      <h2 className="my-4">{id ? 'Atualizar Voluntário' : 'Cadastro de Voluntários'}</h2>

      <Form onSubmit={handleSubmit} className="formVoluntario">
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form.Group as={Row} className="mb-3" controlId="formNome">
          <Form.Label column sm={2}>Nome</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="nome"
              value={voluntarioData.nome}
              onChange={handleChange}
              placeholder="Nome do voluntário"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formContato">
          <Form.Label column sm={2}>Contato</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="contato"
              value={voluntarioData.contato}
              onChange={handleChange}
              placeholder="Telefone ou e-mail"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHabilidades">
          <Form.Label column sm={2}>Habilidades</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              name="habilidades"
              value={voluntarioData.habilidades}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Cuidado com animais, eventos, redes sociais..."
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDisponibilidade">
          <Form.Label column sm={2}>Disponibilidade</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              name="disponibilidade"
              value={voluntarioData.disponibilidade}
              onChange={handleChange}
              rows={2}
              placeholder="Dias e horários disponíveis"
              required
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={!isFormValid()}>
          {id ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </Form>
    </Container>
  );
}

export default FormVoluntario;
