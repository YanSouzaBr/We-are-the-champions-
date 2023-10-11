import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: 'https://we-are-the-champions-b18fc-default-rtdb.firebaseio.com/'
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const commentsInDb = ref(database,"endorsementMessages/message")

let endorsementMessages = document.querySelector("#list-of-messages")
let publishButton = document.querySelector("#submit")
let inputMessage = document.querySelector("#message")
let inputFrom = document.querySelector("#from")
let inputTo = document.querySelector("#to")


function clearMessages() {
    endorsementMessages.innerHTML = ""
    inputMessage.value = ""
}

function getInput() {
    const entireMessage = {
        message: inputMessage.value,
        from: inputFrom.value,
        to: inputTo.value
    }
    return entireMessage
}

onValue(commentsInDb, function(snapshot) {
    if (snapshot.exists()) {
        clearMessages()
        let commentsArray = Object.entries(snapshot.val())
        for (let i = 0; i < commentsArray.length; i++) {
            appendMessages(commentsArray[i])
        }
    } else {
        endorsementMessages.innerHTML = `<span style="color: #8F8F8F"> No endorsements... yet! </span>`
    }
})

publishButton.addEventListener("click", function() {
    if (inputMessage.value === "") {
        window.alert("Please enter a valid endorsement");
    } else {
        let inputMessageValue = getInput(); 

        if (inputFrom.value === "") {
            inputMessageValue.from = "Anonymous";
        }

        if (inputTo.value === "") {
            inputMessageValue.to = "Anonymous";
        }

        push(commentsInDb, inputMessageValue);
        inputMessage.value = "";
        inputFrom.value = "";
        inputTo.value = "";
    }
});

function appendMessages(message) {
    let messageObject = message[1]
    let liEl = document.createElement("li")
    liEl.innerHTML = `
        <p><strong>To </strong>${messageObject.to}</p>
        <p>${messageObject.message}</p>
        <p><strong>From </strong> ${messageObject.from}</p>
    `
    endorsementMessages.insertBefore(liEl, endorsementMessages.firstChild)

    setTimeout(function() {
        liEl.classList.add("show");
    }, 100);

    liEl.addEventListener("dblclick", function() {
        if(confirm("Are you sure you want to delete this endorsement? Please don't delete if it")) {
            liEl.classList.remove("show");
            remove(commentsInDb, message[0])
            liEl.remove()
        }
    })
}

