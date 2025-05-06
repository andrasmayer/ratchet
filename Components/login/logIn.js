
export const login = (props) =>{
    let ratchetUserToken = JSON.parse( localStorage.getItem("ratchetUserToken") )
    const loginButton = document.querySelector(".loginButton")
    const user = document.querySelector(".user")
    const userId = document.querySelector(".userId")
    if( ratchetUserToken != null ){
        user.value = ratchetUserToken.userName
        userId.value = ratchetUserToken.userId
    }

    loginButton.addEventListener("click", function (e) {
        props.setItem("ratchetUserToken",`{"userName":"${user.value}","userId":"${userId.value}"}`)
        props.resource.connect( JSON.parse( localStorage.getItem("ratchetUserToken") ) )
      
    })

    const logOut = document.querySelector(".logOut")
    logOut.addEventListener("click",()=>{
        props.conn.send(JSON.stringify({type:"logOut", userId:JSON.parse(props.getItem("ratchetUserToken")).userId }))
        props.removeItem("ratchetUserToken")
    })
}