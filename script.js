let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imageBtn = document.querySelector("#images");

const APi_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBWrLq54ssR9MHQ3zGmQnjB7Vl-U1iVjWo";

let user = {
    data: null,
}

async function generateResponse(aiChatBox) {
    let text=aiChatBox.querySelector(".ai-chat-area");

    let RequestOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "contents": [{
                "parts": [{ "text": user.data }]
            }]
        })
    }
    try{
        let response = await fetch(APi_Url, RequestOption)
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*\*(.*?)/, '').trim();
        text.innerHTML = apiResponse;
    }catch(error){
        console.log(error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});

    }
        
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatResponse(message) {
    user.data = message;
    let html = `<img src="images/user.png" alt="user" id="userImage" width="50px">
            <div class="user-chat-area">
               ${user.data}
            </div>`
    prompt.value = "";
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});

    setTimeout(() => {
        let html = `<img src="images/aibot.png" alt="aibot" id="aiImage" width="50px">
            <div class="ai-chat-area">
            <img src="images/load-unscreen.gif" alt="load" class="load" width="60px">
            </div>`
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    }, 600);
}


prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handleChatResponse(prompt.value);

    }
})

imageBtn.addEventListener("click", () => {
imageBtn.querySelector("input").click();

});