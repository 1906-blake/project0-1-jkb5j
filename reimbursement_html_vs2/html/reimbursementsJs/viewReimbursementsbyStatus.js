function safeAddReimbursementRow(reimbursement) {
    console.log(reimbursement);
    if(!reimbursement) {
        return;
    }
    const tableContainer = document.getElementById('reimbursement-table-container');
    const tableBody = tableContainer.childNodes[1].childNodes[3];

    const row = document.createElement('tr');
    row.setAttribute('data-id', reimbursement.reimbursementId);
    tableBody.appendChild(row);

    const reimbursement_ID = document.createElement('td');
    reimbursement_ID.innerText = reimbursement.reimbursementId;
    row.appendChild(reimbursement_ID);

    const authorData = document.createElement('td');
    authorData.innerText = reimbursement.author.firstName;
    row.appendChild(authorData);

    const amountData = document.createElement('td');
    amountData.innerText = reimbursement.amount;
    row.appendChild(amountData);

    const dateSubmittedData = document.createElement('td');
    dateSubmittedData.innerText = reimbursement.dateSubmitted ? new  Date(reimbursement.dateSubmitted ).toDateString():'~';
    row.appendChild(dateSubmittedData);

    const dateResolvedData = document.createElement('td');
    dateResolvedData.innerText = reimbursement.dateResolved ? new Date(reimbursement.dateResolved).toDateString(): '~'; //to date string add to other dates
    row.appendChild(dateResolvedData);

    const descriptionData = document.createElement('td');
    descriptionData.innerText = reimbursement.description;
    row.appendChild(descriptionData);

    const resolverData = document.createElement('td');
    resolverData.innerText = reimbursement.resolver && reimbursement.resolver.firstName;
    row.appendChild(resolverData);

    const statusData = document.createElement('td');
    if(+reimbursement.status.statusId === 2) {
        statusData.innerHTML = `
        <div class="btn-group">
            <button type="button" id='status-dropdown-${reimbursement.reimbursementId}' class="btn btn-secondary dropdown-toggle"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Pending 
            </button>
            <div class="dropdown-menu" onclick="updateType(event, ${reimbursement.reimbursementId})">
                <a class="dropdown-item" value='1' >Approved</a>
                <a class="dropdown-item" value='3' >Denied</a>
            </div>
        </div>`;
    } else {
        statusData.innerText = reimbursement.status.status;
    }
    row.appendChild(statusData);

    const reimbursementTypeData = document.createElement('td');
    reimbursementTypeData.innerText = reimbursement.type.type;
    row.appendChild(reimbursementTypeData);

}

function deletePreviousRows() {
    const tableContainer = document.getElementById('reimbursement-table-container');
    const tableBody = tableContainer.childNodes[1].childNodes[3];
    while(tableBody.firstChild) { // remove previous rows
        tableBody.removeChild(tableBody.firstChild);
    }
}

const myUser = JSON.parse(localStorage.getItem('user'));
async function updateType(event, id) {
    console.log(event);
    const dropdown = document.getElementById(`status-dropdown-${id}`);
    dropdown.innerText = event.target.innerText;
    const reimbursement = {
        reimbursementId: id,
        resolver: {
            userId: myUser.userId
            //user_id: myUser.user_id
        },
        dateResolved: getCurrentDateTime(),
        status: {
            statusId: dropdown.innerText === 'Approved' ? 1 : 3
        }
    }
    try {
        const resp = await fetch('http://localhost:8012/reimbursements', {
            method: 'PATCH',
            credentials: 'include',
            // body: JSON.stringify(user), //just test
            body: JSON.stringify(reimbursement),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.log(err);
    }
}
async function loadStatusData(status) {
    const resp = await fetch(`http://localhost:8012/reimbursements/status/${status}`, {
        method: 'GET', //just testing
        credentials: 'include'
    });
    const users = await resp.json();
    console.log(users);
    deletePreviousRows();
    users.forEach(safeAddReimbursementRow);
}

async function loadUserData(user_id) {
    const resp = await fetch(`http://localhost:8012/reimbursements/author/userid/${+user_id}`, {
        method: 'GET', //just testing
        credentials: 'include'
    });
    const users = await resp.json();
    console.log(users);
    deletePreviousRows();
    users.forEach(safeAddReimbursementRow);
}
const statusButtons = document.getElementById('statusButtons').childNodes;
for(let i = 0; i < statusButtons.length; i++) {
    statusButtons[i].addEventListener('click', () => {
        loadStatusData(statusButtons[i].value);
    });
}
document.getElementById('authorIdButton').addEventListener('click', () => {
    loadUserData(document.getElementById('authorId').value);
});
function getCurrentDateTime(){
    let d = new Date();
    //return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    return d.toDateString();
} 