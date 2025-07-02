const env = require("../env");

/**
 * 添加语言字段到用户表
 */
exports.up = async function(knex) {
  return knex.schema.table("users", table => {
    // 添加语言字段，默认使用系统默认语言
    table.string("language").defaultTo(env.DEFAULT_LANGUAGE || "en");
  });
};

/**
 * 回滚迁移 - 删除语言字段
 */
exports.down = async function(knex) {
  return knex.schema.table("users", table => {
    table.dropColumn("language");
  });
};
