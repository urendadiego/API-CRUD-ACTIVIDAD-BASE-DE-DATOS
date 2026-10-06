import { Routes, Route, useParams } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Empresas from "./pages/Empresas.jsx";
import EmpresaForm from "./pages/EmpresaForm.jsx";
import NoEncontrada from "./pages/NoEncontrada.jsx";

// key distinta por id: al cambiar de empresa (o pasar a "nueva") el formulario arranca de cero
function EditarEmpresa() {
  const { id } = useParams();
  return <EmpresaForm key={id} />;
}

function App() {
  return (
    <>
      <Navbar />
      <main className="contenido">
        <Routes>
          <Route path="/" element={<Empresas />} />
          <Route path="/empresas/nueva" element={<EmpresaForm key="nueva" />} />
          <Route path="/empresas/:id/editar" element={<EditarEmpresa />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
