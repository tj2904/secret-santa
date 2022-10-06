import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import "../components/app.css";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoutes from "./PrivateRoutes";
import Login from "./auth/Login";
import ConfirmMagicLink from "./auth/ConfirmMagicLink";
import NameReveal from "./NameReveal";
import SnowFlakes from "./Snowflakes";

function App() {
  return (
    <>
      <SnowFlakes />
      <Container
        className="d-flex justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-75">
          <AuthProvider>
            <Router>
              <Routes>
                <Route element={<PrivateRoutes />}>
                  {/* <Route path="/profile" element={<Profile />} /> */}
                  <Route path="/reveal" element={<NameReveal />} />
                </Route>
                <Route path="/" element={<Login />} />
                <Route path="/confirm" element={<ConfirmMagicLink />} />
                {/* <Route path="/home" element={<Home />} /> */}
                <Route path="/login" element={<Login />} />
              </Routes>
            </Router>
          </AuthProvider>
        </div>
        <div id="footer" className="text-center">
          A Tim Jackson Passion Project
        </div>
      </Container>
    </>
  );
}

export default App;
