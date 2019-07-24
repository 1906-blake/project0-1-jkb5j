
INSERT INTO reimbursement(author,amount,dateSubmitted,dateResolved,description,resolver,status,type)
	VALUES((Select user_id From res_user where firstName='Ginyu'),2000,TO_DATE('17/12/2015', 'DD/MM/YYYY')
		 	,TO_DATE('25/1/2016', 'DD/MM/YYYY'),'Test',
		   (Select user_id From res_user where firstName='Ginyu'),
		   (Select status_id From reimbursement_status where status='Approved'),
			(Select type_id From reimbursement_type where type='Sensu Beans'));
			

INSERT INTO reimbursement(author,amount,dateSubmitted,dateResolved,description,resolver,status,type)
	VALUES((Select user_id From res_user where firstName='Nappa'),23330,TO_DATE('12/11/2017', 'DD/MM/YYYY')
		 	,TO_DATE('02/01/2018', 'DD/MM/YYYY'),'Test',
		   (Select user_id From res_user where firstName='Ginyu'),
		   (Select status_id From reimbursement_status where status='Pending'),
			(Select type_id From reimbursement_type where type='Frieza Bucks'));
			

			
INSERT INTO reimbursement(author,amount,dateSubmitted,dateResolved,description,resolver,status,type)
	VALUES((Select user_id From res_user where firstName='King'),3330,TO_DATE('12/11/2017', 'DD/MM/YYYY')
		 	,TO_DATE('02/01/2018', 'DD/MM/YYYY'),'Test',
		   (Select user_id From res_user where firstName='Ginyu'),
		   (Select status_id From reimbursement_status where status='Denied'),
			(Select type_id From reimbursement_type where type='Learn Pose'));	
			
INSERT INTO reimbursement(author,amount,dateSubmitted,dateResolved,description,resolver,status,type)
	VALUES((Select user_id From res_user where firstName='Broly'),3330,TO_DATE('01/02/1993', 'DD/MM/YYYY')
		 	,TO_DATE('02/01/2018', 'DD/MM/YYYY'),'Test',
		   (Select user_id From res_user where firstName='Ginyu'),
		   (Select status_id From reimbursement_status where status= 'Pending'),
			(Select type_id From reimbursement_type where type='DargonBall'));



		 
select * from reimbursement;

select * from res_user;

select firstName, lastName,author,amount,dateSubmitted,dateResolved,description,resolver,status,type
from reimbursement left join res_user on reimbursement.author = res_user.user_id;

select*  from reimbursement;
--TRUNCATE TABLE reimbursement;

