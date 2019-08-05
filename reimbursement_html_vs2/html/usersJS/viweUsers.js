function safeAddUserRow(user) {
    console.log(user);
    if (!user) {
        return;
    }
    const tableContainer = document.getElementById('my-user-table-container');
    const tableBody = tableContainer.childNodes[1].childNodes[3];

    const row = document.createElement('tr');
    tableBody.appendChild(row);

    const userIdData = document.createElement('td');
    userIdData.innerText = user.userId;
    row.appendChild(userIdData);

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
    roleData.innerText = user.role.role;
    row.appendChild(roleData);

}

async function loadData() {
    const resp = await fetch('http://localhost:8012/users', {
        method: 'GET',
        credentials: 'include'
    });
    const users = await resp.json();
    console.log(users);
    users.forEach(safeAddUserRow);
}

loadData();