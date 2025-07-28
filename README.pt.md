### Dashboard E-commerce

Português | **[English](README.md)**

Este é o projeto de dashboard para um e-commerce, desenvolvido para gerenciar produtos de forma eficiente. 
Ele permite visualizar, cadastrar, editar e excluir produtos, incluindo o gerenciamento de suas imagens.

### Tecnologias Utilizadas
Este projeto foi construído com as seguintes tecnologias:

### Frontend:
- React: Biblioteca JavaScript para construção de interfaces de usuário.
- Vite: Um bundler e ferramenta de desenvolvimento frontend extremamente rápido, usado para otimizar o processo de desenvolvimento e build.
- React Router DOM: Para roteamento e navegação entre as páginas.
- React-Bootstrap: Componentes React construídos com Bootstrap para um desenvolvimento responsivo e rápido.
- Axios: Cliente HTTP para fazer requisições à API do backend.

### Backend:
- Node.js: Ambiente de execução JavaScript.
- Express.js: Framework web para Node.js, utilizado para construir a API RESTful.
- Mongoose: ODM (Object Data Modeling) para MongoDB, facilitando a interação com o banco de dados.
- Multer: Middleware para Node.js, usado para manipular upload de arquivos.
- Cloudinary: Serviço de gerenciamento de imagens na nuvem, utilizado como banco de dados de imagens e para processamento de mídia. A SDK do Cloudinary é integrada ao backend para facilitar as operações de upload, exclusão e transformação de imagens.
- Dotenv: Para carregar variáveis de ambiente de um arquivo .env.

### Banco de Dados:
- MongoDB Atlas: Banco de dados NoSQL baseado em nuvem.

### Funcionalidades
- Listagem de Produtos: Visualize todos os produtos cadastrados no sistema, incluindo suas imagens.
- Visualização Detalhada do Produto: Acesse informações específicas de cada produto e suas imagens.
- Cadastro de Produtos: Adicione novos produtos com todos os seus detalhes e faça o upload de múltiplas imagens, que são armazenadas no Cloudinary.
- Edição de Produtos: Atualize informações de produtos existentes e gerencie suas imagens (adicionar novas imagens ao Cloudinary e excluir imagens existentes do Cloudinary).
- Exclusão de Produtos: Remova produtos do sistema, o que também aciona a exclusão de suas imagens correspondentes no Cloudinary.

### Rotas da API (Backend)
- GET /produtos: Lista todos os produtos.
- GET /produtos/:id: Retorna um produto específico pelo ID.
- POST /produtos: Cadastra um novo produto com imagens (multipart/form-data). As imagens são enviadas para o Cloudinary.
- PUT /produtos/:id: Atualiza um produto existente (incluindo adição de novas imagens ao Cloudinary).
- DELETE /produtos/:id: Exclui um produto e suas imagens correspondentes do Cloudinary.
- DELETE /produtos/:id/imagens/:publicId: Exclui uma imagem específica de um produto do Cloudinary.

### Estrutura do Projeto
.
├── backend/
│   ├── src/
│   │   ├── config/ (configurações do Cloudinary, DB)
│   │   ├── controllers/ (lógica de negócio das rotas)
│   │   ├── middlewares/ (upload de imagens com Multer)
│   │   ├── models/ (esquemas do Mongoose)
│   │   └── routes/ (definição das rotas da API)
│   │   └── app.js (configuração principal do Express)
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── assets/ (imagens, ícones)
│   │   ├── components/ (componentes reutilizáveis como Header, Cards)
│   │   ├── pages/ (páginas específicas como CadastroProduto, EdicaoProduto)
│   │   ├── services/ (conexão com a API)
│   │   ├── App.js (componente principal)
│   │   ├── index.js (renderização do React)
│   │   └── App.css (estilos globais/customizados)
│   ├── .gitignore
│   ├── .eslint.config.js
│   ├── .index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js 
└── README.md

### Contribuição

- Sinta-se à vontade para contribuir com o projeto!