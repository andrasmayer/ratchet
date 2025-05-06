export const WhisperHandler = (resource) =>{
    const whisperInput = document.querySelectorAll(".whisper-response")
    whisperInput.forEach(itm=>{
        itm.addEventListener("keydown",(e)=>{
            if(e.keyCode == 13 && resource.currentTargetId != null ){
                const from = JSON.parse(resource.getItem("ratchetUserToken") ) 

                if(itm.value != ""){
                    resource.conn.send(JSON.stringify({type:"whisper", from:from, to:{userId:resource.currentTargetId, userName:resource.currentTargetName}, message:itm.value}))
                    
                    reply({
                        type:"whisper", 
                        from:{userId:resource.currentTargetId, userName:from.userName},
                        message: itm.value == "" ? "" : itm.value 
                    })
        
                    itm.value = ""
                }
            }
        })

    })

    const whisper = document.querySelectorAll(".whisper-response")
    whisper.forEach(itm=>{
        itm.addEventListener("click",()=>{
            resource.currentTargetId = itm.parentNode.parentNode.getAttribute("targetId")
            resource.currentTargetName = itm.parentNode.parentNode.querySelector(".whisper-userName").textContent
            //console.log(resource.currentTargetId)
           // console.log( "elem id: " + itm.parentNode().parentNode().getAttribute("targetId") )
            //console.log( itm.parentNode.parentNode.getAttribute("targetId")  )
            //console.log( itm.parentNode.parentNode.querySelector(".whisper-userName").textContent )
        })
       // console.log(itm)
    })
}

export const openWhisperWindow = (response,resource) =>{
    console.log(response.message == null)
    const Window = `
        <div class="whisper" targetId="${response.from.userId}">
            <div class="whisper-header">
                <label class="whisper-userName">${response.from.userName}</label>
            </div>
            <div class="whisper-body">
            ${
                response.message == null ? "" : `<div class="whisper-message"><b>${response.from.userName}</b> ${response.message}</div>`
            }
            
            </div>
            <div class="whisper-footer">
                <input class="whisper-response">
            </div>
        </div>
    `
    const messageCTN = document.querySelector(".messageCTN")
    messageCTN.innerHTML = Window
}


export const reply = (response) =>{

    const whisper = document.querySelectorAll(".whisper")
    whisper.forEach(itm=>{
        if(itm.getAttribute("targetId") == response.from.userId){

            const whisperBody = itm.querySelector(".whisper-body")
            whisperBody.innerHTML += `<div class="whisper-message"><b>${
              response.from.userName
            }</b> ${response.message}</div>`
                
        }

    })


}

