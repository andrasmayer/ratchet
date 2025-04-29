
export const login = (props) =>{
    let ratchetUserToken = localStorage.getItem("ratchetUserToken")
    const loginButton = document.querySelector(".loginButton")
    const user = document.querySelector(".user")
    if( ratchetUserToken != null ){
        user.value = ratchetUserToken
    }

    loginButton.addEventListener("click", function (e) {
        localStorage.setItem("ratchetUserToken",user.value)
        ratchetUserToken = user.value
        props.setItem("ratchetUserToken",ratchetUserToken)
    })
}

