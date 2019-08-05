const nav = document.getElementById('app-nav');
nav.classList = 'navbar navbar-expand-md navbar-dark bg-dark';


nav.innerHTML = `
<a class="navbar-brand" href="#">Ginyu Force</a>
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04"
    aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse" id="navbarsExample04">
    <ul class="navbar-nav mr-auto">
        <li class="nav-item ">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="../usersHTML/usersProfile.html" id="dropdown04" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">Grunts</a>
            <div class="dropdown-menu" aria-labelledby="dropdown04">
                <a class="dropdown-item" href="../usersHTML/usersProfile.html">Users Profile</a>
            </div>
        </li>
        <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">Captains</a>
        <div class="dropdown-menu" aria-labelledby="dropdown04">
            <a class="dropdown-item" href="../reimbursementHTML/reimbursements.html">View and Edit Reimbursements</a>
            <a class="dropdown-item" href="../reimbursementHTML/viewAllUsers.html">View All Users</a>
        </div>
    </li>
    </ul>
    <ul class="navbar-nav">
    <li class="nav-item">
            <a class="nav-link" href="../login/login.html">Sign In<span
                    class="sr-only">(current)</span></a>
        </li>
    </ul>
    <div id="nav-username" class="my-2 my-md-0"></div>
</div>
`;



const user = JSON.parse(localStorage.getItem('user'));
if (user) {
    document.getElementById('nav-username').innerText = user.username;
}