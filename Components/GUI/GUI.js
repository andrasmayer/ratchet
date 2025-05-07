const isLogged = localStorage.getItem("ratchetUserToken") !== null

export const GUI = `
    <div>
        <div class="loginBox">
            <input class="userId" value="1">
            <input class="user" value="user">
            <div class="loginControls">
                ${isLogged === false ? `<button class="loginButton">LogIn</button>` : ""}
                ${isLogged === true ? `<button class="logOut">LogOut</button>` : ""}
            </div>
        </div>
        
        <div class="userList"></div>
        <div class="messageCTN"></div>
    </div>
    
    <link rel="stylesheet" href="css/styles.css${app_version}">
    `

