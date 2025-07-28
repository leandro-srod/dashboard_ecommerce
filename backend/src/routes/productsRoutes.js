import express from "express";
import ProdutoController from "../controllers/produtoController.js";
import uploadImages from "../middlewares/uploadImages.js";

const routes = express.Router();

routes.get("/", ProdutoController.listarProdutos);
routes.get("/:id", ProdutoController.listarProdutoPorId);

routes.post("/", uploadImages, ProdutoController.cadastrarProduto);

routes.delete("/:id", ProdutoController.excluirProduto);
routes.delete("/:id/imagens/:publicId", ProdutoController.excluirImagemDoProduto);

routes.put("/:id", uploadImages, ProdutoController.atualizarProduto);

export default routes;