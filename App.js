const {Ajax} = await import(`./Hooks/Ajax/Ajax.js${app_version}`)
const {login} = await import(`./Components/login/login.js${app_version}`)
const { openWhisperWindow, reply} = await import(`./Components/Whisper/whisper.js${app_version}`)
export class RatchetWebSocket {
    constructor(props){

    
        this.ipv4= Ajax({
            url:"./ipAddress.php",
            method:"post",
        })


        this.userWindows = {}
        this.props = props
        this.storage = new Proxy(localStorage, {
            set: (target, key, value) => {
                target.setItem(key, value)
                return true
            },
            get: (target, key) => {
                return target.getItem(key)
            },
            deleteProperty: (target, key) => {
                target.removeItem(key)
                return true
            }
        })

        this.setItem = (key, value) =>{
            this.storage[key] = value
        }
        this.getItem = (key) =>{
            return this.storage[key];
        }
        this.removeItem = (key) =>{
            delete this.storage[key];
        }
       
        this.ratchetUserToken =  this.getItem("ratchetUserToken")
        if(this.ratchetUserToken != null){
            this.ratchetUserToken = JSON.parse( this.getItem("ratchetUserToken") )
            this.connect(this.ratchetUserToken)
        }
        else{  }

    }
    connect(user){
        this.connectionData = `?id=${user.userId}&userName=${user.userName}`
        //this.conn = new WebSocket(`ws://${this.props.ip}:${this.props.port}/${this.props.route}${this.connectionData}`)
        this.conn = new WebSocket(`ws://${this.ipv4}:${this.props.port}/${this.props.route}${this.connectionData}`)

        this.conn.onmessage = (e) =>{
            const response = JSON.parse(e.data)

            if( response.type == "user_list"){
                this.onlineUsers(response.users)
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
               // console.log(response)
               //console.log("reply")
            }
        
        }

        this.conn.onopen = () => {}
        this.conn.onerror = function (error) {
            console.error("WebSocket hiba:", error)
        }
    }
    onlineUsers(list){
        const me = JSON.parse( this.getItem("ratchetUserToken") )
        const userList = document.querySelector(".userList")
        userList.innerHTML = ""
        list.forEach(client=>{
            if(client.id != me.userId){
                userList.innerHTML += `<div class="clients" clientId="${client.id}">${client.userName}</div>`
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
    }
    events(){
        login({storage:this.storage, conn:this.conn, getItem:this.getItem, setItem:this.setItem, removeItem:this.removeItem, resource:this})
    }
}

const webSocketServer = new RatchetWebSocket({ip:"192.168.141.184", port:"8091", route:"chat"})
webSocketServer.events()