const { json } = require("express");
var express = require("express");
var router = express.Router();
const request = require("request");
const { route } = require("../app");

const apiKey = "a652c8c3329eef61f12c39e414711e75";
const apiBaseUrl = "http://api.themoviedb.org/3";
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = "http://image.tmdb.org/t/p/w300";

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  request.get(nowPlayingUrl, (err, response, movieData) => {
    const { results } = JSON.parse(movieData);
    res.render("index", { movies: results });
  });
});

router.get("/movie/:id", (req, res, next) => {
  const id = req.params.id;
  const movieUrl = `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`;
  request.get(movieUrl, (error, response, data) => {
    const movieData = JSON.parse(data);
    // console.log(movieData);
    res.render("single-movie", { movieData });
  });
});

router.post("/search", (req, res, next) => {
  const movieSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/movie/search/${cat}?query=${movieSearchTerm}&api_key=${apiKey}`;
  request.get(movieUrl, (error, response, results) => {
    const movies = JSON.parse(results);
    console.log(movies);
    movies.success
      ? res.render("index", { movies })
      : res.send("no movie found");
  });
});

module.exports = router;
