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
    usernameData.innerText = user.username;
    row.appendChild(usernameData);

    const firstNameData = document.createElement('td');
    firstNameData.innerText = user.firstName;
    row.appendChild(firstNameData);

    const lastNameData = document.createElement('td');
    lastNameData.innerText = user.lastName;
    row.appendChild(lastNameData);

    const emailData = document.createElement('td');
    emailData.innerText = user.email;
    row.appendChild(emailData);

    const roleData = document.createElement('td');
    roleData.innerText = user.role.role; //not showing role
    row.appendChild(roleData);
    console.log(user); //checking 

}

async function loadData() {
    const resp = await fetch('http://localhost:8012/users', {
        credentials: 'include'
    });
    const users = await resp.json();
    console.log(users);
    users.forEach(safeAddUserRow);
}

loadData();