const request = require("request");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const faker = require("faker");

const saltRounds = 10;

// Local VM server info
// var dbPool = mysql.createPool({
//     connectionLimit: 10,
//     host: "localhost",
//     user: "root",
//     password: "toor",
//     database: "cstbay"
// });

// Heroku DB info
var dbPool = mysql.createPool({
    connectionLimit: 10,
    host: "us-cdbr-iron-east-02.cleardb.net",
    user: "b947ffe0dec49d",
    password: "c8720a2b",
    database: "heroku_1f7357d3deb3f92"
});

// /**
//  * mysql://b947ffe0dec49d:c8720a2b@us-cdbr-iron-east-02.cleardb.net/heroku_1f7357d3deb3f92?reconnect=true
//  * @returns database connection
//  */
// function createConnection() {
//     // Local VM server info
// 	// var dbConn = mysql.createConnection({
//     //     host: "localhost",
//     //     user: "root",
//     //     password: "toor",
//     //     database: "cstbay"
//     // });
    
//     // Heroku DB info
//     // var dbConn = mysql.createConnection({
//     //      host: "us-cdbr-iron-east-02.cleardb.net",
//     //      user: "b947ffe0dec49d",
//     //      password: "c8720a2b",
//     //      database: "heroku_1f7357d3deb3f92"
//     // });

//     return dbConn;
// }

/*
 *  middleware function
 *  next is a function executed afterwards by the caller
 *  There could be several middleware calls between 
 *  the route and the anonymous function:
 */
function isAuthenticated(req, res, next) {
    if (!req.session.authenticated) {
        res.redirect("/logout");
    } else {
        next();
    }
}

// function checkUsername(username) {
//     let sql = "SELECT * FROM UserPassword WHERE username = ?";

//     return new Promise( function (resolve, reject) {
//         let conn = createConnection();
//         conn.connect(function(err) {
//             if (err) throw err;
//             conn.query(sql, [username], function(err, rows, fields) {
//                 if (err) throw err;
//                 if (rows.length == 0) {
//                     console.log("No rows returned from query")
//                     resolve(null);
//                 } else if (!rows[0].userId) {
//                     console.log("null or errant row returned from query")
//                     resolve(null);
//                 } else {
//                     // console.log("Rows found:" + rows.length);
//                     resolve(rows);
//                 }
//             });//query
//         });//connect
//     });//promise
// }

// function checkPassword(username, plainTextPassword) {
//     let sql = "SELECT passwordHash FROM UserPassword WHERE username = ?";

//     return new Promise(function(resolve, reject) {
//         let conn = createConnection();
//         conn.connect(function(err) {
//             if (err) throw err;

//             conn.query(sql, [username], function(err, rows, fields) {
//                 if (err) throw err;

//                 // Data must be explicitly casted, as query returns object
//                 let passwordHash = String(rows[0].passwordHash);

//                 bcrypt.compare(plainTextPassword, passwordHash, function(err, result) {
//                     // console.log("plainTextPassword: " + plainTextPassword + ": " + typeof plainTextPassword);
//                     // console.log("     passwordHash: " + passwordHash + ": " + typeof passwordHash);
//                     // console.log("           Result: " + result);

//                     if (err) reject(err);
//                     resolve(result);
//                 });
//             });
//         });
//     });
// }

// /**
//  * 
//  * @param {string} username 
//  * @param {string} plainTextPassword 
//  * @returns whether or not creation was successful
//  */
// function createNewUser(username, plainTextPassword) {
//     let sql = "SELECT * FROM UserPassword WHERE username = ?";

//     return new Promise (function(resolve, reject) {
//         let conn = createConnection();
//         conn.connect(function(err) {
//             if (err) throw err;

//             conn.query(sql, [username], function(err, rows, fields) {
//                 if (err) throw err;

//                 // Check if user exists with desired username
//                 if (rows.length != 0) {
//                     resolve(false);
//                     return;
//                 }

//                 let sqlInsert = "INSERT INTO UserPassword (username, passwordHash) VALUES (?, ?)";
//                 let connInsert = createConnection();
//                 connInsert.connect(function(err) {
//                     if (err) throw err;

//                     bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
//                         connInsert.query(sqlInsert, [username, hash], function(err, result) {
//                             if (err) throw err;
//                         });
//                     });
//                 });

//                 resolve(true);
//             });
//         });
//     });
// }

// function setUserPassword(username, plainTextPassword) {
//     let sql = "UPDATE UserPassword SET passwordHash = ? WHERE username = ?";

//     let conn = createConnection();
//     conn.connect(function(err) {
//         if (err) throw err;

//         bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
//             connInsert.query(sql, [hash, username], function(err, result) {
//                 if (err) throw err;
//             });
//         });
//     });
// }

// function deleteUser(username) {
//     let sql = "DELETE * FROM UserPassword WHERE username = ?";

//     let conn = createConnection();
//     conn.connect(function(err) {
//         if (err) throw err;

//         conn.query(sql, [username], function(err, result) {
//             if (err) throw err;
//         });
//     });
// }

// function deleteAllUsers() {
//     let sql = "DELETE FROM UserPassword WHERE NOT username = 'admin'";

//     let conn = createConnection();
//     conn.connect(function(err) {
//         if (err) throw err;

//         conn.query(sql, [username], function(err, result) {
//             if (err) throw err;
//         });
//     });
// }

function checkUsername(username) {
    let sql = "SELECT * FROM UserPassword WHERE username = ?";

    return new Promise( function (resolve, reject) {
        dbPool.query(sql, [username], function(err, rows, fields) {
            if (err) throw err;

            if (rows.length == 0) {
                console.log("No rows returned from query")
                resolve(null);
            } else if (!rows[0].userId) {
                console.log("null or errant row returned from query")
                resolve(null);
            } else {
                // console.log("Rows found:" + rows.length);
                resolve(rows);
            }
        });
    });
}

function checkPassword(username, plainTextPassword) {
    let sql = "SELECT passwordHash FROM UserPassword WHERE username = ?";

    return new Promise(function(resolve, reject) {
        dbPool.query(sql, [username], function(err, rows, fields) {
            if (err) throw err;

            // Data must be explicitly casted, as query returns object
            let passwordHash = String(rows[0].passwordHash);

            bcrypt.compare(plainTextPassword, passwordHash, function(err, result) {
                // console.log("plainTextPassword: " + plainTextPassword + ": " + typeof plainTextPassword);
                // console.log("     passwordHash: " + passwordHash + ": " + typeof passwordHash);
                // console.log("           Result: " + result);

                if (err) reject(err);
                resolve(result);
            });
        });
    });
}

/**
 * 
 * @param {string} username 
 * @param {string} plainTextPassword 
 * @param {string[]} userInfo contains the info submitted when signing up
 * @returns whether or not creation was successful
 */
function createNewUser(username, plainTextPassword, userInfo) {
    let sql = "SELECT * FROM UserPassword WHERE username = ?";

    return new Promise (async function(resolve, reject) {
        dbPool.query(sql, [username], function(err, rows, fields) {
            if (err) throw err;

            // Check if user exists with desired username
            if (rows.length != 0) {
                resolve(false);
                return;
            }
        });

        // Add user
        sql = "INSERT INTO UserPassword (userId, username, passwordHash) VALUES (NULL, ?, ?)";
        dbPool.query(sql, [username, "NULL_HASH"], function(err, rows, fields) {
            if (err) throw err;
        });

        // Retrieve userId
        sql = "SELECT userId FROM UserPassword WHERE username = ?";
        dbPool.query(sql, [username], function(err, rows, fields) {
            if (err) throw err;
        
            // Add user info
            sql = "INSERT INTO UserInfo (userId, firstname, lastname, streetAddress, residentCity, residentState, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?)"
            dbPool.query(sql, [rows[0].id, userInfo[0], userInfo[1], userInfo[2], userInfo[3], userInfo[4], userInfo[5]], function(err, rows, fields) {
                if (err) throw err;
            });

            // Assign user a cart
            sql = "INSERT INTO Carts (cartId, userID) VALUES (NULL, ?)";
            dbPool.query(sql, [rows[0].userId], function(err, rows, fields) {
                if (err) throw err;
            });
        });

        await setUserPassword(username, plainTextPassword);
        resolve(true);
    });
}

function setUserPassword(username, plainTextPassword) {
    let sql = "UPDATE UserPassword SET passwordHash = ? WHERE username = ?";

    return new Promise(function(resolve, reject) {
        bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
            dbPool.query(sql, [hash, username], function(err, rows, fields) {
                if (err) throw err;
                resolve(true);
            });
        });
    });
}

function deleteFromUserPasswordTable(userId) {
    return new Promise(function(resolve, reject) {
        sql = "DELETE FROM UserPassword WHERE userId = ?";
        dbPool.query(sql, userId, function(err, rows, fields) {
            if (err) throw err;
            console.log("Deleted UserPassword");
            resolve(true);
        });
    });
}

function deleteFromUserInfoTable(userId) {
    return new Promise(function(resolve, reject) {
        sql = "DELETE FROM UserInfo WHERE userId = ?";
        dbPool.query(sql, userId, function(err, rows, fields) {
            if (err) throw err;
            console.log("Deleted UserInfo");
            resolve(true);
        });
    });
}

function deleteFromItemsTableForUserId(userId) {
    return new Promise(function(resolve, reject) {
        // Retrieve cartId
        sql = "SELECT cartId FROM Carts WHERE userId = ?";
        dbPool.query(sql, userId,  function(err, cartIdResult, fields) {
            if (err) throw err;
            if (cartIdResult.length > 0) {
                let cartId = cartIdResult[0].cartId;
                sql = "DELETE FROM Items WHERE cartId = ?";
                dbPool.query(sql, cartId, function(err, rows, fields) {
                    if (err) throw err;
                    console.log("Deleted Items");
                    resolve(true);
                });
            } else {
                console.log("Did not find any Carts to delete.");
                resolve(true);
            }
       });
    });
}

function deleteFromCartsTableForUserId(userId) {
    return new Promise(function(resolve, reject) {
        // Retrieve cartId
        sql = "SELECT cartId FROM Carts WHERE userId = ?";
        dbPool.query(sql, userId,  function(err, cartIdResult, fields) {
            if (err) throw err;
            if (cartIdResult.length > 0) {
                let cartId = cartIdResult[0].cartId;
                sql = "DELETE FROM Carts WHERE cartId = ?";
                dbPool.query(sql, cartId, function(err, rows, fields) {
                    if (err) throw err;
                    console.log("Deleted Carts");
                    resolve(true);
                });
            } else {
                console.log("Did not find any Carts to delete.");
                resolve(true);
            }
       });
    });
}
function deleteUser(username) {
    // Retrieve userId
    let sql = "SELECT userId FROM UserPassword WHERE username = ?";
    let userId;
    dbPool.query(sql, [username], async function(err, userIdResult, fields) {
        if (err) throw err;
        if (userIdResult.length > 0) {
            userId = userIdResult[0].userId;
            
            await deleteFromItemsTableForUserId(userId);
            
            await deleteFromUserInfoTable(userId);

            await deleteFromUserPasswordTable(userId);

            await deleteFromCartsTableForUserId(userId);
            console.log("deleteUser done.");
            return true;
        } else {
            console.log("user " + username + " not found.");
            return false;
        }
    });
}

function deleteAllUsers() {
	//FIXME: Need to delete all carts first.
    let sql = "DELETE FROM UserPassword WHERE NOT username = 'admin'";
    dbPool.query(sql, function(err, result) {
        if (err) throw err;
    });
}

function intializeUsersTable() {
    let sql = "CREATE TABLE IF NOT EXISTS UserPassword (" +
                "userId INT AUTO_INCREMENT PRIMARY KEY," +
                "username VARCHAR(25)," +
                "passwordHash VARCHAR(100)" +
              ")";

    let conn = createConnection();
    conn.connect(function(err) {
        if (err) throw err;

        conn.query(sql, function(err, result) {
            if (err) throw err;
        });
    });
}

/**
 * Returns random image URLs from Unsplash API
 * @param {string} keyword - search term
 * @param {int} imageCount - number of random images
 * @returns array of image URLs
 */
function getRandomImages(keyword, imageCount) {
    // Provided by Unsplash
    var ACCESS_KEY = "cfe884a3195c8e9595b15ce7e4c8d8180241a4dbc319ee8516f9f93a5fe22451";
    var searchRequestUrl = "https://api.unsplash.com/photos/random?client_id=" + ACCESS_KEY + "&query=" + keyword + "&count=" + imageCount;

    return new Promise(function(resolve, reject) {
        request(searchRequestUrl, function(error, response, body) {
            // console.log("Error: ", error);
            // console.log("Status Code: ", response && response.statusCode);
            // console.log("Body: ", body);
    
            if (!error) {
                var parsedData = JSON.parse(body);
                var imageUrls = [];
    
                for (let i = 0; i < imageCount; ++i) {
                    imageUrls.push(parsedData[i].urls.regular);
                }
    
                resolve(imageUrls);
            } else {
                console.log("Error: ", error);
            }
        });
    });
}

function getRandomItems(imageCount) {
  var items = [];
  for (let i = 0; i < imageCount; ++i) {
         items.push(faker.fake("{{commerce.productAdjective}}") + " " 
                    + faker.fake("{{commerce.productMaterial}}"));
                }
  return items;
}

function selectAvgPriceFromItemsTable() {
    return new Promise(function(resolve, reject) {
        sql = "SELECT avg(price) as avgPrice FROM items";
        dbPool.query(sql, function(err, rows, fields) {
            if (err) throw err;
            if (rows.length > 0) {
                console.log("selectAvgPriceFromItemsTable: " + rows[0].avgPrice);
                resolve(rows[0].avgPrice);
            } else {
                console.log("selectAvgPriceFromItemsTable: " + 0);
                resolve(0);
            }
        });
    });
}

function selectCountFromUsersTable() {
    return new Promise(function(resolve, reject) {
        sql = "SELECT count(distinct username) as numberOfUsers FROM userpassword";
        dbPool.query(sql, function(err, rows, fields) {
            if (err) throw err;
            if (rows.length > 0) {
                console.log("selectCountFromUsersTable: " + rows[0].numberOfUsers);
                resolve(rows[0].numberOfUsers);
            } else {
                console.log("selectCountFromUsersTable: " + 0);
                resolve(0);
            }
        });
    });
}

module.exports = {
    isAuthenticated: isAuthenticated,
    checkUsername: checkUsername,
    checkPassword: checkPassword,
    setUserPassword: setUserPassword,
    createNewUser: createNewUser,
    intializeUsersTable: intializeUsersTable,
    deleteUser: deleteUser,
    deleteAllUsers: deleteAllUsers,
    getRandomImages: getRandomImages,
    getRandomItems: getRandomItems,
    dbPool: dbPool,
    selectAvgPriceFromItemsTable: selectAvgPriceFromItemsTable,
    selectCountFromUsersTable: selectCountFromUsersTable
    
}
