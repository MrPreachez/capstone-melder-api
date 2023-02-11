/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("results", (table) => {
    table.increments("id").primary();
    table
      .integer("project_id").unsigned()
      .references("projects.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.text("result").notNullable();
    table.timestamps(true, true)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("results");
};
