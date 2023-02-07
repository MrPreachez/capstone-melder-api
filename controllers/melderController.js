const knex = require("knex")(require("../knexfile"));
const axios = require("axios");

const addProject = async (req, res) => {
  try {
    const { creator_name, project_name, question } = req.body;
    await knex("projects").insert({
      creator_name,
      project_name,
      question,
    });
    const [{ project_id }] = await knex("projects")
      .select("id as project_id")
      .orderBy("id", "desc")
      .limit(1);
    res.status(200).json({ project_id });
  } catch (err) {
    res.status(400).send(`Error inserting project ${err}`);
  }
};

const getProject = async (req, res) => {
  try {
    const data = await knex("projects").where({ id: req.params.id });
    if (!data.length) {
      return res
        .status(404)
        .send(`Record with id: ${req.params.id} is not found`);
    }
    return res.status(200).json(data[0]);
  } catch (err) {
    return res
      .status(400)
      .send(`Error retrieving project ${req.params.id} ${err}`);
  }
};

const addResponse = async (req, res) => {
  try {
    const { respondent_name, response_input, project_id } = req.body;
    await knex("responses").insert({
      respondent_name,
      response_input,
      project_id,
    });
    res.status(200).json({message: "Insert successful"});
  } catch (err) {
    res.status(400).send(`Error inserting project ${err}`);
  }
};
 
const addResult = async (req, res) => {
    try {
        const project_id = req.body.project_id;
        const responses = await knex
        .select()
        .from("responses")
        .where({ project_id });

   const responseTexts = responses.map((r) => r.response_input);
   const requestBody = JSON.stringify({
    prompt: "Please write a summary of the statements that shares insight and ways to bring about improvement to the given situation";
    responses: responseTexts
   });

   const apiResponse = await axios.post(process.env.API_URL, requestBody, {
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`,
    },
   });
   const result = apiResponse.data.choices[0].text;

   await knex("results").insert({
    project_id,
    result,
   });

   res.status(200).json({mesage: "Result added successfully"});
} catch (err) {
    res.status(400).send(`Error generating result: ${err}`)
}
};

const getResult = async (req, res) => {
    try {
        const data = await knex("results").where({ project_id: req.params.id });
        if (!data.length) {
          return res
            .status(404)
            .send(`Result with project_id: ${req.params.id} is not found`);
        }
        return res.status(200).json(data[0]);
      } catch (err) {
        return res
          .status(400)
          .send(`Error retrieving result with project_id: ${req.params.id} ${err}`);
      }
    };

module.exports = {
  addProject,
  getProject,
  addResponse,
  addResult,
  getResult,
};
