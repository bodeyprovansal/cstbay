USE heroku_1f7357d3deb3f92;

DROP TABLE users;

CREATE TABLE `users` (
    `userId` int(11) NOT NULL,
    `username` varchar(25) DEFAULT NULL,
    `passwordHash` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS UserPassword (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(25),
    passwordHash VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS UserInfo (
    userId INT PRIMARY KEY,
    firstname VARCHAR(25),
    lastname VARCHAR(25),
    streetAddress VARCHAR(100),
    residentCity VARCHAR(50),
    residentState VARCHAR(25),
    zipcode char(5) DEFAULT NULL,
    FOREIGN KEY (userId) REFERENCES UserPassword(userId)
);


CREATE TABLE IF NOT EXISTS Carts (
    cartId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    FOREIGN KEY (userId) REFERENCES UserPassword(userId)
);

CREATE TABLE IF NOT EXISTS Items (
    itemId INT AUTO_INCREMENT PRIMARY KEY,
    cartId INT,
    keyword VARCHAR(25),
    price DECIMAL(5, 2),
    imageUrl VARCHAR(100),
    FOREIGN KEY (cartId) REFERENCES Carts(cartId)
);


INSERT INTO `heroku_1f7357d3deb3f92`.`users` (
    `userId`,
    `username`,
    `passwordHash`
)
VALUES (
    1,
    'admin',
    '$2a$10$2gqjHOVB4dkRuDQJjLiQduP6J6JQfYFVvdukF2fYlYH3lWh21YI96'
);

INSERT INTO `UserPassword`(`userId`, `username`, `passwordHash`) VALUES (
    NULL,
    'admin',
    '$2a$10$2gqjHOVB4dkRuDQJjLiQduP6J6JQfYFVvdukF2fYlYH3lWh21YI96'
);

