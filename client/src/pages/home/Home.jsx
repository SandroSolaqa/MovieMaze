import React, { useEffect, useState } from "react";
import classes from "./Home.module.css";
import axios from "axios";

import Searchbar from "../../components/searchbar/Searchbar";
import MovieRow from "../../components/movie-row/MovieRow";

import Navbar from "../../components/navbar/Navbar";
import { useMovies } from "../../context/movies/movieState";
import { useAuth } from "../../context/auth/authState";
import Footer from "../../components/footer/Footer";
import Preloader from "./../../components/preloader/Preloader";
import Notification from "../../services/NotificationService";

import { API_KEY } from "../../services/Api";
import { BASE_URL } from "../../services/Api";


const Home = () => {
  const { token } = useAuth();

  const {
    //mostPopular,
    //latestReleases,
    //topRated,
    recommended,
    homePageMovies,
    searchResults,
    getRecommended,
    genreMovies
  } = useMovies();


  const [mostPopular, setmostPopular] = useState([]);
  const [latestReleases, setlatestReleases] = useState([]);
  const [topRated, settopRated] = useState([]);

  const fetchmostPopular = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
      setmostPopular(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  const fetchlatestReleases = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
      setlatestReleases(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  const fetchtopRated = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
      settopRated(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchmostPopular();
    fetchlatestReleases();
    fetchtopRated();

  }, []);


  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await homePageMovies();
        await getRecommended();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        Notification.show({
          message: error,
          status: false,
        });
      }
    };
    fetchData();
  }, [token]);

  let content;

  if (isLoading) {
    content = <Preloader />;
  } else {
    content = (
      <div className={classes.Home}>
        <Navbar />
        <div className={classes.imageBackground}></div>
        <div className={classes.searchbar}>
          <Searchbar />
        </div>
        <div>
          <MovieRow
            pathname=""
            title="Search Results"
            movies={searchResults}
            alternateMsg={
              searchResults.length === 0 &&
              "Search for a movie name to get results"
            }
          />
          {token && (
            <MovieRow
              pathname=""
              title="Recomended"
              movies={recommended}
              alternateMsg={"Surf more to get recommendations"}
            />
          )}
            <MovieRow
              limit
              pathname="/mostpopular"
              title="Most Popular"
              movies={mostPopular}
            />
          
            <MovieRow
              limit
              pathname="/latestmovies"
              title="Latest Release"
              movies={latestReleases}
            />
          
            <MovieRow
              limit
              pathname="/toprated"
              title="Top Rated"
              movies={ topRated }
            />
          
          {
            genreMovies.map((genreObj) => (
                  <MovieRow key={ genreObj.id }
                    pathname=""
                    title={ genreObj.genre }
                    movies={ genreObj.movies }
                  />
            ))
          }
        </div>
        <Footer />
      </div>
    );
  }
  return content;
};

export default Home;
