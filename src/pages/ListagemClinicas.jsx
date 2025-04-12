import { useEffect, useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import axios from 'axios';

function ListagemClinicas() {
  const [clinicas, setClinicas] = useState([]);

  useEffect(() => {
    // Faz a requisição GET para obter as clínicas do back-end
    const fetchClinicas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/clinicas');
        setClinicas(response.data);
      } catch (error) {
        console.error('Erro ao buscar clínicas:', error);
      }
    };

    fetchClinicas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/clinicas/${id}`);
      setClinicas(clinicas.filter(clinica => clinica.id !== id));
    } catch (error) {
      console.error('Erro ao excluir clínica:', error);
    }
  };

  return (
    <Container>
      <div className="formMantimentos">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Razão Social</th>
              <th>Nome Fantasia</th>
              <th>Endereço</th>
              <th>Telefone</th>
              <th>Especialidade</th>
            
            </tr>
          </thead>
          <tbody>
            {clinicas.map((clinica, index) => (
              <tr key={clinica.id}>
                <td>{index + 1}</td>
                <td>{clinica.razao_social}</td>
                <td>{clinica.nome_fantasia}</td>
                <td>{clinica.endereco}</td>
                <td>{clinica.telefone}</td>
                <td>{clinica.especialidade}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      
    </Container>
  );
}

export default ListagemClinicas;
