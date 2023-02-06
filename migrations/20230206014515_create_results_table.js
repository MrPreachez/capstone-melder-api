/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("results", (table) => {
    table.increments("id").primary();
    table
      .integer("projects_id")
      .references("projects.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("result", 3000).notNullable();
    table.timestamps(true, true)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("responses");
};
