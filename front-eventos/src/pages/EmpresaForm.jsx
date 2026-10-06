import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert, App, Button, Card, Col, Form, Input, Result, Row, Space, Spin, Switch, Typography
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { obtenerEmpresa, crearEmpresa, actualizarEmpresa } from "../services/empresasService.js";

const FORM_VACIO = { nombre: "", cuit: "", email: "", telefono: "", direccion: "", activo: true };

function EmpresaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(Boolean(id));
  const [guardando, setGuardando] = useState(false);
  const [noExiste, setNoExiste] = useState(false);

  useEffect(() => {
    if (!id) return; // sin id: formulario vacío

    const cargarEmpresa = async () => {
      try {
        const { data } = await obtenerEmpresa(id);
        setForm({
          nombre: data.nombre,
          cuit: data.cuit,
          email: data.email ?? "",
          telefono: data.telefono ?? "",
          direccion: data.direccion ?? "",
          activo: data.activo ?? true
        });
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 400) setNoExiste(true);
        else setErrores({ api: "No se pudo cargar la empresa" });
      } finally {
        setCargando(false);
      }
    };
    cargarEmpresa();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const nuevos = {};
    if (!form.nombre.trim()) nuevos.nombre = "El nombre es obligatorio";
    if (!form.cuit.trim()) nuevos.cuit = "El CUIT es obligatorio";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    // Los campos opcionales vacíos se mandan como null
    const empresa = {
      nombre: form.nombre.trim(),
      cuit: form.cuit.trim(),
      email: form.email.trim() || null,
      telefono: form.telefono.trim() || null,
      direccion: form.direccion.trim() || null
    };

    setGuardando(true);
    try {
      if (id) {
        await actualizarEmpresa(id, { ...empresa, activo: form.activo });
        message.success("Productora actualizada");
      } else {
        await crearEmpresa(empresa);
        message.success("Productora creada");
      }
      navigate("/");
    } catch (error) {
      setErrores({
        api: error.response?.data?.mensaje || `Error al ${id ? "editar" : "crear"} la empresa`
      });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (noExiste) {
    return (
      <Result
        status="404"
        title="Productora no encontrada"
        subTitle={`No existe una empresa con id ${id}.`}
        extra={<Button type="primary" onClick={() => navigate("/")}>Volver al listado</Button>}
      />
    );
  }

  // Muestra el error de un campo debajo del input
  const estado = (campo) => ({
    validateStatus: errores[campo] ? "error" : undefined,
    help: errores[campo]
  });

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/")} style={{ paddingInline: 0 }}>
        Volver
      </Button>
      <Typography.Title level={2} style={{ marginTop: 8 }}>
        {id ? "Editar productora" : "Nueva productora"}
      </Typography.Title>

      <Card>
        {errores.api && <Alert type="error" showIcon title={errores.api} style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} md={14}>
              <Form.Item label="Nombre" required {...estado("nombre")}>
                <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Sonar Producciones" maxLength={150} />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item label="CUIT" required {...estado("cuit")}>
                <Input name="cuit" value={form.cuit} onChange={handleChange} placeholder="30-12345678-9" maxLength={13} />
              </Form.Item>
            </Col>
            <Col xs={24} md={14}>
              <Form.Item label="Email">
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="contacto@productora.com" maxLength={150} />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item label="Teléfono">
                <Input name="telefono" value={form.telefono} onChange={handleChange} placeholder="351-4000000" maxLength={30} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Dirección">
                <Input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Av. Siempre Viva 742, Córdoba" maxLength={200} />
              </Form.Item>
            </Col>
            {id && (
              <Col span={24}>
                <Form.Item label="Activa">
                  <Switch checked={form.activo} onChange={(activo) => setForm({ ...form, activo })} />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Space>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={guardando}>
              {id ? "Guardar cambios" : "Crear productora"}
            </Button>
            <Button onClick={() => navigate("/")}>Cancelar</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}

export default EmpresaForm;
