import mongoose from "mongoose";

const imagemSchema = new mongoose.Schema({
    url: {type: String, required: true},
    public_id: {type: String, required: true}
}, {_id: false});

const produtoSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId}, 
    tipo: {type: String, required: true},
    nome: {type: String, required: true, trim: true},
    descricao: {type: String, required: true} ,
    valor: {  type: mongoose.Schema.Types.Decimal128, required: true},
    quantidade: {type: Number, required: true, min:1},
    larguraPeca: {  type: mongoose.Schema.Types.Decimal128, required: true},
    alturaPeca: {  type: mongoose.Schema.Types.Decimal128, required: true},
    profundPeca: {  type: mongoose.Schema.Types.Decimal128, required: true},
    larguraEnvio:{  type: mongoose.Schema.Types.Decimal128, required: true},
    alturaEnvio: {  type: mongoose.Schema.Types.Decimal128, required: true},
    profundEnvio:{  type: mongoose.Schema.Types.Decimal128, required: true},
    pesoEnvio:{  type: mongoose.Schema.Types.Decimal128, required: true},
    imagens: {type: [imagemSchema], default: []},
    ativo: {type: Boolean, default: true}
}, {versionKey: false, collection: 'produtos', timestamps: true});

const produto = mongoose.model("produto", produtoSchema );
export default produto;