import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddEditUser from "./pages/AddEditUser";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEditUser />} />
          <Route path="/update/:id" element={<AddEditUser />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
