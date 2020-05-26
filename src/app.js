const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', repoExists)

function repoExists(req, res, next) { 
  const { id } = req.params

  const repoIndex = repositories.findIndex(repository => repository.id === id)

  if (repoIndex < 0) 
    return res.status(400).json({ error: 'Repository not found!'})
  
  res.locals.repoIndex = repoIndex
  return next()
}

const repositories = [];

app.get("/repositories", (req, res) => {
  
  return res.json(repositories)
}); 

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body
  const repo = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repo)

  return res.status(200).json(repo)
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params
  const { title, url, techs } = req.body

  const repoIndex = res.locals.repoIndex
  const repo = { 
    id, 
    title, 
    url, 
    techs, 
    likes: repositories[repoIndex].likes
  }
  
  repositories[repoIndex] = repo

  return res.status(200).json(repo)
});

app.delete("/repositories/:id", (req, res) => {
  
  repositories.splice(res.locals.repoIndex, 1)

  return res.status(204).send()
  
});

app.post("/repositories/:id/like", (req, res) => {

  const repoIndex = res.locals.repoIndex
  const repo = repositories[repoIndex]

  let likesUp = repo.likes

  const newRepo = {
    ...repo,
    likes: ++likesUp
  }

  repositories[repoIndex] = newRepo

  return res.json(newRepo)
});

module.exports = app;
