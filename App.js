const {login} = await import(`./Components/login/login.js${app_version}`)


export class RatchetWebSocket {
    constructor(props){



//proxy start


    this.storage = new Proxy(localStorage, {
        set: (target, key, value) => {
            if(key == "ratchetUserToken" && value != ""){
                this.conn.send(JSON.stringify({ type: "auth", user:this.getItem("ratchetUserToken")}))

            }
            target.setItem(key, value);  // Az érték beállítása
            return true;
        },
        get: (target, key) => {
            return target.getItem(key);  // Az érték lekérése
        },
        deleteProperty: (target, key) => {
            target.removeItem(key);  // Az érték eltávolítása
            return true;
        }
    })

    this.setItem = (key, value) =>{
        this.storage[key] = value
    }

    // Lekér egy értéket a localStorage-ból
    this.getItem = (key) =>{
        return this.storage[key];
    }

    // Eltávolít egy kulcs-érték párt a localStorage-ból
    this.removeItem = (key) =>{
        delete this.storage[key];
    }

        this.conn = new WebSocket(`ws://${props.ip}:${props.port}/${props.route}`)

        this.conn.onmessage = (e) =>{
           
            const response = JSON.parse(e.data)
            console.log( response)
            if( response.type == "onlineUsers"){
                this.onlineUsers(response.list)
                
            }
            //getOnlineUsers()
        }

        this.conn.onopen = () => {
            if(localStorage.getItem("ratchetUserToken")  != null){
                console.log("relog")
                this.conn.send(JSON.stringify({ type: "relog", user:localStorage.getItem("ratchetUserToken") }))
            }
            else{
                console.log("Nem vagy belépve")
            }
            //this.conn.send(JSON.stringify({ type: "relog", user:localStorage.getItem("ratchetUserToken") }))
        };

        this.conn.onerror = function (error) {
            console.error("WebSocket hiba:", error)
        }


    }


    onlineUsers(list){
        const userList = document.querySelector(".userList")
        userList.innerHTML = ""
        Object.keys(list).forEach(clientId=>{
            userList.innerHTML += `<div clientId="${clientId}">${list[clientId]}</div>`
        })
        console.log(list)
    }

    events(){
        //this.setItem("ratchetUserToken","user123")
        login({storage:this.storage, setItem:this.setItem})

        




    }

}


const webSocketServer = new RatchetWebSocket({ip:"192.168.141.184", port:"8091", route:"chat"})
webSocketServer.events()