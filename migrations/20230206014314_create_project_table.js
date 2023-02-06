/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("projects", (table) => {
    table.increments("id").primary();
    table.string("creator_name", 255).notNullable(),
      table.string("project_name", 255).notNullable();
    table.string("question", 500).notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("projects");
};
