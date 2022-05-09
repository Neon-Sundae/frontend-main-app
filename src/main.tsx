import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { NewUser, Home, Login } from "./pages";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home />} />
      <Route path="/new-user" element={<NewUser />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);
