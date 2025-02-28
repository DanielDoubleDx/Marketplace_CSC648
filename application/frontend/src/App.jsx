import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Member1 from "./pages/Member1";
import Member2 from "./pages/Member2";
import Member3 from "./pages/Member3";
import Member4 from "./pages/Member4";
import Member5 from "./pages/Member5";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg transition duration-300"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded-lg transition duration-300"
        >
          About
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/member1" element={<Member1 />} />
        <Route path="/member2" element={<Member2 />} />
        <Route path="/member3" element={<Member3 />} />
        <Route path="/member4" element={<Member4 />} />
        <Route path="/member5" element={<Member5 />} />
      </Routes>
    </Router>
  );
}

export default App;
