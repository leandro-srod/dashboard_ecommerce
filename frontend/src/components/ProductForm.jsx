import { useRef, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Row, Col, Spinner } from 'react-bootstrap';
import axios from "axios";

function ProductForm() {

const [tipoProduto, setTipoProduto] = useState('');
const [nome, setNome] = useState('');
const [descricao, setDescricao] = useState('');
const [valor, setValor] = useState('');
const [quantidade, setQuantidade] = useState('');
const [larguraPeca, setlarguraPeca] = useState('');
const [alturaPeca, setalturaPeca] = useState('');
const [profundPeca, setprodfundPeca] = useState('');
const [larguraEnvio, setlarguraEnvio] = useState('');
const [alturaEnvio, setalturaEnvio] = useState('');
const [profundEnvio, setprofundEnvio] = useState('');
const [pesoEnvio, setpesoEnvio] = useState('');
const [imagens, setImagens] = useState([]); 
const fileInputRef = useRef(null); 
 const [isLoading, setIsLoading] = useState(false); 

const API_URL = 'http://localhost:3000';

const [mensagem, setMensagem] = useState('');
const [varianteMensagem, setVarianteMensagem] = useState('');

const alterSelect = (event) => setTipoProduto(event.target.value);

const alterNome = (event) => setNome(event.target.value);

const alterDescricao = (event) => setDescricao(event.target.value);

const alterValor = (event) => setValor(event.target.value);

const alterQuantidade = (event) => setQuantidade(event.target.value);

const alterLargura = (event) => setlarguraPeca(event.target.value);

const alterAltura = (event) => setalturaPeca(event.target.value);

const alterProfundidade = (event) => setprodfundPeca(event.target.value);

const alterLarguraEnvio = (event) => setlarguraEnvio(event.target.value);

const alterAlturaEnvio = (event) => setalturaEnvio(event.target.value);

const alterProfundidadeEnvio = (event) => setprofundEnvio(event.target.value);

const alterPesoEnvio = (event) => setpesoEnvio(event.target.value);

const alterImagens = (event) => setImagens(Array.from(event.target.files));

const submit = async (event) => {
  event.preventDefault(); 
  setIsLoading(true);

  const formData = new FormData(); 
  formData.append('tipo', tipoProduto);
  formData.append('nome', nome);
  formData.append('descricao', descricao);
  formData.append('valor', parseFloat(valor));
  formData.append('quantidade', parseInt(quantidade, 10));
  formData.append('larguraPeca', parseFloat(larguraPeca));
  formData.append('alturaPeca', parseFloat(alturaPeca));
  formData.append('profundPeca', parseFloat(profundPeca));
  formData.append('larguraEnvio', parseFloat(larguraEnvio));
  formData.append('alturaEnvio', parseFloat(alturaEnvio));
  formData.append('profundEnvio', parseFloat(profundEnvio));
  formData.append('pesoEnvio', parseFloat(pesoEnvio));
  
  imagens.forEach((imagem, index) => {
    formData.append('imagens', imagem);
  });
  
  // Enviar para backend 
  try {
    const resposta = await axios.post(`${API_URL}/produtos`, formData);
    console.log("Produto cadastrado com sucesso:", resposta.data);
    setVarianteMensagem('success');
    setMensagem("Produto Cadastrado com sucesso!");
   
  setTipoProduto('');
  setNome('');
  setDescricao('');
  setValor('');
  setQuantidade('');
  setlarguraPeca('');
  setalturaPeca('');
  setprodfundPeca('');
  setlarguraEnvio('');
  setalturaEnvio('');
  setprofundEnvio('');
  setpesoEnvio('');
  setImagens([]);

  if (fileInputRef.current) {
  fileInputRef.current.value = ''; 
    }

    setTimeout(() => {
      setMensagem('');
      setVarianteMensagem('');
    }, 5000);

  }catch(error){
    const errorMessage = error.response?.data?.message || error.message || 'Erro ao cadastrar produto.';
    console.error('Erro no envio do formulário:', errorMessage);
    setVarianteMensagem('danger');
    setMensagem("Erro ao cadastrar produto:");

    setTimeout(() => {
      setMensagem('');
      setVarianteMensagem('');
    }, 10000); 

    
  } finally {
    setIsLoading (false);
  }

};

  return (
    
    <Form className="form" onSubmit={submit} encType='multipart/form-data'> 
 
    {mensagem && (
      <Alert variant={varianteMensagem} dismissible >{mensagem}</Alert>
    )}

<a>Insira abaixo os dados do produto:</a><br></br>

 <Form.Group className="mb-3" controlId="formImagem">
        <Form.Label>Imagens: </Form.Label>
        <Form.Control 
        type="file"   
        required
        multiple
        accept="image/*"
        name="imagens" 
        onChange={alterImagens}
        ref={fileInputRef}
        />
      </Form.Group>
    
   <Row className="mb-3">
      <Form.Group as={Col} md="4" controlId="formTipo">
      <Form.Label>Tipo: </Form.Label>
      <Form.Select 
        aria-label="Selecione o tipo"
        required
        value={tipoProduto}
        onChange={alterSelect}>
        <option value="">Tipo da peça</option>
        <option value="Bolsa">Bolsa</option>
        <option value="Mochila">Mochila</option>
        <option value="Carteira">Carteira</option>
        <option value="Pochete">Pochete</option>
        <option value="Estojo">Estojo</option>
        <option value="Necessaire">Necessaire</option>
        <option value="Ecobag">Ecobag</option>
        <option value="Outro">Outro</option>
      </Form.Select>
      </Form.Group>

      
 
 <Form.Group as={Col} md="4" controlId="formValor">
        <Form.Label>Valor:</Form.Label>
        
        <Form.Control type="number" 
        required
        value={valor}
        onChange={alterValor}
        />
       
      </Form.Group>

      <Form.Group as={Col} md="4" controlId="formQtd">
        <Form.Label>Quantidade:</Form.Label>
      
        <Form.Control type="number" 
        required
        value={quantidade}
        onChange={alterQuantidade}
        />
      
      </Form.Group><br></br>
    
</Row>

<Form.Group className="mb-3" controlId="formNome">
        <Form.Label>Nome:</Form.Label>
        <Form.Control type="text" 
        required
        value={nome}
        onChange={alterNome}
        />
      </Form.Group>

<Form.Group className="mb-3" controlId="formDescricao">
        <Form.Label>Descrição: </Form.Label>
        
        <Form.Control as="textarea"
        rows={3} 
        required
        value={descricao}
        onChange={alterDescricao}
        />
        
      </Form.Group>
     
      <a>Medidas da peça - cm</a>
      
  <Row className="mb-3">
       <Form.Group as={Col} md="4" controlId="formMedidasL">
        <Form.Label>Largura</Form.Label>
        
        <Form.Control type="number" 
        required
        value={larguraPeca}
        onChange={alterLargura}/>
     
      </Form.Group>

        <Form.Group as={Col} md="4" controlId="formMedidasA">
        <Form.Label>Altura</Form.Label>
       
        <Form.Control type="number" 
        required
        value={alturaPeca}
        onChange={alterAltura}
        />
       
      </Form.Group>

        <Form.Group as={Col} md="4" controlId="formMedidasP">
        <Form.Label>Profund.</Form.Label>
       
        <Form.Control type="number" 
        required
        value={profundPeca}
        onChange={alterProfundidade}
        />
       
      </Form.Group><br></br>
</Row>

        <a>Medidas para envio - cm (pacote)</a>

<Row className="mb-3">
         <Form.Group as={Col} md="3" controlId="formMedidasEnvioL">
        <Form.Label>Largura</Form.Label>
       
        <Form.Control type="number"
        required
        value={larguraEnvio}
        onChange={alterLarguraEnvio}
        />
       
      </Form.Group>

    <Form.Group as={Col} md="3" controlId="formMedidasEnvioA">
        <Form.Label>Altura</Form.Label>   
        <Form.Control type="number" 
        required
        value={alturaEnvio}
        onChange={alterAlturaEnvio}
        />
    </Form.Group>

    <Form.Group as={Col} md="3" controlId="formMedidasEnvioP">
        <Form.Label >Profund.</Form.Label>
        <Form.Control type="number" 
        required
        value={profundEnvio}
        onChange={alterProfundidadeEnvio}
        />
    </Form.Group>


    <Form.Group as={Col} md="3" controlId="formMedidasEnvioPeso">
      <Form.Label>Peso</Form.Label>
      <Form.Control type="number" 
        required
        value={pesoEnvio}
        onChange={alterPesoEnvio}
        />
      </Form.Group>

</Row>
{ isLoading && (
<div className="d-flex justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </Spinner>
      <p className="mt-2">Cadastrando produto, por favor aguarde...</p>
    </div>
)}

<div className="d-flex justify-content-center">
      <Button variant="primary" type="submit" disabled={isLoading}>Enviar</Button></div>
    </Form>
  );
}

export default ProductForm;