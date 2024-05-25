document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const showSignupButton = document.getElementById('show-signup');
    const showLoginButton = document.getElementById('show-login');
    const loginFeedback = document.getElementById('login-feedback');
    const signupFeedback = document.getElementById('signup-feedback');

    // Event listener to show the sign-up form
    showSignupButton.addEventListener('click', () => {
        loginContainer.classList.remove('active');
        signupContainer.classList.add('active');
        loginFeedback.style.display = 'none';  // Hide feedback when switching forms
    });

    // Event listener to show the login form
    showLoginButton.addEventListener('click', () => {
        signupContainer.classList.remove('active');
        loginContainer.classList.add('active');
        signupFeedback.style.display = 'none';  // Hide feedback when switching forms
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
                    window.close();
                }, 1000);  // Close the popup after 1 second on successful login
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
                    signupContainer.classList.remove('active');
                    loginContainer.classList.add('active');
                }, 1000);  // Switch to login form after 1 second on successful signup
            } else {
                signupFeedback.textContent = response.message;
                signupFeedback.classList.remove('success');
                signupFeedback.style.display = 'block';
            }
        });
    });
});
