console.log('reached submit page');


const fullUser = JSON.parse(localStorage.getItem('user'));
// if (user) {
//     document.getElementById('userId').innerText = (` ${user.userId}`);
// }

const reimAuthor = document.getElementById('author');
reimAuthor.value = fullUser.userId;

async function submitReimbursement(event) {
    
    event.preventDefault();
    console.log('attempting to submit');

    const reimType = document.getElementById('reimbursementType').value;
    const reimDescription = document.getElementById('description').value;
    const reimDateSubmitted = document.getElementById('dateSubmitted[type="Date"]').value;
    console.log(reimDateSubmitted);
    const reimHours = document.getElementById('amount').value;

    const reimbursement = {
        ...reimbursement,
        reimbursementId: 0,
        author: {
            userId: myUser.userId
        },
        amount: reimbursementAmount,
        dateSubmitted:  getCurrentDateTime(),//reimbursementDateSubmitted,,
      //  dateResolved: reimDateSubmitted,
        description: reimDescription,
        status: {
            statusId: 1
        }, 
        type: {
            typeId: reimbursementType
        }
    }

    try {
        const res = await fetch('http://localhost:8012/reimbursement', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(reimbursement),
            headers: {
                'content-type': 'application/json'
            }
        });

        console.log(reimbursement);

    } catch (err) {
        console.log(err);
        console.log('failed to submit');
        // const errElement = document.getElementById('error-message');
        // errElement.innerText = 'Invalid Credentials';
        // errElement.style.color = 'red';
    };
};