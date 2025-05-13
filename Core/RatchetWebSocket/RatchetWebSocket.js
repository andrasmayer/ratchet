const {Ajax} = await import(`../../Hooks/Ajax/Ajax.js${app_version}`)
const {loginCheck} = await import(`../../Components/login/login.js${app_version}`)
const {GUI, userTabsEvents, Rooms} = await import(`../../Components/GUI/GUI.js${app_version}`)
const { openWhisperWindow, reply} = await import(`../../Components/Whisper/whisper.js${app_version}`)
const { localStorageHandler} = await import(`../../Components/localStorageHandler/localStorageHandler.js${app_version}`)




export class RatchetWebSocket {
    constructor(props){
        //localStorage.removeItem("ratchetUserToken")
        //Grafikus elemek betöltése
        const root = document.querySelector("#root")
        root.innerHTML = GUI
        //console.log( root.innerHTML)
  


        this.activeUsers = []
        this.userWindows = {}
        this.tmp_storage  = new localStorageHandler()
        Object.keys(this.tmp_storage).forEach(procedure=>{
            this[procedure] = this.tmp_storage[procedure]
        })

        this.system = Ajax({
            url:"./getOS.php",
            method:"post",
            response:"json"
        })
        this.ipv4 = this.system.ipv4
        this.OS   = this.system.OS
        

        
        this.props = props


        this.ratchetUserToken =  this.getItem("ratchetUserToken")
        if(this.ratchetUserToken != null){
            this.ratchetUserToken = JSON.parse( this.getItem("ratchetUserToken") )
            this.connect(this.ratchetUserToken)
        }
        else{  }

    }
    connect(user){
        this.connectionData = `?id=${user.userId}&userName=${user.userName}`
        this.conn = new WebSocket(`ws://${this.ipv4}:${this.props.port}/${this.props.route}${this.connectionData}`)
        //this.conn = new WebSocket(`wss://${this.ipv4}:${this.props.port}/${this.props.route}${this.connectionData}`)
        //console.log(this.conn)
        this.tmp_storage.conn = this.conn
        this.conn.onmessage = (e) =>{
            const response = JSON.parse(e.data)

            if( response.type == "user_list"){
                this.onlineUsers(response.users)
            }
            if( response.type == "roomList"){
                this.openRooms(response.rooms)
            }
            if( response.type == "whisper"){
                if(this.userWindows[response.from.userId] == null){
                    openWhisperWindow(response,this,false)
                    this.userWindows[response.from.userId] = true
                }
                else{
                    reply(response,this)
                }          
            }
            else{
                console.log(          response)
            }
        }
       


        let timeCounter = 0;
        const ConnectionAttempt = setInterval(()=>{
            timeCounter++
            const errorCTN = document.querySelector(".errorCTN")
            errorCTN.innerHTML = `Csatlakozási kísérlet: ${5-timeCounter}`
        },1000)

        
        const ConnectionTimeout = setTimeout(function() {
            const errorCTN = document.querySelector(".errorCTN")
            errorCTN.innerHTML = "Csatlakozási hiba!"
            clearInterval(ConnectionAttempt)
        }, 5000); // 5 másodperc





        this.conn.onopen = () => {
            clearTimeout(ConnectionTimeout)
            clearInterval(ConnectionAttempt)
            const errorCTN = document.querySelector(".errorCTN")
            errorCTN.innerHTML = "Sikeres kapcsolódás!"
            const isConnected = document.querySelectorAll(".isConnected")
            isConnected.forEach(itm=>{
                itm.classList.remove("d-none")
            })

            userTabsEvents()

            Rooms(this)
            
            
            //roomList
            this.conn.send(JSON.stringify({type:"roomList"}) )
        }
        this.conn.onerror = function () {}
    }
    onlineUsers(list){
        const me = JSON.parse( this.getItem("ratchetUserToken") )
        const userList = document.querySelector(".userList")
        userList.innerHTML = ""
        this.activeUsers = []
        list.forEach(client=>{
            this.activeUsers.push(client.id.toString())
            if(client.id != me.userId){
                userList.innerHTML += 
                `<div role="button" data-bs-dismiss="offcanvas" aria-label="Close" class="clients list-group-item" clientId="${client.id}">${client.userName}</div>`
            }
        })
        const clients = document.querySelectorAll(".clients")
        
        clients.forEach(itm=>{
            itm.addEventListener("click",()=>{
                this.currentTargetId = itm.getAttribute("clientId")
                this.currentTargetName = itm.textContent

                if(this.userWindows[this.currentTargetId] == null){
                    this.userWindows[this.currentTargetId] = true
                    const response = {from:{userId:this.currentTargetId, userName:this.currentTargetName }, to:{userId:me.userId, userName:me.userName}}
                    openWhisperWindow(response,this)
                }
            })
        })

        //Ha nincs nyitott ablak frissítésnél, üríti a hozzá tartozó objektumot
        const whisper = document.querySelectorAll(".whisper")
        if(whisper.length == 0){
            this.userWindows = {}
        }
               
        whisper.forEach(itm=>{
            const targetid =  itm.getAttribute("targetid")
            if( this.activeUsers.includes(targetid) === false){
                const userLeft = itm.querySelector(".userLeft")
                if(userLeft == null){
                    itm.querySelector(".whisper-body").innerHTML += `<i style="color:#ccc" class="userLeft">Felhasználó kilépett</i>`
                    itm.querySelector(".whisper-response").disabled = true
                }
            }
            else{
                const userLeft = itm.querySelector(".userLeft")
                if(userLeft != null){
                    userLeft.remove()
                    itm.querySelector(".whisper-response").disabled = false  
                }
            }
        })
    }



    openRooms(list){
        const roomList = document.querySelector(".roomList")
        roomList.innerHTML = ""
        this.activeUsers = []
        list.forEach(room=>{
            roomList.innerHTML += 
            `<div role="button" data-bs-dismiss="offcanvas" aria-label="Close" class="room list-group-item" roomName="${room.roomName}">
                <label>${room.roomName}</label>
                <label class="text-primary">(${room.userCount})</label>

            </div>`
            
        })
       
        const rooms = document.querySelectorAll(".room")
        rooms.forEach(itm=>{
            console.log(itm)
            itm.addEventListener("click",()=>{
                this.conn.send(JSON.stringify({type:"enterRoom", roomName:itm.getAttribute("roomName")}) )
            })
        })



    }

    events(){

        loginCheck({
            storage:this.storage,
            conn:this.conn,
            getItem:this.getItem, 
            setItem:this.setItem, 
            removeItem:this.removeItem, 
            resource:this        
        })



    }
}

const webSocketServer = new RatchetWebSocket({ip:"192.168.141.184", port:"8091", route:"chat"})
webSocketServer.events()

