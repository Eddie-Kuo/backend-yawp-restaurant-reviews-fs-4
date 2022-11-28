const pool = require('../utils/pool');

class Restaurant {
  id;
  name;
  cuisine;
  cost;
  image;
  constructor({ id, name, cuisine, cost, image }) {
    this.id = id;
    this.name = name;
    this.cuisine = cuisine;
    this.cost = cost;
    this.image = image;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * from restaurants');
    return rows.map((row) => new Restaurant(row));
  }
}

module.exports = { Restaurant };
