"use strict";

const axios = require("axios");
const express = require("express");
const server = express();
const pg = require("pg");
const cors = require("cors");
server.use(express.json());
server.use(cors());
require("dotenv").config();

let PORT = process.env.PORT || 3001;
const APIKEY = process.env.API;
server.get("/", homeHandle);
server.get("/trending", trendHandle);
server.get('/favlist', farListHandle);
server.post("/addMovie", addHandle);
server.delete("/deleteMovie/:id", deleteHandle);
server.get("*", defaultRoute);
server.use(errorHandler);
const client = new pg.Client(process.env.DATABASE_URL);

function defaultRoute(req, res) {
  res.status(404).send("Page Not Found choose onther one");
}
function homeHandle(req, res) {
  res.status(200).send("Hello form the Home Route");
}

function farListHandle(req, res){
    const sql = `SELECT * FROM movies`;
    client.query(sql).then((data)=>{
        res.send(data.rows);
    })
    .catch((error) =>{
        errorHandler(error, req, res);
    })
}

function addHandle(req, res) {
  console.log("The requset come from FE");
  console.log(req.body);
  const favMovie = req.body;
  const sql = `INSERT INTO movies(id, title, poster_path, overview, textUser)
  VALUES ($1,$2, $3, $4, $5);`;
  const values = [favMovie.id, favMovie.title, favMovie.poster_path, favMovie.overview, favMovie.textUser];
  client
    .query(sql, values)
    .then((data) => {
      res.status(202).send("Successful");
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function deleteHandle(req, res) {
  const id = req.params.id;
  const sql = `DELETE FROM movies WHERE id = ${id}`;
  client
    .query(sql)
    .then((data) => {
      res.send(data.rows);
      console.log("Data from DB", data.rows);
    })
    .catch((error) => {
      errorHandler(error, erq, res);
    });
}

function trendHandle(req, res) {
  const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${APIKEY}&language=en-US`;
  try {
    axios
      .get(url)
      .then((respons) => {
        let mapMovie = respons.data.results.map((item) => {
          const movie = new Movie(item.id,item.title,item.poster_path,item.overview);
          return movie;
        });
        res.send(mapMovie);
      })
      .catch((error) => {
        console.log("The Error is: ", error);
        res.status(500).send(error);
      });
  } catch (error) {
    errorHandler(error, req, res);
  }
}

function Movie(id, title, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

function errorHandler(error, req, res) {
  const err = {
    status: 500,
    message: error,
  };
  res.status(500).send(err);
}
client.connect().then(() => {
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT} I am ready`);
  });
});
