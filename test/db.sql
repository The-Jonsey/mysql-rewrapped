DROP TABLE IF EXISTS `UserGroups`;

DROP TABLE IF EXISTS `Users`;

DROP TABLE IF EXISTS `Groups`;

CREATE TABLE `Users` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`firstname` TEXT NOT NULL,
	`lastname` TEXT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Groups` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`Name` TEXT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `UserGroups` (
	`userid` INT NOT NULL,
	`groupid` INT NOT NULL,
	PRIMARY KEY (`userid`,`groupid`)
);

ALTER TABLE `UserGroups` ADD CONSTRAINT `UserGroups_fk0` FOREIGN KEY (`userid`) REFERENCES `Users`(`id`);

ALTER TABLE `UserGroups` ADD CONSTRAINT `UserGroups_fk1` FOREIGN KEY (`groupid`) REFERENCES `Groups`(`id`);

INSERT INTO `Users` (firstname, lastname) VALUES("John", "Smith");
INSERT INTO `Groups` (Name) VALUES("Admin");
INSERT INTO `UserGroups` VALUES(1, 1);