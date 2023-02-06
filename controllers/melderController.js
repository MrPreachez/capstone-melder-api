const knex = require("knex")(require("../knexfile"));

const addProject = (req, res) => {
  const { creator_name, project_name, question } = req.body;
  knex("projects")
  .insert({
    creator_name,
    project_name,
    question
  })
  .then(() => {
    knex.raw("SELECT LAST_INSERT_ID() as project_id")
    .then(projectId => {
        res.status(200).json({
            project_id:projectId[0][0].project_id
        });
    })
  });
};
// const getProject = (req, res) => {

// }

module.exports = {
  addProject,
};
