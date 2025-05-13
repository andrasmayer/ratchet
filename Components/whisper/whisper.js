export const WhisperHandler = (resource) =>{
    const whisperInput = document.querySelectorAll(".whisper-response")
    whisperInput.forEach(itm=>{
        itm.addEventListener("keydown",(e)=>{
            if(e.keyCode == 13 && resource.currentTargetId != null ){
                const from = JSON.parse(resource.getItem("ratchetUserToken") ) 

                //if(itm.value != ""){
                if( /[^\s]/.test(itm.value) ){ //Van e más mint szóköz és enter
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
        console.log('hali')
        itm.addEventListener("click",()=>{
            resource.currentTargetId = itm.parentNode.parentNode.getAttribute("targetId")

            /*
            closeWindow.addEventListener("click",()=>{
                console.log(123)
            })
                */
            //resource.currentTargetName = itm.parentNode.parentNode.querySelector(".whisper-userName").textContent
        })

        const whisperWindow = document.querySelectorAll(".whisper")
        whisperWindow.forEach(itm=>{
            const closeWindow = itm.querySelector(".closeWindow")
            closeWindow.addEventListener("click",()=>{
                const userId = itm.parentNode.parentNode.getAttribute("id").split("user_").join("")
                const core = itm.parentNode.parentNode.parentNode.parentNode
                const tabs = core.querySelector("#chatTabs").querySelectorAll("li")
                tabs.forEach(tab=>{
                    const tabId = tab.querySelector(".nav-link").getAttribute("id").split("userTab_").join("")
                    if(tabId == userId){
                        tab.remove()
                    }
                })

                itm.parentNode.parentNode.remove() //chat tároló törlése
                delete resource.userWindows[userId]
            })
        })
    })
}

export const openWhisperWindow = (response,resource) =>{


    const Window = `
    <div class="">
        <div class="whisper card border-0" targetId="${response.from.userId}">
        
            <div class="whisper-header p-3 pb-0">
                <button class="float-end btn-close closeWindow"></button>
            </div>
            <div class="whisper-body p-3">
            ${
                response.message == null ? "" : `<div class="whisper-message"><b>${response.from.userName}</b> ${response.message}</div>`
            }
            </div>
            <div class="whisper-footer col-11">
                <textarea class="whisper-response form-control border-0" placeholder="..."></textarea>
            </div>
        </div>
    </div>
    `



    const chatTabs = document.querySelector("#chatTabs")
    const openTabs = chatTabs.querySelectorAll(".nav-link").length

    chatTabs.innerHTML +=   `<li class="nav-item" role="presentation">
                                <button class="nav-link text-dark ${openTabs == 0 ? "active" : "" }" id="userTab_${response.from.userId}" data-bs-toggle="tab" data-bs-target="#user_${response.from.userId}"
                                    type="button" role="tab" aria-controls="user_${response.from.userId}" aria-selected="true">
                                    ${response.from.userName}
                                        <span class="newMessages">${response.to != null && openTabs != 0 ? `<i class="fa fa-comment newMessagesBuble"></i> 1` : ""}</span>
                                    </button>
                                    
                            </li>`




    const chatTabsContent = chatTabs.parentNode.querySelector("#chatTabsContent")

    chatTabsContent.innerHTML +=    `<div class="tab-pane fade show ${openTabs == 0 ? "active" : "" }" id="user_${response.from.userId}" role="tabpanel">
                                        ${Window}
                                    </div>`

    WhisperHandler(resource)
}


export const reply = (response) => {

    
   
    const whisper = document.querySelectorAll(".whisper");
    whisper.forEach(itm => {
      if (itm.getAttribute("targetId") == response.from.userId) {
        if( response.to != null){
            const targetUserTab = document.querySelector(`#userTab_${response.from.userId}`)
            const newMessages = targetUserTab.querySelector(".newMessages")
            //newMessages.textContent = 1
            if( targetUserTab.classList.contains("active") === false){
                if(newMessages.textContent == "" ){
                    newMessages.innerHTML = '<i class="fa fa-comment newMessagesBuble"></i> 1'
                }
                else{
                    const tmpContent = parseInt(newMessages.textContent.split(`<i class="fa fa-comment newMessagesBuble"></i>`).join(""))
                    //newMessages.textContent++
                    newMessages.innerHTML = `<i class="fa fa-comment newMessagesBuble"></i> ${tmpContent+1}`
                }
            }
        }

        
        const from = JSON.parse(localStorage.getItem("ratchetUserToken") ) 
        const bgColor = response.to != null ? "" : "bg-me"


        const now = new Date()
        const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        const whisperBody = itm.querySelector(".whisper-body")
        
        whisperBody.innerHTML += `<div class="whisper-message ${bgColor}"><b>${
          response.from.userName
        }</b> <i class="float-end">${formatted}</i><div>${response.message}</div></div>`
        whisperBody.scrollTop = whisperBody.scrollHeight;
        
      }
    })
}

