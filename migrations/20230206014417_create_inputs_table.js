/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("responses", (table) => {
    table.increments("id").primary();
    table.string("respondent_name", 255).notNullable();
    table.string("response_input", 500).notNullable();
    table
      .integer("projects_id")
      .references("projects.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("responses");
};
