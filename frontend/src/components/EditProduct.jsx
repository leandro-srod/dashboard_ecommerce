import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProductEditPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
 const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/produtos`);
        setProducts(response.data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Erro ao carregar produtos. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm("Tem certeza que deseja EXCLUIR este produto? Esta ação é irreversível.")) {
      try {
        await axios.delete(`${API_URL}/produtos/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
        setMessage({ type: 'success', text: 'Produto excluído com sucesso!' });
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
        setMessage({ type: 'danger', text: 'Erro ao excluir produto. Tente novamente.' });
      } finally {
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" className="me-2" />
        Carregando produtos...
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div>
        <a>GERENCIAR PRODUTOS | Produtos cadastrados: {products.length} </a>
      </div><br></br>

      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      {products.length === 0 ? (
        <p>Nenhum produto cadastrado ainda. <Link to="/cadastrar-produtos">Cadastre um novo produto aqui.</Link></p>
      ) : (

        <Row xs={1} md={2} lg={4} className="g-3">
          {products.map((product) => (
            <Col key={product._id}> 
              <Card className="h-100 shadow-sm" > 
                {product.imagens && product.imagens.length > 0 ? (
                  <Card.Img
                    variant="top"
                    src={product.imagens[0].url} 
                    alt={product.nome}
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ height: '200px', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Sem Imagem
                  </div>
                )}
                
                <Card.Body>
                  <Card.Title>{product.nome}</Card.Title>
                  <Card.Text>
                    <strong>Valor:</strong> R$ {parseFloat(product.valor).toFixed(2).replace('.', ',')}
                    <br />
                    <strong> Qtd: </strong> {product.quantidade}<br />
                    {product.descricao && <small className="text-muted d-block mt-1">{product.descricao.substring(0, 90)}...</small>} 
                   
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
               
                  <Button
                    variant="primary"
                    size="sm"
                    as={Link}
                    to={`/editar-produto/${product._id}`}
                  >
                    Editar
                  </Button>
               
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Excluir
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default ProductEditPage;

