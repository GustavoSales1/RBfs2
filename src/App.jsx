import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import FormVoluntario from './pages/FormVoluntario';
import FormClinicas from './pages/FormClinicas';
import FormMantimentos from './pages/FormMantimentos';
import ListagemClinicas from './pages/ListagemClinicas';
import ListagemVoluntarios from './pages/ListagemVoluntarios';
import ListagemMantimentos from './pages/listagemMantimentos';
import FormVacinas from './pages/FormVacinas';
import ListagemVacinas from './pages/ListagemVacinas';
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Cadastrovoluntarios" element={<FormVoluntario />} />
        <Route path="/CadastroMantimentos" element={<FormMantimentos />} />
        <Route path="/Cadastroclinicas" element={<FormClinicas />} />
        <Route path="/listagem" element={<ListagemClinicas />} />
        <Route path="/listagem-voluntarios" element={<ListagemVoluntarios />} />
        <Route path="/listagem-mantimentos" element={<ListagemMantimentos />} />
        <Route path="/CadastroVacinas" element={<FormVacinas />} />
        <Route path="/ListagemVacinas" element={<ListagemVacinas />} />
        <Route path="/editar-vacina/:id" element={<FormVacinas />} />
        <Route path="/ListagemVacinas" element={<ListagemVacinas />} />
      </Routes>
    </>
  );
}

export default App;
