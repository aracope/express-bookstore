/** Common config for bookstore. */
require("dotenv").config();

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.DATABASE_URL_TEST;
} else {
  DB_URI = process.env.DATABASE_URL;
}


module.exports = { DB_URI };

