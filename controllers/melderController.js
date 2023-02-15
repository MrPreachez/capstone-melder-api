const knex = require("knex")(require("../knexfile"));
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const addProject = async (req, res) => {
  try {
    const { creator_name, project_name, response_type, question } = req.body;
    await knex("projects").insert({
      creator_name,
      project_name,
      response_type,
      question,
    });
    const [{ project_id }] = await knex("projects")
      .select("id as project_id")
      .orderBy("id", "desc")
      .limit(1);
    res.status(201).json({ project_id });
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
    res.status(200).json({ message: "Insert successful" });
  } catch (err) {
    res.status(400).send(`Error inserting project ${err}`);
  }
};

//API call to openAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const addResult = async (req, res) => {
  try {
    const project_id = req.params.id;
    const responses = await knex
      .select("*")
      .from("responses")
      .where({ project_id });
    console.log(responses);
    const responseType = responses.map((r) => r.response_type);
    const responseTexts = responses.map((r) => r.response_input);
    const prompt = responseType.concat(responseTexts);

    const apiResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `input: ${prompt}`,
      max_tokens: 4000,
      temperature: 0.9,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      // stop: ["input:"],
    });
    if (!apiResponse) {
      return res.status(400).send("Error generating result: Result not found");
    }
    console.log(apiResponse.data.choices[0].text);
    const result = apiResponse.data.choices[0].text;
    await knex("results").insert({
      project_id,
      result,
    });
    res.status(200).json({ mesage: "Result added successfully" });
  } catch (err) {
    res.status(400).send(`Error generating result: ${err}`);
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

const getResponses = async (req, res) => {
  try {
    const projectId = req.params.id;
    const responses = await knex("responses")
      .where({ project_id: projectId })
      .select("*");
    if (!responses.length) {
      return res
        .status(404)
        .send(`Record with id: ${req.params.id} is not found`);
    }
    return res.status(200).json(responses);
  } catch (err) {
    return res
      .status(400)
      .send(`Error retrieving project ${req.params.id} ${err}`);
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await knex("projects").select("*");
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to retrieve projects" });
  }
};

//work in progress for efficiency
const getAllProjectData = async (req, res) => {
  try {
    const allProjectData = await knex("projects")
      .select(
        "projects.id as project_id",
        "creator_name",
        "project_name",
        "question",
        "response_type",
        "respondent_name",
        "response_input",
        "result"
      )
      .join("responses", "projects.id", "responses.project_id")
      .join("results", "projects.id", "results.project_id")
      .where("projects.id", req.params.id);
    res.json(allProjectData);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to retrieve allProjectData" });
  }
};

module.exports = {
  addProject,
  getProject,
  addResponse,
  addResult,
  getResult,
  getResponses,
  getAllProjects,
  getAllProjectData,
};
