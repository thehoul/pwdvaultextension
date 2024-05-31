// Function to generate a random password
function generatePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
}

function getCurrentHostname() {
    try{
        return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            return new URL(tabs[0].url).hostname;
        });
    } catch (e) {
        return '';
    }
}

// Set up initial password
document.addEventListener('DOMContentLoaded', () => {
    const passwordField = document.getElementById('password');
    const urlField = document.getElementById('url');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');

    function displayNewPassword() {
        passwordField.value = generatePassword(parseInt(lengthSlider.value, 10));
    }

    // Set the default URL to the current tab's hostname
    getCurrentHostname().then((hostname) => {
        urlField.value = hostname;
    });

    // Update the displayed password length
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
        displayNewPassword();
    });

    // Display an initial password when the popup loads
    displayNewPassword();

    // Regenerate password when the generate button is clicked
    document.getElementById('generate').addEventListener('click', displayNewPassword);

    document.getElementById('return').addEventListener('click', () => {
        switchContainer('account-container');
    });

    document.getElementById('current-page-button').addEventListener('click', () => {
        getCurrentHostname().then((hostname) => {
            urlField.value = hostname;
        });
    });

    // Set the password for the specified URL when the set button is clicked
    document.getElementById('set').addEventListener('click', () => {
        const url = urlField.value;
        const password = passwordField.value;

        if (url) {
            browser.runtime.sendMessage({ action: 'menuAddPassword', 
                                        website: url, password: password }).then((response) => {
                if (response.success) {
                    // Close the popup
                    document.getElementById('error-message').style.display = 'none';
                    window.close();
                } else {
                    document.getElementById('error-message').textContent = "Error: "; + response.message;
                }
            });
        } else {
            alert('Please enter a URL.');
        }
    });
});