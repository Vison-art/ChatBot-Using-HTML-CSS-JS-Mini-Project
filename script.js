let prompt = document.querySelector("#prompt");
let submitBtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imageBtn = document.querySelector("#images");
let image = document.querySelector("#images img");
let imageInput = document.querySelector("#images input");


// console.log("API Key:",APi_Url); 



let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let RequestOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "contents": [{
                "parts": [{ "text": user.message }, (user.file.data ? [{ "inline_data": user.file }] : [])]
            }]
        })
    }
    try {
        let response = await fetch(APi_Url, RequestOption)
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*\*(.*?)\*\*\*/g, '').replace(/\*\*(.*?)\*\*/g, '').replace(/\*\*(.*?)\*\*/g, '').trim();
        text.innerHTML = apiResponse;
    } catch (error) {
        console.log(error);
    }
    finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        image.src=`images/image.svg`
        image.classList.remove("btn-choose-img");
        user.file={};

    }

}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatResponse(userMessage) {
    user.message = userMessage;
    let html = `<img src="images/user.png" alt="user" id="userImage" width="10%">
            <div class="user-chat-area">
               ${user.message}
               ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" alt="choose-image" class="choose-img">` : ""}
            </div>`
    prompt.value = "";
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

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

submitBtn.addEventListener("click", () => {
    handleChatResponse(prompt.value);

})
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64String = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64String
        }

        image.src=`data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add("btn-choose-img");
    }
    reader.readAsDataURL(file);
})

imageBtn.addEventListener("click", () => {
    imageBtn.querySelector("input").click();

});