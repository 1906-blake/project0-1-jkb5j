INSERT INTO role(role_name) VALUES ('Captian'), ('Sub Captian'), ('Grunt');

--Reimbursement types 
INSERT INTO reimbursement_type(type) VALUES ('Frieza Bucks'), ('Sensu Beans'), ('DargonBall'), ('Learn Pose');

SELECT * FROM reimbursement_type;


--reimbursement_status
INSERT INTO reimbursement_status(status) VALUES ('Approved'), ('Pending'), ('Denied');

SELECT * FROM reimbursement_status;

--users
INSERT INTO res_user(username, password, firstname, lastname, email, role)
	         VALUES ('capG', 'pass', 'Ginyu', 'Change', 'Posemaster@gfroce.com', (SELECT role_id FROM role WHERE role_name = 'Captian')),
					('rickFlareWhoo', 'pass1', 'Jeice', 'Warrior', 'Dripp.Too.HArd@gmail.com', (SELECT role_id FROM role WHERE role_name = 'Sub Captian')),
					('ova9000', 'thugnificent', 'Nappa', 'Cold', 'back.break@gmail.com', (SELECT role_id FROM role WHERE role_name = 'Sub Captian')),
					('legendary', 'pass2', 'Broly', 'Smash', 'gforce@gmail.com', (SELECT role_id FROM role WHERE role_name = 'Grunt'));

SELECT * FROM res_user;

