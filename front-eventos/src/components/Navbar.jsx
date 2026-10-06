import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { PlusOutlined, SoundOutlined } from "@ant-design/icons";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(10px)",
        background: "rgba(11, 11, 18, 0.75)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
      }}
    >
      <div
        className="contenido"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBlock: 14 }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SoundOutlined style={{ fontSize: 24, color: "#a855f7" }} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            Backstage
          </Typography.Title>
          <Typography.Text type="secondary" className="ocultar-mobile">
            Panel de productoras
          </Typography.Text>
        </Link>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/empresas/nueva")}>
          <span className="ocultar-mobile">Nueva productora</span>
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
