document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const showSignupButton = document.getElementById('show-signup');
    const showLoginButton = document.getElementById('show-login');
  
    // Event listener to show the sign-up form
    showSignupButton.addEventListener('click', () => {
      loginContainer.classList.remove('active');
      signupContainer.classList.add('active');
    });
  
    // Event listener to show the login form
    showLoginButton.addEventListener('click', () => {
      signupContainer.classList.remove('active');
      loginContainer.classList.add('active');
    });
  
    // Handle login form submission
    document.getElementById('login-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      
      browser.runtime.sendMessage({ action: 'login', username, password }).then((response) => {
        if (response.success) {
          alert('Login successful!');
          window.close();
        } else {
          alert('Login failed: ' + response.error);
        }
      });
    });
  
    // Handle sign-up form submission
    document.getElementById('signup-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('signup-username').value;
      const password = document.getElementById('signup-password').value;
      const email = document.getElementById('signup-email').value;
      
      browser.runtime.sendMessage({ action: 'signup', username, password, email }, (response) => {
        if (response.success) {
          alert('Sign-up successful! You can now log in.');
          signupContainer.classList.remove('active');
          loginContainer.classList.add('active');
        } else {
          alert('Sign-up failed: ' + response.error);
        }
      });
    });
  });
  