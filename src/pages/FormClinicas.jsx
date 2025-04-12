import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate
import axios from 'axios'; // Importa axios
import './FormClinicas.css'; // Importa o arquivo CSS personalizado, se necessário

function FormClinicas() {
  const [clinicaData, setClinicaData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    endereco: '',
    telefone: '',
    especialidade: 'Selecione a Especialidade', 
  });

  const navigate = useNavigate(); // Inicializa o hook useNavigate

  const handleChange = (event) => {
    setClinicaData({ ...clinicaData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newClinic = {
      razao_social: clinicaData.razaoSocial,
      nome_fantasia: clinicaData.nomeFantasia,
      telefone: clinicaData.telefone,
      endereco: clinicaData.endereco,
      especialidade: clinicaData.especialidade
    };

    try {
      // Faz a requisição POST para o back-end
      await axios.post('http://localhost:3002/clinicas', newClinic);

      // Redefine o estado do formulário
      setClinicaData({
        razaoSocial: '',
        nomeFantasia: '',
        endereco: '',
        telefone: '',
        especialidade: 'Selecione a Especialidade'
      });

      // Redireciona para a tela de listagem
      navigate('/listagem');
    } catch (error) {
      console.error('Erro ao cadastrar clínica:', error);
      alert('Erro ao cadastrar clínica');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} className='formClinicas'>
        <Form.Group as={Row} className='mb-4' controlId="formRazaoSocial">
          <Form.Label column sm={2}>Razão Social</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="razaoSocial"
              value={clinicaData.razaoSocial}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-4' controlId="formNomeFantasia">
          <Form.Label column sm={2}>Nome Fantasia</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="nomeFantasia"
              value={clinicaData.nomeFantasia}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        

        <Form.Group as={Row} className='mb-4' controlId="formEndereco">
          <Form.Label column sm={2}>Endereço</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="endereco"
              value={clinicaData.endereco}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-4' controlId="formTelefone">
          <Form.Label column sm={2}>Telefone</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="telefone"
              value={clinicaData.telefone}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-4' controlId="formEspecialidade">
          <Form.Label column sm={2}>Especialidade</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="select"
              name="especialidade"
              value={clinicaData.especialidade}
              onChange={handleChange}
              required
            >
              <option>Selecione a Especialidade</option>
              <option>Cardiologia</option>
              <option>Dermatologia</option>
              <option>Ortopedia</option>
              <option>Pediatria</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Cadastrar Clínicas
        </Button>
      </Form>
    </Container>
  );
}

export default FormClinicas;
