# Functionalities

## On install
A page should open to request for the user to log in or create an account. Upon success, this page will close and the cookies necessary for further communications will be stored.

**Status**: done

## On start
When firefox is started, the extension should look if there is an authentication available and if not, prompt the user to login (or sign up).

**Status**: done

## When right clicking an input field
The menu should show an option for this extension to 

### 1. Create a password for the current website
This should create a random password and allow the user to apply it or to regenerate the password. When the user is happy to apply the generated password, the 
new password should be sent to the server for the current website and pasted in the field automatically.

### 2. Fetch the passwords for the current website 
This should open a menu with all the passwords for this website available. There should be some way of managing them -> either directly in the menu, each entry has a delete button to remove this entry (with the corresponding request to the server) or by having a "manage password" button that open another page where all the passwords for all website can be managed. Naturally, all entry should also have a button to "use" them, when pressed the password is pasted in the field and the menu is closed.

**Status**:  not started. The server can already handle such requests.

# Popup menu
The extension's popup menu should either show a login page (or a button to open the login page) if there's no current login or a profile page. This page should show the username of the current profile. 
Then, it could have

1. A button to see the profile details for instance the email address of the account and an option to modify the password.
2. A button to manage stored passwords
3. A button to logout

**Status**: not started. the server doesn't yet register email addresses and thus doesn't handle modifiying the password. Also, manage the password for any website might be complicated (?), it requires fetching all available passwords and display them in an html menu.



# Next

- Add stuff in the popup (gen password, manage passwords)
- Solve concurrency problem (lock or sqlite or ??)
- Add email in accounts for account registration verification and password reset
- Better icons ?
- Make only one password per page?