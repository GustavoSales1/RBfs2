import { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FormVacinas.css';

function FormVacinas() {
  const navigate = useNavigate();
  const [vacinaData, setVacinaData] = useState({
    nome: '',
    tipo: '',
    fabricante: '',
    lote: '',
    dados_fabricacao: '',
    validade: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Atualiza o estado com os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVacinaData({ ...vacinaData, [name]: value });
  };

  // Validações do formulário
  const validateForm = () => {
    const { nome, tipo, fabricante, lote, dados_fabricacao, validade } = vacinaData;
    if (!nome || !tipo || !fabricante || !lote || !dados_fabricacao || !validade) {
      return 'Todos os campos são obrigatórios.';
    }

    // Validação da data de validade (deve ser no futuro)
    const validadeDate = new Date(validade);
    const today = new Date();
    if (validadeDate <= today) {
      return 'A data de validade deve ser futura.';
    }

    // Validação do tamanho do lote
    if (lote.length < 5) {
      return 'O número do lote deve conter pelo menos 5 caracteres.';
    }

    return null;
  };

  // Envia os dados do formulário para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica validações
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage('');
      return;
    }

    setIsLoading(true); // Inicia o indicador de carregamento

    try {
      // Faz o POST para o backend
      const response = await axios.post('http://localhost:3002/vacinas', vacinaData);
      console.log('Resposta do servidor:', response.data);

      setSuccessMessage('Vacina cadastrada com sucesso!');
      setErrorMessage('');
      setVacinaData({
        nome: '',
        tipo: '',
        fabricante: '',
        lote: '',
        dados_fabricacao: '',
        validade: '',
      });

      // Redireciona para a lista de vacinas após sucesso
      setTimeout(() => navigate('/ListagemVacinas'), 1000);
    } catch (error) {
      console.error('Erro ao cadastrar vacina:', error);
      const serverMessage = error.response?.data?.message || 'Erro ao cadastrar vacina. Tente novamente.';
      setErrorMessage(serverMessage);
      setSuccessMessage('');
    } finally {
      setIsLoading(false); // Finaliza o indicador de carregamento
    }
  };

  return (
    <Container>
      <h2 className="my-4">Cadastro de Vacinas</h2>

      <Form onSubmit={handleSubmit} className="formVacinas">
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form.Group controlId="formDadosFabricacao">
        <Form.Label>Data de Fabricação</Form.Label>
        <Form.Control
          type="date"
          name="dados_fabricacao"
          value={vacinaData.dados_fabricacao}
          onChange={handleChange}
          required
          />
        </Form.Group>


        <Form.Group controlId="formTipo">
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            type="text"
            name="tipo"
            value={vacinaData.tipo}
            onChange={handleChange}
            placeholder="Exemplo: Antirrábica"
            required
          />
        </Form.Group>

        <Form.Group controlId="formFabricante">
          <Form.Label>Fabricante</Form.Label>
          <Form.Control
            type="text"
            name="fabricante"
            value={vacinaData.fabricante}
            onChange={handleChange}
            placeholder="Digite o nome do fabricante"
            required
          />
        </Form.Group>

        <Form.Group controlId="formLote">
          <Form.Label>Lote</Form.Label>
          <Form.Control
            type="text"
            name="lote"
            value={vacinaData.lote}
            onChange={handleChange}
            placeholder="Número do lote (mín. 5 caracteres)"
            required
          />
        </Form.Group>

        <Form.Group controlId="formDadosFabricacao">
          <Form.Label>Dados de Fabricação</Form.Label>
          <Form.Control
            type="text"
            name="dados_fabricacao"
            value={vacinaData.dados_fabricacao}
            onChange={handleChange}
            placeholder="Exemplo: Local, data"
            required
          />
        </Form.Group>

        <Form.Group controlId="formValidade">
          <Form.Label>Validade</Form.Label>
          <Form.Control
            type="date"
            name="validade"
            value={vacinaData.validade}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mt-3" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Cadastrar Vacina'}
        </Button>
      </Form>
    </Container>
  );
}

export default FormVacinas;
