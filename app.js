const express = require("express");
const session = require("express-session");
var cookieParser = require('cookie-parser');
const tools = require("./tools.js");

const app = express();

app.engine('html', require('ejs').renderFile)
app.use(express.static("public"));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}));

//to be able to parse POST parameters
app.use(express.urlencoded({ extended: true }));

//route creation
app.get("/", function(req, res) {
    res.render("index", { "username": req.cookies["username"] });
});

app.get("/login", function(req, res) {
    res.render("login", { "username": req.cookies["username"] });
});

app.get("/search", async function(req, res) {
    let imageUrls = await tools.getRandomImages(req.query.keyword, 10);
    let prodDescriptions = tools.getRandomItems(10);
    res.render("search", { "username": req.cookies["username"], "keyword": req.query.keyword, "imageUrls": imageUrls, "prodDescriptions": prodDescriptions });
});

app.get("/about", function(req, res) {
    res.render("about", { "username": req.cookies["username"] });
});

app.get("/cart", function(req, res) {
    res.render("cart", { "username": req.cookies["username"] });
});

app.post("/login", async function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // console.log(" Usename entered: " + username);
    // console.log("Password entered: " + password);

    let result = await tools.checkUsername(username);

    // Check if result is null
    if (!result) {
        res.render("login", {"loginError": true});
        return;
    }

    //use dir to display an object
    // console.dir("Username query result: " + result);

    let passwordMatch = await tools.checkPassword(username, password);
    console.log("passwordMatch: " + passwordMatch);

    if (passwordMatch) {
        req.session.authenticated = true;
        res.cookie("username", result[0].username);

        if (username == "admin") {
            res.redirect("/admin");
        } else {
            res.redirect("/");
        }
    } else {
        res.render("login", {"loginError": true});
    }
});

app.get("/signup", function(req, res) {
    res.render("signup");
});

app.get("/myAccount", tools.isAuthenticated, function(req, res) {
    console.log("/myAccount called.");
    if (req.cookies["username"] == "admin") {
        res.redirect("/admin");
    } else {
        res.render("account", { "username": req.cookies["username"] });
    }
});

app.get("/admin", tools.isAuthenticated, function(req, res) {
    if (req.session.authenticated) {
        res.render("admin", { "username": req.cookies["username"] });
    } else {
        res.redirect("/logout");
    }
});

app.get("/logout", function (req, res) {
    // Delete cookies
    let cookie = req.cookies;
    for (var property in cookie) {
        if (cookie.hasOwnProperty(property)) {
            res.cookie(property, "", { expires: new Date(0) });
        }
    }

    req.session.destroy(function(err) {
        res.redirect("/");
    });
});

app.get("/api/updateCart", function(req, res) {
    res.send("COMING SOON!")
});

app.post("/api/createUser", function(req, res) {
    let userInfo = [
        req.body.firstName,
        req.body.lastName,
        req.body.streetAddress,
        req.body.city,
        req.body.state,
        req.body.zipcode
    ];

    let username = req.body.username;
    tools.createNewUser(username, req.body.password, userInfo);

    req.session.authenticated = true;
    res.cookie("username", username);

    res.render("account", { "username": req.cookies["username"] });

});

app.get("/adminApi/deleteAllUsers", function(req, res) {
    tools.deleteAllUsers();
    res.render("admin", { "status": "Deleted all users.", "username": req.cookies["username"] });
});

app.get("/adminApi/reports", async function(req, res) {
    let avgPrice = await tools.selectAvgPriceFromItemsTable();
    console.log("avgPrice: " + avgPrice);

    let numberOfUsers = await tools.selectCountFromUsersTable();
    console.log("numberOfUsers: " + numberOfUsers);

    let reportInfo = [
        avgPrice,
        numberOfUsers
    ];

    res.render("admin", { "reports": reportInfo, "username": req.cookies["username"] });
});

app.post("/adminApi/deleteUser", function(req, res) {
	let username = req.body.usernameToDelete;
    if (tools.deleteUser(username)) {
        res.render("admin", { "status": "Deleted " + username, "username": req.cookies["username"] });
    } else {
        res.render("admin", { "status": "User " + username + " not found.", "username": req.cookies["username"]});
    }
});

//server listen on localhost
//curl -v http://localhost:8081/
//for running locally
/*
app.listen("8081", "127.0.0.1", function() {
    console.log("Express Server is running...");
});
*/
// VM server listener
app.listen("8081", "0.0.0.0", function() {
     console.log("Express Server is running...");
 });

// Heroku server listener

/*app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Express Server is running...");
});*/
