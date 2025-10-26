// Import the express library
const express = require("express");
const passport = require("passport");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Environment configuration
require("./config/db-config");
require("./config/passport");

// Initializing the app
const app = express();

// express.json()
// Built-in middleware to parse the request body as JSON.
// Allows client-sent JSON data to be accessed directly via request.body
app.use(express.json());
app.use(passport.initialize());

// ROUTING
const UserRouter = require("./routes/user-route");
const RestaurantRouter = require("./routes/restaurant-route");
const MenuRouter = require("./routes/menu-route");

app.use("/users", UserRouter);
app.use("/restaurants", RestaurantRouter);
app.use("/menus", MenuRouter);

// SWAGGER
// Load swagger.yaml
const swaggerDocument = YAML.load('./swagger.yaml');
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
const server = app.listen(8080, (err) => {
    console.log("Server running on http://localhost:8080");
});



module.exports = {
    app,
    server,
}