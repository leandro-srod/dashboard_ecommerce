import multer from "multer";

const storage = multer.memoryStorage(); // Aloca na memória RAM os arquivos

const upload = multer({
    storage: storage,
    limits:{ fileSize: 10 * 1024 * 1024}, //Limite de 10MB por imagem
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')){
            cb(null, true);
        }else{
            cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
    }
});

const uploadImages = upload.array('imagens', 5); // Campo de formulário 'imagens'

export default uploadImages;