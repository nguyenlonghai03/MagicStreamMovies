import "./App.css";
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import { Route, Routes, useNavigate } from "react-router-dom";
import Register from "./components/register/Register";
import Layout from "./components/Layout";
import RequiredAuth from "./components/RequiredAuth";
import Recommended from "./components/recommended/Recommended";
import Review from "./components/review/Review";
import useAuth from "./hook/useAuth";
import axiosClient from "./api/axiosConfig";
import StreamMovie from "./components/stream/StreamMovie";
import Login from "./components/login/Login";

function App() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  console.log("auth", auth);

  const updateMovieReview = (imdb_id) => {
    navigate(`/review/${imdb_id}`);
  };

  const handleLogout = async () => {
    try {
      const response = await axiosClient.post("/logout", {
        user_id: auth.user_id,
      });
      console.log(response.data);
      setAuth(null);

      navigate("/login");
      // localStorage.removeItem('user');
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <Header handleLogout={handleLogout} />
      <Routes path="/" element={<Layout />}>
        <Route
          path="/"
          element={<Home updateMovieReview={updateMovieReview} />}
        ></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route element={<RequiredAuth />}>
          <Route path="/recommended" element={<Recommended />} />
          <Route path="/review/:imdb_id" element={<Review />} />
          <Route path="/stream/:yt_id" element={<StreamMovie />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
