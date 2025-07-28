import Produto from "../models/Product.js";
import cloudinary from "../config/cloudinaryConfig.js";
import mongoose from "mongoose";

class ProdutoController {

  // Lista todas os produtos do Banco de Dados ----------------------------------------------------------------

  static async listarProdutos(req, res) {
    try {
      const listaProdutos = await Produto.find({}).lean();
      const listaProdutosFormatada = listaProdutos.map(produto => {
        return {
          ...produto,
          // Converte para string
          valor: produto.valor ? produto.valor.toString() : '0.00',
          larguraPeca: produto.larguraPeca ? produto.larguraPeca.toString() : '0',
          alturaPeca: produto.alturaPeca ? produto.alturaPeca.toString() : '0',
          profundPeca: produto.profundPeca ? produto.profundPeca.toString() : '0',
          larguraEnvio: produto.larguraEnvio ? produto.larguraEnvio.toString() : '0',
          alturaEnvio: produto.alturaEnvio ? produto.alturaEnvio.toString() : '0',
          profundEnvio: produto.profundEnvio ? produto.profundEnvio.toString() : '0',
          pesoEnvio: produto.pesoEnvio ? produto.pesoEnvio.toString() : '0',
        };
      });

      res.status(200).json(listaProdutosFormatada);
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - Falha ao buscar produtos.` });
    }
  };

  // Cadastra novo produto - MongoDB e Cloudinary --------------------------------------------------------------

  static async cadastrarProduto(req, res) {
    try {
      console.log('--- Início de cadastrarProduto ---');
      console.log('req.body:', req.body);
      console.log('req.files:', req.files);

      const { files } = req;

      const {
        tipo, nome, descricao, valor, quantidade, larguraPeca, alturaPeca, profundPeca,
        larguraEnvio, alturaEnvio, profundEnvio, pesoEnvio
      } = req.body;

      const imagensData = [];

      if (files) {
        for (const file of files) {
          console.log(`Processando arquivo: ${file.originalname}, tipo: ${file.mimetype}`);
          file.buffer.toString('base64');
          const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
            folder: 'ecommerce_prizoca'
          });
          imagensData.push({
            url: result.secure_url,
            public_id: result.public_id
          });
        }
      } else {
        console.log('Nenhum arquivo de imagem recebido.');
      }

      const novoProduto = new Produto({
        tipo, nome, descricao,
        valor: valor !== undefined && valor !== null && valor !== '' ? mongoose.Types.Decimal128.fromString(valor.toString()) : mongoose.Types.Decimal128.fromString('0.00'),
        quantidade: parseInt(quantidade) || 0,
        larguraPeca: larguraPeca !== undefined && larguraPeca !== null && larguraPeca !== '' ? mongoose.Types.Decimal128.fromString(larguraPeca.toString()) : mongoose.Types.Decimal128.fromString('0'),
        alturaPeca: alturaPeca !== undefined && alturaPeca !== null && alturaPeca !== '' ? mongoose.Types.Decimal128.fromString(alturaPeca.toString()) : mongoose.Types.Decimal128.fromString('0'),
        profundPeca: profundPeca !== undefined && profundPeca !== null && profundPeca !== '' ? mongoose.Types.Decimal128.fromString(profundPeca.toString()) : mongoose.Types.Decimal128.fromString('0'),
        larguraEnvio: larguraEnvio !== undefined && larguraEnvio !== null && larguraEnvio !== '' ? mongoose.Types.Decimal128.fromString(larguraEnvio.toString()) : mongoose.Types.Decimal128.fromString('0'),
        alturaEnvio: alturaEnvio !== undefined && alturaEnvio !== null && alturaEnvio !== '' ? mongoose.Types.Decimal128.fromString(alturaEnvio.toString()) : mongoose.Types.Decimal128.fromString('0'),
        profundEnvio: profundEnvio !== undefined && profundEnvio !== null && profundEnvio !== '' ? mongoose.Types.Decimal128.fromString(profundEnvio.toString()) : mongoose.Types.Decimal128.fromString('0'),
        pesoEnvio: pesoEnvio !== undefined && pesoEnvio !== null && pesoEnvio !== '' ? mongoose.Types.Decimal128.fromString(pesoEnvio.toString()) : mongoose.Types.Decimal128.fromString('0'),
        imagens: imagensData,
      });

      // Salvar no MongoDB
      const produtoSalvo = await novoProduto.save();
      console.log("Produto cadastrado com sucesso:", produtoSalvo);
      res.status(201).json(produtoSalvo);

    } catch (error) {
      console.error('--- Erro em cadastrarProduto ---');
      console.error('Mensagem de erro completa:', error.message);
      console.error('Detalhes do erro (stack trace):', error.stack);

      let errorMessage = 'Erro desconhecido ao cadastrar produto.';
      if (error.name === 'ValidationError') {
        errorMessage = `Erro de validação: ${error.message}`;
      } else if (error.code === 11000) {
        errorMessage = 'Produto já existe (duplicidade de campo único).';
      } else if (error.message.includes('Decimal128')) {
        errorMessage = 'Erro de formato numérico. Verifique os valores monetários/dimensionais.';
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      res.status(400).json({ message: errorMessage });
    }
  }

  // Exclui produto por ID -----------------------------------------------------------------------------------------

  static async excluirProduto(req, res) {
    try {
      const { id } = req.params;
      const produtoParaExcluir = await Produto.findById(id);
      if (!produtoParaExcluir) {
        return res.status(404).json({ message: "Produto não encontrado para exclusão." });
      }
      const publicIds = produtoParaExcluir.imagens.map(img => img.public_id);
      if (publicIds.length > 0) {
        try {
          const result = await cloudinary.api.delete_resources(publicIds);
          console.log("Imagens do Cloudinary deletadas:", result);

        } catch (cloudinaryError) {
          console.error("Erro ao deletar imagens do Cloudinary:", cloudinaryError);
        }
      }
      const produtoExcluido = await Produto.findByIdAndDelete(id);

      if (!produtoExcluido) {
        return res.status(404).json({ message: "Produto não encontrado ou já excluído." });
      }

      res.status(200).json({ message: "Produto excluído com sucesso e imagens removidas do Cloudinary." });
    } catch (erro) {
      console.error("Erro no backend ao excluir produto:", erro);
      res.status(500).json({ message: `${erro.message} - Falha ao excluir produto.` });
    }
  }

  // Atualiza produto por ID -----------------------------------------------------------------------------------------

  static async atualizarProduto(req, res) {
    try {
      const { id } = req.params;
      const { imagensExistentes, ...dadosProduto } = req.body;

      console.log('----------------------------------------------------');
      console.log('Recebendo requisição PUT para produto ID:', id);
      console.log('Dados do produto (exceto imagens):', dadosProduto);
      console.log('Imagens existentes (string JSON):', imagensExistentes);
      console.log('Novas imagens (via Multer req.files):', req.files);

      let imagensParaManter = [];
      if (imagensExistentes) {
        try {
          imagensParaManter = JSON.parse(imagensExistentes);
          console.log('Imagens existentes parseadas:', imagensParaManter);
        } catch (parseError) {
          console.error("ERRO: Falha ao parsear imagensExistentes:", parseError);
          return res.status(400).json({ message: "Dados de imagens existentes inválidos." });
        }
      }

      let novasImagensUpload = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          console.log('Nome do arquivo:', file.originalname);
          console.log('Mimetype do arquivo:', file.mimetype);

          const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

          const result = await cloudinary.uploader.upload(dataUri, {
            resource_type: "auto",
            folder: "prizoca_products"
          });

          novasImagensUpload.push({
            url: result.secure_url,
            public_id: result.public_id
          });
          console.log('Upload Cloudinary OK, Public ID:', result.public_id);
        }
      }

      const todasImagens = [...imagensParaManter, ...novasImagensUpload];
      console.log('Todas as imagens combinadas:', todasImagens);

      const dadosParaAtualizar = {};
      for (const key in dadosProduto) {
        const decimal128Fields = [
          'valor', 'larguraPeca', 'alturaPeca', 'profundPeca',
          'larguraEnvio', 'alturaEnvio', 'profundEnvio', 'pesoEnvio'
        ];

        if (decimal128Fields.includes(key)) {
          const stringValue = dadosProduto[key];
          if (stringValue !== undefined && stringValue !== null && stringValue !== '') {
            dadosParaAtualizar[key] = mongoose.Types.Decimal128.fromString(stringValue.toString());
          } else {
            dadosParaAtualizar[key] = mongoose.Types.Decimal128.fromString('0');
          }
        } else if (key === 'quantidade') {
          dadosParaAtualizar[key] = parseInt(dadosProduto[key]) || 0;
        } else {
          dadosParaAtualizar[key] = dadosProduto[key];
        }
      }

      dadosParaAtualizar.imagens = todasImagens;



      const produtoAtualizado = await Produto.findByIdAndUpdate(
        id,
        dadosParaAtualizar,
        { new: true, runValidators: true }
      );

      if (!produtoAtualizado) {
        console.log('Produto não encontrado para atualização no DB.');
        return res.status(404).json({ message: "Produto não encontrado para atualização." });
      }

      console.log('Produto atualizado com sucesso:', produtoAtualizado._id);

      const produtoFormatado = {
        ...produtoAtualizado._doc,
        valor: produtoAtualizado.valor ? produtoAtualizado.valor.toString() : '0.00',
        larguraPeca: produtoAtualizado.larguraPeca ? produtoAtualizado.larguraPeca.toString() : '0',
        alturaPeca: produtoAtualizado.alturaPeca ? produtoAtualizado.alturaPeca.toString() : '0',
        profundPeca: produtoAtualizado.profundPeca ? produtoAtualizado.profundPeca.toString() : '0',
        larguraEnvio: produtoAtualizado.larguraEnvio ? produtoAtualizado.larguraEnvio.toString() : '0',
        alturaEnvio: produtoAtualizado.alturaEnvio ? produtoAtualizado.alturaEnvio.toString() : '0',
        profundEnvio: produtoAtualizado.profundEnvio ? produtoAtualizado.profundEnvio.toString() : '0',
        pesoEnvio: produtoAtualizado.pesoEnvio ? produtoAtualizado.pesoEnvio.toString() : '0',
      };

      res.status(200).json({ message: "Produto atualizado com sucesso!", produto: produtoAtualizado });

    } catch (erro) {
      console.error("ERRO FATAL ao atualizar produto:", erro);
      let errorMessage = 'Erro desconhecido ao atualizar produto.';
      if (erro.name === 'ValidationError') {
        errorMessage = `Erro de validação: ${erro.message}`;
      } else if (erro.message.includes('Decimal128')) {
        errorMessage = 'Erro de formato numérico. Verifique os valores monetários/dimensionais.';
      } else if (erro.response && erro.response.data && erro.response.data.message) {
        errorMessage = erro.response.data.message;
      } else {
        errorMessage = erro.message;
      }
      res.status(400).json({ message: errorMessage });
    }
  }


  // --- DELETAR IMAGEM ESPECÍFICA DO PRODUTO ---
  static async excluirImagemDoProduto(req, res) {
    try {
      const { id, publicId } = req.params;

      const produto = await Produto.findById(id);

      if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      // Remove a imagem do Cloudinary
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Imagem com public_id ${publicId} deletada do Cloudinary.`);
        } catch (cloudinaryError) {
          console.error(`Erro ao deletar imagem ${publicId} do Cloudinary:`, cloudinaryError);
        }
      }

      const imagensAtualizadas = produto.imagens.filter(img => img.public_id !== publicId);

      produto.imagens = imagensAtualizadas;
      await produto.save();

      res.status(200).json({ message: "Imagem removida do produto com sucesso!" });

    } catch (erro) {
      console.error("Erro no backend ao excluir imagem do produto:", erro);
      res.status(500).json({ message: `${erro.message} - Falha ao excluir imagem do produto.` });
    }
  }

  // Lista Produto por ID -------------------------------------------------------------------------------
  static async listarProdutoPorId(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findById(id).lean();

      if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      const produtoFormatado = {
        ...produto, //
        valor: produto.valor ? produto.valor.toString() : '0.00',
        larguraPeca: produto.larguraPeca ? produto.larguraPeca.toString() : '0',
        alturaPeca: produto.alturaPeca ? produto.alturaPeca.toString() : '0',
        profundPeca: produto.profundPeca ? produto.profundPeca.toString() : '0',
        larguraEnvio: produto.larguraEnvio ? produto.larguraEnvio.toString() : '0',
        alturaEnvio: produto.alturaEnvio ? produto.alturaEnvio.toString() : '0',
        profundEnvio: produto.profundEnvio ? produto.profundEnvio.toString() : '0',
        pesoEnvio: produto.pesoEnvio ? produto.pesoEnvio.toString() : '0',
      };

      res.status(200).json(produtoFormatado);
    } catch (erro) {
      console.error("Erro no backend ao buscar produto por ID:", erro);
      if (erro.name === 'CastError') {
        return res.status(400).json({ message: "ID de produto inválido." });
      }
      res.status(500).json({ message: `${erro.message} - Falha ao buscar produto.` });
    }
  };
};


export default ProdutoController;