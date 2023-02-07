const knex = require("knex")(require("../knexfile"));

const addProject = async (req, res) => {
  const { creator_name, project_name, question } = req.body;
  await knex("projects").insert({
    creator_name,
    project_name,
    question,
  });
  const [{ project_id }] = await knex("projects").select("id as project_id").orderBy("id", "desc").limit(1);
  res.status(200).json({project_id});
};

const getProject = async (req, res) => {
    try {
        const data = await knex("projects").where({ id: req.params.id });
        if (!data.length) {
            return res.status(404).send(`Record with id: ${req.params.id} is not found`);
        }
        return res.status(200).json(data[0]);
    } catch (err) {
        return res.status(400).send(`Error retrieving project ${req.params.id} ${err}`);
    }
};
    




module.exports = {
  addProject,
  getProject
};
