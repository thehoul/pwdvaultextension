// Function to generate a random password
function generatePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
}

// Set up initial password
document.addEventListener('DOMContentLoaded', () => {
    const passwordField = document.getElementById('password');
    const urlField = document.getElementById('url');
    const generateButton = document.getElementById('generate');
    const setButton = document.getElementById('set');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');

    // Display initial password
    function displayNewPassword() {
        const newPassword = generatePassword(parseInt(lengthSlider.value, 10));
        passwordField.value = newPassword;
    }

    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        // Set the default URL to the current tab's hostname
        urlField.value = new URL(tabs[0].url).hostname;
    });

    // Update the displayed password length
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
        displayNewPassword();
    });

    // Display an initial password when the popup loads
    displayNewPassword();

    // Regenerate password when the generate button is clicked
    generateButton.addEventListener('click', displayNewPassword);

    // Set the password for the specified URL when the set button is clicked
    setButton.addEventListener('click', () => {
        const url = urlField.value;
        const password = passwordField.value;

        if (url) {
            browser.runtime.sendMessage({ action: 'addPassword', username: 'theo',
                website: url, password: password }).then((response) => {
                if (response.success) {
                    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
                        browser.tabs.sendMessage(tabs[0].id, { action: 'inject', password: password });
                    });
                    // close
                    window.close();
                    
                } else {
                    alert('Failed to save password: ' + response.message);
                }
            });
        } else {
            alert('Please enter a URL.');
        }
    });
});

window.addEventListener('unload', () => {
    // Notify the background script that the popup is closed
    browser.runtime.sendMessage({ action: 'closePopup' });
});

