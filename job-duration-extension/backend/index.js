const express = require("express"),
    passport = require("passport"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    middlewares = require("./middlewares"),
    credentials = require("./credentials");
const app = express();

/**
 * STEP 1. Check if user has entered client id and secret
 * **/
app.get("/auth", function (req, res) {
    const cloudhost = req.headers["cloudhost"];
    const account = req.headers["account"];

    const areCredentialsProvided = credentials.client_credentials[cloudhost] && credentials.client_credentials[cloudhost][account];

    areCredentialsProvided
        ? res.status(200).send("Client is already configured")
        : res.status(404).send({})
});

/**
 * STEP 2. Save client id and secret entered by user
 * **/
app.post("/configure/", bodyParser.urlencoded({ extended: false }), function (req, res) {
    const cloudhost = req.body["cloudHost"];
    const account = req.body["account"];
    const clientId = req.body["clientId"];
    const clientSecret = req.body["clientSecret"];
    const configuration = { client_id: clientId, client_secret: clientSecret };

    credentials.add_configuration(cloudhost, account, configuration);

    return res.status(200).send({});
});

/**
 * STEP 3. Create refresh token using client id and secret saved in last step
 * **/
app.get("/api/me", middlewares.authenticate, function (req, res) {
    res.json(req.access_token);
    return res.status(200).send(res.access_token);
});

/**
 * STEP 4. Initialise express node server to listen http request.
 * **/
app.use(session({ secret: "process", resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

exports.initialize = () => app;