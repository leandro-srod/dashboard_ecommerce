import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Header from "./components/Header.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <Router> 
      <div className="site-wrapper"> 
        
        <div className="header">
          <Header />
        </div>

        <main className="main-content">
          <AppRoutes />
        </main>

        <div className="footer">
          <p>&copy; 2025 Dashboard E-commerce.</p>
        </div>
      </div>
    </Router>
  );
}

export default App;
