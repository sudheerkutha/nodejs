const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const databasePath = path.join(__dirname, 'moviesData.db')
const app = express()
app.use(express.json())
let database = null
const initializeDbandServere = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running...')
    })
  } catch (error) {
    console.log(`DB Error ${error.message}`)
    process.exit(1)
  }
}
initializeDbandServere()

app.get('/movies/', async (request, response) => {
  const getMoivieNames = `SELECT movie_name FROM movie;`
  const moviesArray = await database.all(getMoivieNames)
  response.send(
    moviesArray.map(eachMovie => ({movieName: eachMovie.movie_name})),
  )
})
app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const postNewMovie = `INSERT INTO movie (director_id,movie_name,lead_actor) VALUES (${directorId},'${movieName}','${leadActor}');`
  const movie = await database.run(postNewMovie)
  response.send('Movie Successfully Added')
})
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getmovieQuery = `SELECT * FROM movie WHERE movie_id=${movieId};`
  const movie = await database.get(getmovieQuery)
  response.send(movie)
})
app.put('/movies/:movieId/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const {movieId} = request.params
  const updateMovieQuery = `UPDATE movie SET director_id=${directorId},movie_name='${movieName}',lead_actor='${leadActor}' WHERE movie_id=${movieId};`
  await database.run(updateMovieQuery)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deletemovieQuery = `DELETE FROM movie WHERE movie_id=${movieId};`
  await database.run(deletemovieQuery)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, responce) => {
  const getDriectorName = `SELECT * FROM director`
  const directorArray = await database.all(getDriectorName)
  responce.send(
    directorArray.map(eachDirector => ({
      directorId: eachDirector.director_id,
      directorName: eachDirector.director_name,
    })),
  )
})

app.get('/directors/:directorId/movies/', async (request, responce) => {
  const {directorId} = request.body
  const getMovieName = `SELECT * FROM movie WHERE director_id=${directorId}`
  const movieArray = await database.all(getMovieName)
  responce.send(movieArray)
})

module.exports = app
