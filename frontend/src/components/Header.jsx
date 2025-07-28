import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import '../App.css';
import DashboardIcon from '../img/dashboard.png';

function Header() {
  return (
    <Navbar expand="lg" className="navbar">
        <Navbar.Brand className="d-flex align-items-center">
           <img
                    src={DashboardIcon}
                    alt="Dashboard Icon"
                    height="30"
                />{' '}
          <a>DASHBOARD</a></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

            <Nav.Link as={Link} to="/cadastrar-produtos">Cadastrar Produtos</Nav.Link>
      
            <Nav.Link as={Link} to="/editar-produtos">Editar Produtos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      
    </Navbar>
  );
}

export default Header;