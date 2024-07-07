document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logout-button').addEventListener('click', () => {
        document.getElementById('logout-message').style.display = 'block';
        browser.runtime.sendMessage({ action: 'logout' }).then((response) => {
            if (response.success) {
                setTimeout(() => {
                    switchContainer('login-container');
                    document.getElementById('logout-message').style.display = 'none';
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
        browser.runtime.sendMessage({ action: 'enable2fa' }).then((response) => {
            switchContainer('qrcode-container');
            if (response.success) {
                document.getElementById('error-message_qrcode').style.display = 'none';
                document.getElementById('qr-code-image').setAttribute('src', response.qrCode);
                document.getElementById('qr-code-image').style.display = 'block';
            } else {
                document.getElementById('qr-code-image').style.display = 'none';
                document.getElementById('error-message_qrcode').style.display = 'block';
                document.getElementById('error-message_qrcode').textContent = "Error: " + response.message;
            }
        });
    });

    let accountFeedback = document.getElementById('account-feedback');
    document.getElementById('verification-button').addEventListener('click', () => {
        browser.runtime.sendMessage({ action: 'sendAccountVerify'}).then((response) => {
            if(response.success) {
                accountFeedback.textContent = response.message;
                accountFeedback.classList.add('success');
                accountFeedback.style.display = 'block';
            } else {
                accountFeedback.textContent = response.message;
                accountFeedback.classList.remove('success');
                accountFeedback.style.display = 'block';
            }
            setTimeout(() => {
                accountFeedback.style.display = 'none';
            }, 5000);
        });
    });

    document.querySelectorAll('.back-button').forEach((container) => {
        container.addEventListener('click', () => {
            switchContainer('account-container');
        });
    });
});