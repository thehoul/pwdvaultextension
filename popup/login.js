document.addEventListener('DOMContentLoaded', () => {
    const loginFeedback = document.getElementById('login-feedback');
    const signupFeedback = document.getElementById('signup-feedback');

    // Event listener to show the sign-up form
    document.getElementById('show-signup').addEventListener('click', () => {
        switchContainer('signup-container');
        loginFeedback.style.display = 'none';
    });

    // Event listener to show the login form
    document.getElementById('show-login').addEventListener('click', () => {
        switchContainer('login-container');
        signupFeedback.style.display = 'none';
    });

    // Handle login form submission
    document.getElementById('login-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        browser.runtime.sendMessage({ action: 'login', username, password }).then((response) => {
            if (response.success) {
                loginFeedback.textContent = response.message;
                loginFeedback.classList.add('success');
                loginFeedback.style.display = 'block';
                setTimeout(() => {
                    switchContainer('account-container');
                    setUserDetails(response.username, response.email, response.acc_verified, response.tfa_enabled);
                }, 500);
            } else {
                loginFeedback.textContent = response.message;
                loginFeedback.classList.remove('success');
                loginFeedback.style.display = 'block';
                // Clear password field on failed login
                document.getElementById('login-password').value = '';
            }
        });
    });

    // Handle sign-up form submission
    document.getElementById('signup-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const email = document.getElementById('signup-email').value;

        browser.runtime.sendMessage({ action: 'signup', username, password, email }).then((response) => {
            if (response.success) {
                signupFeedback.textContent = response.message;
                signupFeedback.classList.add('success');
                signupFeedback.style.display = 'block';
                setTimeout(() => {
                    switchContainer('login-container');
                    setUserDetails(response.username, response.email, response.acc_verified, response.tfa_enabled);
                }, 1000);  // Switch to login form after 1 second on successful signup
            } else {
                signupFeedback.textContent = response.message;
                signupFeedback.classList.remove('success');
                signupFeedback.style.display = 'block';
            }
        });
    });

    setPage(); 
});

function switchContainer(containerId){
    document.querySelectorAll('.container').forEach((container) => {
        container.classList.remove('active');
    });
    document.getElementById(containerId).classList.add('active');
    let state = document.getElementById(containerId).getAttribute('data-state');
    browser.runtime.sendMessage({ action: 'setState', state });
}

function setUserDetails(username, email, verified, tfaEnabled){
    document.getElementById('account-username').textContent = username;
    document.getElementById('account-email').textContent = email;

    if (verified){
        document.getElementById('verified-yes').style.display = 'inline';
    } else {
        document.getElementById('verified-no').style.display = 'inline';
    }

    if (tfaEnabled){
        document.getElementById('2fa-yes').style.display = 'inline';
    } else {
        document.getElementById('2fa-no').style.display = 'inline';
    }
}

function setPage(){
    checkAuth();
    browser.runtime.sendMessage({ action: 'getState' }).then((response) => {
        let state = response.state;
        switch(state){
            case 'login':
                switchContainer('login-container');
                break;
            case 'passwordgen':
                switchContainer('pwdgen-container');
                break;
            case 'account':
            default:
                switchContainer('account-container');
                break;
        }
    });
}

function checkAuth(){
    browser.runtime.sendMessage({ action: 'checkAuth' }).then((response) => {
        // Force the state to login if the user is not authenticated
        if (!response.success) {
            browser.runtime.sendMessage({ action: 'loggedOut'});
        } else {
            setUserDetails(response.username, response.email, response.acc_verified, response.tfa_enabled);
            // Notify the state controller that the user is logged in
            browser.runtime.sendMessage({ action: 'loggedIn'});
        }
    });
}