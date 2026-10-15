import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosConfig";
import Movies from "../movies/Movies";

const Home = ({ updateMovieReview }) => {
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setMessage("");

      try {
        const response = await axiosClient.get("/movies");

        if (response.data.length === 0) {
          setMessage("There are currently no movies available");
        }

        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMessage("Error fetching movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <Movies
          movies={movies}
          message={message}
          updateMovieReview={updateMovieReview}
        />
      )}
    </>
  );
};

export default Home;
