import {Routes, Route, Navigate} from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import EditProduct from "../components/EditProduct.jsx";
import EditProductSingle from "../components/EditProductSingle.jsx";

function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={ <Navigate to="/cadastrar-produtos" replace />} />
            <Route path="/cadastrar-produtos" element={<ProductForm />} /> 
            <Route path="/editar-produtos" element={<EditProduct />} />
            <Route path="/editar-produto/:id" element={<EditProductSingle />} />   
            <Route path="*" element={<h2>404 - Página Não Encontrada</h2>} />
        </Routes>
   );
   }

   export default AppRoutes;