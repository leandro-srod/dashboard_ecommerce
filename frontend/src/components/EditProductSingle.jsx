import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Spinner, Alert, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

function EditProductSingle() {
  const { id } = useParams(); 
  
  const navigate = useNavigate(); 

  const [product, setProduct] = useState({
    nome: '',
    descricao: '',
    valor: '',
    quantidade: '',
    larguraPeca: '',
    alturaPeca: '',
    profundPeca: '',
    larguraEnvio: '',
    alturaEnvio: '',
    profundEnvio: '',
    pesoEnvio: '',
     imagens: [],
  });
  const [newImages, setNewImages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:3000'; 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/produtos/${id}`);

        const fetchedProduct = {
          ...response.data,
          valor: response.data.valor ? response.data.valor.toString() : '0.00',
          quantidade: parseInt(response.data.quantidade) || 0,
          larguraPeca: response.data.larguraPeca ? response.data.larguraPeca.toString() : '0',
          alturaPeca: response.data.alturaPeca ? response.data.alturaPeca.toString() : '0',
          profundPeca: response.data.profundPeca ? response.data.profundPeca.toString() : '0',
          larguraEnvio: response.data.larguraEnvio ? response.data.larguraEnvio.toString() : '0',
          alturaEnvio: response.data.alturaEnvio ? response.data.alturaEnvio.toString() : '0',
          profundEnvio: response.data.profundEnvio ? response.data.profundEnvio.toString() : '0',
          pesoEnvio: response.data.pesoEnvio ? response.data.pesoEnvio.toString() : '0',
          imagens: response.data.imagens || [],
        };
        setProduct(fetchedProduct);
      } catch (err) {
        console.error("Erro ao buscar produto para edição:", err);
        setError("Erro ao carregar os dados do produto. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); 


  const handleChange = (e) => {
    const { name, value } = e.target;

      let processedValue = value;
    if (['valor', 'larguraPeca', 'alturaPeca', 'profundPeca', 
         'larguraEnvio', 'alturaEnvio', 'profundEnvio', 'pesoEnvio'].includes(name)) {
        processedValue = value.replace(',', '.'); 
    }

    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: processedValue 
    }));
  };

   const handleNewImageChange = (e) => {
    setNewImages(Array.from(e.target.files)); 
  };

  const handleDeleteExistingImage = async (publicIdToDelete) => {
    if (!window.confirm("Tem certeza que deseja remover esta imagem?")) {
      return;
    }

    try {
     const encodedPublicId = encodeURIComponent(publicIdToDelete);
     await axios.delete(`${API_URL}/produtos/${id}/imagens/${encodedPublicId}`);

      setProduct(prevProduct => ({
        ...prevProduct,
        imagens: prevProduct.imagens.filter(img => img.public_id !== publicIdToDelete)
      }));
      setMessage({ type: 'success', text: 'Imagem removida com sucesso!' });
    } catch (err) {
      console.error("Erro ao remover imagem:", err);
      setMessage({ type: 'danger', text: 'Erro ao remover imagem. Tente novamente.' });
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const { name, value } = e.target;

    try {
      setLoading(true);
      setError(null);

     const formData = new FormData();

       for (const key in product) {
            if (key !== 'imagens' && product[key] !== null && product[key] !== undefined) {
                  const decimalFields = [
                    'valor', 'larguraPeca', 'alturaPeca', 'profundPeca', 
                    'larguraEnvio', 'alturaEnvio', 'profundEnvio', 'pesoEnvio'
                ];

                if (decimalFields.includes(key)) {
                    const stringValue = String(product[key]).replace(',', '.'); 
                    formData.append(key, stringValue);
                } else if (key === 'quantidade') {
                    formData.append(key, String(product[key])); 
                } else {
                    formData.append(key, product[key]);
                }
            }
        }

      newImages.forEach((image, index) => {
        formData.append(`imagens`, image); 
      });

      formData.append('imagensExistentes', JSON.stringify(product.imagens));

      await axios.put(`${API_URL}/produtos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      setMessage({ type: 'success', text: 'Produto e imagens atualizados com sucesso!' });
      setTimeout(() => navigate('/editar-produtos'), 2000);

    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      setError("Erro ao atualizar produto. Verifique os dados e tente novamente.");
      setMessage({ type: 'danger', text: 'Erro ao atualizar produto.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" className="me-2" />
        Carregando dados do produto...
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate('/editar-produtos')}>
          Voltar para a lista
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Editar Produto: {product.nome}</h2>

      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
       
        <Form.Group className="mb-3" controlId="formTipo">
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            type="text"
            name="tipo"
            value={product.tipo || ''} 
            onChange={handleChange}
            required
          />
        </Form.Group>

         <Form.Group className="mb-3" controlId="formNome">
          <Form.Label>Nome do Produto</Form.Label>
          <Form.Control
            type="text"
            name="nome"
            value={product.nome || ''}
            onChange={handleChange}
            required
          />
        </Form.Group>

     
        <Form.Group className="mb-3" controlId="formDescricao">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descricao"
            value={product.descricao || ''}
            onChange={handleChange}
          />
        </Form.Group>

     
        <Form.Group className="mb-3" controlId="formValor">
          <Form.Label>Valor</Form.Label>
          <Form.Control
            type="text"
            name="valor"
            value={product.valor || ''}
            onChange={handleChange}
            required
          />
        </Form.Group>

      
        <Form.Group className="mb-3" controlId="formQuantidade">
          <Form.Label>Quantidade</Form.Label>
          <Form.Control
            type="number"
            name="quantidade"
            value={product.quantidade}
            onChange={handleChange}
            required
          />
        </Form.Group>

       
        <Form.Group className="mb-3" controlId="formLarguraPeca">
          <Form.Label>Largura da Peça (cm)</Form.Label>
          <Form.Control
            type="text"
            name="larguraPeca"
            value={product.larguraPeca || ''}
            onChange={handleChange}
            required
          />
        </Form.Group>

        
        <Form.Group className="mb-3" controlId="formAlturaPeca">
          <Form.Label>Altura da Peça (cm)</Form.Label>
          <Form.Control
            type="text"
            name="alturaPeca"
            value={product.alturaPeca ||''}
            onChange={handleChange}
            required
          />
        </Form.Group>

      
        <Form.Group className="mb-3" controlId="formProfundPeca">
          <Form.Label>Profundidade da Peça (cm)</Form.Label>
          <Form.Control
            type="text"
            name="profundPeca"
            value={product.profundPeca || ''}
            onChange={handleChange}
            required
          />
        </Form.Group>

      
        <Form.Group className="mb-3" controlId="formLarguraEnvio">
          <Form.Label>Largura para Envio (cm)</Form.Label>
          <Form.Control
            type="text"
            name="larguraEnvio"
            value={product.larguraEnvio || ''}
            onChange={handleChange}
            required
          />
        </Form.Group>

      
        <Form.Group className="mb-3" controlId="formAlturaEnvio">
          <Form.Label>Altura para Envio (cm)</Form.Label>
          <Form.Control
            type="text"
            name="alturaEnvio"
            value={product.alturaEnvio || ''}
            onChange={handleChange}
            required
          />
        </Form.Group>

       
        <Form.Group className="mb-3" controlId="formProfundEnvio">
          <Form.Label>Profundidade para Envio (cm)</Form.Label>
          <Form.Control
            type="text"
            name="profundEnvio"
            value={product.profundEnvio || ''}
            onChange={handleChange}
            required
          />
        </Form.Group>

     
        <Form.Group className="mb-3" controlId="formPesoEnvio">
          <Form.Label>Peso para Envio (kg)</Form.Label>
          <Form.Control
            type="text"
            name="pesoEnvio"
            value={product.pesoEnvio || ''}
            onChange={handleChange}
            required
          />
        </Form.Group>

      
        <hr className="my-4" />
        <h4>Imagens do Produto</h4>

       
        {product.imagens && product.imagens.length > 0 ? (
          <Row xs={1} md={3} lg={4} className="g-3 mb-4">
            {product.imagens.map((img) => (
              <Col key={img.public_id}>
                <Card>
                  <Card.Img variant="top" src={img.url} alt="Imagem do Produto" style={{ height: '150px', objectFit: 'cover' }} />
                  <Card.Body className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteExistingImage(img.public_id)}
                    >
                      Remover
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info" className="mb-3">Nenhuma imagem cadastrada para este produto ainda.</Alert>
        )}

      
        <Form.Group className="mb-3" controlId="formNewImages">
          <Form.Label>Adicionar Novas Imagens</Form.Label>
          <Form.Control
            type="file"
            multiple 
            onChange={handleNewImageChange}
            accept="image/*" 
            name="imagens"
          />
          {newImages.length > 0 && (
            <div className="mt-2">
              <small className="text-muted">{newImages.length} imagem(ns) selecionada(s).</small>
              <ul className="list-unstyled">
                {newImages.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> : ''}
          Atualizar Produto
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/editar-produtos')}>
          Cancelar
        </Button>
      </Form>
    </Container>
  );
}

export default EditProductSingle;