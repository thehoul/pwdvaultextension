document.addEventListener('DOMContentLoaded', async () => {
    const popupContent = document.getElementById('popup-content');

    const user = await checkUserLoggedIn();

    if (user) {
        // If user is logged in, show account info
        popupContent.innerHTML = `
        <div class="account-info">
            <h2>Logged in as ${user.username}</h2>
            <p>email: ${user.email}</p>
        </div>
        <button class="logout-button" id="logout-button">Logout</button>
        <div id="logout-message" class="logout-message" style="display: none;">Logging you out...</div>`;

        document.getElementById('logout-button').addEventListener('click', () => {
            logoutUser();
        });
    } else {
        // If user is not logged in, show login button
        popupContent.innerHTML = `
        <h2>Not logged in.</h2>
        <button class="button" id="login-button">Login</button>
      `;

        document.getElementById('login-button').addEventListener('click', () => {
            browser.tabs.create({ url: 'login.html' });
        });
    }
});

// Simulate a function to check if the user is logged in
function checkUserLoggedIn() {
    return browser.runtime.sendMessage({ action: 'checkAuth' }).then((response) => {
        if (response.success) {
            return { username: response.user, email: "dummy@email.ch" };
        }
        return null;
    });
}

// Simulate a function to log out the user
function logoutUser() {
    browser.runtime.sendMessage({ action: 'logout' }).then((response) => {
        if (response.success) {
            document.getElementById('logout-message').style.display = 'block';
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            document.getElementById('logout-message').textContent = response.message;
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    });
}
