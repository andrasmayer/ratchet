const {userTabs} = await import(`./Components/userTabs/userTabs.js${app_version}`)
const tabs = new userTabs()

const isLogged = localStorage.getItem("ratchetUserToken") !== null

export const GUI = `
    <div class="container-fluid">
        <div class="loginBox">
            <input class="userId" value="1">
            <input class="user" value="user">
            <div class="loginControls">
                ${isLogged === false ? `<button class="loginButton">LogIn</button>` : ""}
                ${isLogged === true ? `<button class="logOut">LogOut</button>` : ""}
            </div>
        </div>

        <a class="btn btn-primary isConnected d-none" data-bs-toggle="offcanvas" href="#offcanvasOnlineUsers" role="button" aria-controls="offcanvasOnlineUsers">
            Aktív felhasználók
        </a>


        <a class="btn btn-primary isConnected d-none" data-bs-toggle="offcanvas" href="#offcanvasChatRooms" role="button" aria-controls="offcanvasOnlineUsers">
            Szobák
        </a>

        <div class="errorCTN"></div>
        <div class="messageCTN row p-3"></div>
    
    
        ${tabs.init()}








        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasOnlineUsers" aria-labelledby="offcanvasOnlineUsersLabel"  data-bs-backdrop="false">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasOnlineUsersLabel">Aktív felhasználók</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="userList list-group"></div>    
            </div>
        </div>


        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasChatRooms" aria-labelledby="offcanvasOnlineUsersLabel"  data-bs-backdrop="false">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasChatRoomsLabel">Szobák</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div>
                    <input class="newRoomName" placeholder="Szoba neve">
                    <button class="createRoom">Létrehozás</button>
                </div>
                <div class="roomList list-group"></div>    
            </div>
        </div>


    </div>

    <link rel="stylesheet" href="css/styles.css${app_version}">
    `

export const userTabsEvents = tabs.events


class roomEvents{
    constructor(){

    }
    events(resource){
        const newRoomName = document.querySelector(".newRoomName")
        const newRoomBtn = document.querySelector(".createRoom")
        console.log(resource)
        document.querySelector(".createRoom").addEventListener("click",()=>{
            /*
            if(newRoomName.value.length <= 5){
              //  alert("Szoba neve túl rövid, minimum 5 karakter")
            }
            else{

                
                //alert(`${newRoomName.value} szoba létrehozva`)
            }
              */
             
            
            resource.conn.send(JSON.stringify({type:"createRoom", roomName:newRoomName.value}) )
        })

    }
    

}

const roomEvents_ = new roomEvents()
export const Rooms = roomEvents_.events