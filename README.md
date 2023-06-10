
# Documentation

You can use the Firebase API to allow users to sign in with Google, import data from an Excel spreadsheet into the content in .json format, and prompt users to fill out the form, sending it to the email addresses listed in the dropdown menu.




## API(src/server)

#### send mail

```http
  POST /send-email
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `data, userEmail, selectedOption` | `json` | JSON DATA |


  
## Build Backend

```javascript
node /src/server/index.js
```

## Build Frontend 

```javascript
npm run build (/src)
```


  
## Edit File

edit /src/server/index.js


  ```javascript
// SET GMail API
const CLIENT_ID = '';
const CLIENT_SECRET = ' ';
const REDIRECT_URI = '';
const REFRESH_TOKEN = '';
```
edit /src/components/Firebase/Firebase.js


  ```javascript
const firebaseConfig = {
//Firebase Config.
};
```
## Lisans

[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)

  