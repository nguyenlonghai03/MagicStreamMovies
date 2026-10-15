import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { useEffect, useState } from "react";
import Movies from "../movies/Movies";

const Recommended = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchRecommendMovies = async () => {
      setLoading(true);
      setMessage("");

      try {
        const response = await axiosPrivate.get("/recommendedmovies");
        setMovies(response.data);
      } catch (error) {
        console.log("Err fetching recommended movies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendMovies();
  }, []);

  return (
    <>
      {loading ? <>Loading...</> : <Movies movies={movies} message={message} />}
    </>
  );
};

export default Recommended;
