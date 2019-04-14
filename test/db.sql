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

insert into Users (id, firstname, lastname) values (1, 'John', 'Smith');
insert into Users (id, firstname, lastname) values (2, 'Sebastiano', 'Blaine');
insert into Users (id, firstname, lastname) values (3, 'Letti', 'Drysdall');
insert into Users (id, firstname, lastname) values (4, 'Walker', 'Skeemer');
insert into Users (id, firstname, lastname) values (5, 'Bernette', 'Yitzhakof');
insert into Users (id, firstname, lastname) values (6, 'Welsh', 'Miners');
insert into Users (id, firstname, lastname) values (7, 'Jacquette', 'Marcum');
insert into Users (id, firstname, lastname) values (8, 'Rurik', 'Falkus');
insert into Users (id, firstname, lastname) values (9, 'Bertie', 'Jurges');
insert into Users (id, firstname, lastname) values (10, 'Dael', 'Snoad');
insert into Users (id, firstname, lastname) values (11, 'Jacklin', 'Menpes');
insert into Users (id, firstname, lastname) values (12, 'Nanny', 'Mundy');
insert into Users (id, firstname, lastname) values (13, 'Dasya', 'Sully');
insert into Users (id, firstname, lastname) values (14, 'Leroi', 'Sabattier');
insert into Users (id, firstname, lastname) values (15, 'Abby', 'Chilton');
insert into Users (id, firstname, lastname) values (16, 'Kizzie', 'Mickelwright');
insert into Users (id, firstname, lastname) values (17, 'Tova', 'Fearfull');
insert into Users (id, firstname, lastname) values (18, 'Hardy', 'Croote');
insert into Users (id, firstname, lastname) values (19, 'Perry', 'Vignaux');
insert into Users (id, firstname, lastname) values (20, 'Mycah', 'Dobrovsky');
insert into Users (id, firstname, lastname) values (21, 'Lisha', 'Wiersma');
insert into Users (id, firstname, lastname) values (22, 'Rafaelia', 'Schurcke');
insert into Users (id, firstname, lastname) values (23, 'Lari', 'Shawe');
insert into Users (id, firstname, lastname) values (24, 'Yvon', 'Scotchforth');
insert into Users (id, firstname, lastname) values (25, 'Demetre', 'Andrasch');
insert into Users (id, firstname, lastname) values (26, 'Jaquenetta', 'Greenly');
insert into Users (id, firstname, lastname) values (27, 'Lawton', 'Bispo');
insert into Users (id, firstname, lastname) values (28, 'Billye', 'Allanson');
insert into Users (id, firstname, lastname) values (29, 'Zorana', 'Gunney');
insert into Users (id, firstname, lastname) values (30, 'Carley', 'Minchi');
insert into Users (id, firstname, lastname) values (31, 'Alisun', 'McManus');
insert into Users (id, firstname, lastname) values (32, 'Ferris', 'Kryzhov');
insert into Users (id, firstname, lastname) values (33, 'Byrle', 'Eagleton');
insert into Users (id, firstname, lastname) values (34, 'Prudence', 'De Pietri');
insert into Users (id, firstname, lastname) values (35, 'Kinsley', 'Snedker');
insert into Users (id, firstname, lastname) values (36, 'Bucky', 'Dyer');
insert into Users (id, firstname, lastname) values (37, 'Marika', 'Boone');
insert into Users (id, firstname, lastname) values (38, 'Ricardo', 'Petty');
insert into Users (id, firstname, lastname) values (39, 'Yolanda', 'Rollitt');
insert into Users (id, firstname, lastname) values (40, 'Robinet', 'Wysome');
insert into Users (id, firstname, lastname) values (41, 'Tina', 'Sherrott');
insert into Users (id, firstname, lastname) values (42, 'Lorry', 'Daws');
insert into Users (id, firstname, lastname) values (43, 'Randolph', 'MacArdle');
insert into Users (id, firstname, lastname) values (44, 'Quinn', 'Aingell');
insert into Users (id, firstname, lastname) values (45, 'Galvan', 'Dubber');
insert into Users (id, firstname, lastname) values (46, 'Cybill', 'Benjafield');
insert into Users (id, firstname, lastname) values (47, 'Lavinie', 'Calwell');
insert into Users (id, firstname, lastname) values (48, 'Eberhard', 'Pickles');
insert into Users (id, firstname, lastname) values (49, 'Lynnett', 'Shellibeer');
insert into Users (id, firstname, lastname) values (50, 'Ingar', 'Hellikes');
INSERT INTO `Groups` (Name) VALUES("Admin");
INSERT INTO `Groups` (Name) VALUES("Mod");
INSERT INTO `Groups` (Name) VALUES("Tech");
INSERT INTO `Groups` (Name) VALUES("User");
insert into UserGroups (userid, groupid) values (1, 1);
insert into UserGroups (userid, groupid) values (2, 1);
insert into UserGroups (userid, groupid) values (3, 4);
insert into UserGroups (userid, groupid) values (4, 2);
insert into UserGroups (userid, groupid) values (5, 3);
insert into UserGroups (userid, groupid) values (6, 4);
insert into UserGroups (userid, groupid) values (7, 3);
insert into UserGroups (userid, groupid) values (8, 4);
insert into UserGroups (userid, groupid) values (9, 3);
insert into UserGroups (userid, groupid) values (10, 4);
insert into UserGroups (userid, groupid) values (11, 3);
insert into UserGroups (userid, groupid) values (12, 2);
insert into UserGroups (userid, groupid) values (13, 1);
insert into UserGroups (userid, groupid) values (14, 3);
insert into UserGroups (userid, groupid) values (15, 3);
insert into UserGroups (userid, groupid) values (16, 2);
insert into UserGroups (userid, groupid) values (17, 4);
insert into UserGroups (userid, groupid) values (18, 4);
insert into UserGroups (userid, groupid) values (19, 3);
insert into UserGroups (userid, groupid) values (20, 3);
insert into UserGroups (userid, groupid) values (21, 3);
insert into UserGroups (userid, groupid) values (22, 1);
insert into UserGroups (userid, groupid) values (23, 1);
insert into UserGroups (userid, groupid) values (24, 4);
insert into UserGroups (userid, groupid) values (25, 3);
insert into UserGroups (userid, groupid) values (26, 2);
insert into UserGroups (userid, groupid) values (27, 1);
insert into UserGroups (userid, groupid) values (28, 1);
insert into UserGroups (userid, groupid) values (29, 1);
insert into UserGroups (userid, groupid) values (30, 1);
insert into UserGroups (userid, groupid) values (31, 3);
insert into UserGroups (userid, groupid) values (32, 3);
insert into UserGroups (userid, groupid) values (33, 3);
insert into UserGroups (userid, groupid) values (34, 1);
insert into UserGroups (userid, groupid) values (35, 1);
insert into UserGroups (userid, groupid) values (36, 2);
insert into UserGroups (userid, groupid) values (37, 4);
insert into UserGroups (userid, groupid) values (38, 4);
insert into UserGroups (userid, groupid) values (39, 4);
insert into UserGroups (userid, groupid) values (40, 3);
insert into UserGroups (userid, groupid) values (41, 1);
insert into UserGroups (userid, groupid) values (42, 1);
insert into UserGroups (userid, groupid) values (43, 4);
insert into UserGroups (userid, groupid) values (44, 3);
insert into UserGroups (userid, groupid) values (45, 3);
insert into UserGroups (userid, groupid) values (46, 4);
insert into UserGroups (userid, groupid) values (47, 3);
insert into UserGroups (userid, groupid) values (48, 2);
insert into UserGroups (userid, groupid) values (49, 2);
insert into UserGroups (userid, groupid) values (50, 2);