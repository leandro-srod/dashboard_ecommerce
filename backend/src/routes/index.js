import express from "express";
import rotasDeProdutos from "./productsRoutes.js";

const routes = (app) => {
    app.route("/").get( (req, res) => res.status(200).send("Bem-vindo à API de Prizoca E-commerce") );
    app.use("/produtos", rotasDeProdutos);
};

export default routes;