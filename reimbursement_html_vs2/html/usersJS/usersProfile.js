function safeAddUserRow(user) {
    console.log(user);
    if(!user) {
        return;
    }
    const tableContainer = document.getElementById('user-table-container');
    const tableBody = tableContainer.childNodes[1].childNodes[3];
    
    const row = document.createElement('tr');
    tableBody.appendChild(row);
    
    const usernameData = document.createElement('td');
    usernameData.setAttribute('id', 'usernameData');
    usernameData.innerText = user.username;
    usernameData.contentEditable = true;
    row.appendChild(usernameData);

    const firstNameData = document.createElement('td');
    firstNameData.setAttribute('id', 'firstNameData');
    firstNameData.innerText = user.firstName;
    firstNameData.contentEditable = true;
    row.appendChild(firstNameData);

    const lastNameData = document.createElement('td');
    lastNameData.setAttribute('id', 'lastNameData');
    lastNameData.innerText = user.lastName;
    lastNameData.contentEditable = true;
    row.appendChild(lastNameData);

    const emailData = document.createElement('td');
    emailData.setAttribute('id', 'emailData');
    emailData.innerText = user.email;
    emailData.contentEditable = true;
    row.appendChild(emailData);

    const roleData = document.createElement('td');
    roleData.innerText = user.role.role;
    row.appendChild(roleData);

}
const myUser = JSON.parse(localStorage.getItem('user'));
async function loadUserInfoData(userId) {
    const resp = await fetch(`http://localhost:8012/users/${userId}`, {
        credentials: 'include'
    });
    const users = await resp.json();
    console.log(users);
    safeAddUserRow(users); // only one user so no need for foreach
    //users.forEach(safeAddUserRow);
}
loadUserInfoData(myUser.userId);
function safeAddReimbursementRow(reimbursement) {
    console.log(reimbursement);
    if(!reimbursement) {
        return;
    }
    const tableContainer = document.getElementById('my-reimbursement-table-container');
    const tableBody = tableContainer.childNodes[1].childNodes[3];

    const row = document.createElement('tr');
    tableBody.appendChild(row);
    
    const authorData = document.createElement('td');
    authorData.innerText = reimbursement.author.username;
    row.appendChild(authorData);

    const amountData = document.createElement('td');
    amountData.innerText = reimbursement.amount;
    row.appendChild(amountData);

    const dateSubmittedData = document.createElement('td');
    dateSubmittedData.innerText = reimbursement.dateSubmitted ? new  Date(reimbursement.dateSubmitted ).toDateString():'~' ;
    row.appendChild(dateSubmittedData);

    const dateResolvedData = document.createElement('td');
    dateResolvedData.innerText = reimbursement.dateResolved ? new  Date(reimbursement.dateResolved ).toDateString():'~';
    row.appendChild(dateResolvedData);

    const descriptionData = document.createElement('td');
    descriptionData.innerText = reimbursement.description;
    row.appendChild(descriptionData);

    const resolverData = document.createElement('td');
    resolverData.innerText = reimbursement.resolver && reimbursement.resolver.username;
    row.appendChild(resolverData);

    const statusData = document.createElement('td');
    statusData.innerText = reimbursement.status.status;
    row.appendChild(statusData);

    const reimbursementTypeData = document.createElement('td');
    reimbursementTypeData.innerText = reimbursement.type.type;
    row.appendChild(reimbursementTypeData);

}

function updateType(event) {
    console.log(event);
    const dropdown = document.getElementById('type-select');
    //dropdown.innerText = event.target.innerText;
    console.log('drop ' + dropdown.value);//dropdown.options[dropdown.selectedIndex].value); // returns nothing
}
function submitNewReimbursement(event) {
    event.preventDefault(); // prevent the default functionality causing the page to refresh
    console.log('adding new reimbursement from form data');
    const reimbursementAmount = document.getElementById('reimbursement-amount-input').value;
    const reimbursementDescription = document.getElementById('reimbursement-description-input').value;
    const reimbursementType = +document.getElementById('type-select').value;
    const reimbursement = {
        author: {
            userId: myUser.userId
        },
        amount: reimbursementAmount,
        // look into auto putting in date
        dateSubmitted: getCurrentDateTime(),//reimbursementDateSubmitted,
        description: reimbursementDescription,
        status: {
            statusId: 1
        },
        type: {
            typeId: reimbursementType
        }
    };
    safeAddReimbursementRow(reimbursement); 
}

async function loadUserReimbursementData(userId) {
    const resp = await fetch(`http://localhost:8012/reimbursements/author/userId/${+userId}`, {
        credentials: 'include'
    });
    const users = await resp.json();
    //deletePreviousRows();
    users.forEach(safeAddReimbursementRow);
}
loadUserReimbursementData(user.userId);
function getCurrentDateTime(){
    let d = new Date();
    //return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    return d.toISOString();
}     //2019-07-18 12:23:54

async function updateUser() {
    const username = document.getElementById('usernameData').innerText;
    const firstName = document.getElementById('firstNameData').innerText;
    const lastName = document.getElementById('lastNameData').innerText;
    const email = document.getElementById('emailData').innerText;
    const user = {
        userId: myUser.userId, 
        username, firstName, lastName, email
    };
    try {
        const resp = await fetch('http://localhost:8012/users', {
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.log(err);
    }
}
async function updatePassword() {
    const passwordPrompt = prompt('Enter new password');
    if(passwordPrompt) {
        const user = {
            userId: myUser.userId,
            password: passwordPrompt
        }
        try {
            const resp = await fetch('http://localhost:8012/users', {
                method: 'PATCH',
                credentials: 'include',
                body: JSON.stringify(user),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}
async function postReimbursement(event) {
    event.preventDefault();
    console.log('attempting to post reimbursement');
    const reimbursementAmount = document.getElementById('reimbursement-amount-input').value;
    const reimbursementDescription = document.getElementById('reimbursement-description-input').value;
    // const reimbursementType = document.getElementById('type-dropdown').value; // is null right now
    const reimbursementType = document.getElementById('type-select').value;
    const reimbursement = {
        author: {
            userId: myUser.userId
        },
        amount: reimbursementAmount,
        // look into auto putting in date
        dateSubmitted: getCurrentDateTime(),//reimbursementDateSubmitted,
        description: reimbursementDescription,
        status: {
            statusId: 2
        },
        type: {
            typeId:reimbursementType
            // type: reimbursementType //not sure why it's tripping
        }
    };
    try {
        const resp = await fetch('http://localhost:8012/reimbursements', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(reimbursement),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const user = await resp.json();
        localStorage.setItem('user', JSON.stringify(user));
        // window.location = '/html/user-about.html' // navigate pages
    } catch (err) {
        console.log(err);
        console.log('invalid credentials')
        const errorElement = document.getElementById('error-message')
        errorElement.innerText = 'Invalid Credentials';
        errorElement.style.color = 'red';
    }
}