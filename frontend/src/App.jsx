import { useState } from "react";
import "./App.css";
import { Button } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Homepage />} />
        <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </>
  );
}

export default App;
