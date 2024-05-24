document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("set").addEventListener("click", (e) => {
        console.log("Setting account");
        // Save the account information in the session storage
        username = document.getElementById("username").value;
        password = document.getElementById("password").value;

        console.log("Username: ", username);
        console.log("Password; ", password);

        if(!saveToSessionStorage(username, password)) {
            console.error("Error saving account information");
        }
    });

    document.getElementById("create").addEventListener("click", (e) => {
        username = document.getElementById("username").value;
        password = document.getElementById("password").value;

        const req = new Request("https://thehoul.ch/user/" + username , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });

        fetch(req).then((response) => {
            console.log("Response: ", response);
        }, (error) => {
            console.error("Error creating account: ", error);
        });
        
    });
    
});

function saveToSessionStorage(username, password) {
    browser.storage.local.set({
        "username": username,
        "password": password
    }).then(() => {
        console.log("Account information saved in session storage");
        return true;
    }, (error) => {
        console.error("Error saving account information: ", error);
        return false;
    });
}