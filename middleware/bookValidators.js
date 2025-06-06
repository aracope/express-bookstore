const { validate } = require("jsonschema");
const booksCreateSchema = require("../jsonSchema/booksCreateSchema.json");
const booksUpdateSchema = require("../jsonSchema/booksUpdateSchema.json");

function validateBook(req, res, next) {
    const result = validate(req.body, booksCreateSchema)
    if (!result.valid) {
        const errors = result.errors.map(e => e.stack);
        return res.status(400).json({error: errors });
    }
    return next();
}

function validateBookUpdate(req, res, next) {
    const result = validate(req.body, booksUpdateSchema)
    if (!result.valid) {
        const errors = result.errors.map(e => e.stack);
        return res.status(400).json({error: errors });
    }
    return next();
}

module.exports = {
    validateBook,
    validateBookUpdate
};