document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logout-button').addEventListener('click', () => {
        document.getElementById('logout-message').style.display = 'block';
        browser.runtime.sendMessage({ action: 'logout' }).then((response) => {
            if (response.success) {
                setTimeout(() => {
                    switchContainer('login-container');
                }, 1000);
            } else {
                document.getElementById('logout-message').textContent = response.message;
            }
        });
    });
    document.getElementById('pwdgenbtn').addEventListener('click', () => {
        switchContainer('pwdgen-container');
    });
    document.getElementById('pwdmanage').addEventListener('click', () => {
        // TODO 
    });

    document.getElementById('enable-2fa').addEventListener('click', () => {
        // TODO request the qrcode (/2faActivate) 
        // and show the qrcode in a dialog with a input field for the code and submit and return button
    });
});