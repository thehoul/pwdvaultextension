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


browser.runtime.onMessage.addListener((message) => {
    console.log(message);
    if(message.action === 'setURL') {
        window.confirm("please confirm");
        document.getElementById('url').value = message.url;
    }
});
