async function logIn(user, password) {
    const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: user,
            password: password
        })
    });
    const respData = await response.json();
            console.log(respData);
            
            if (respData.jwt) {
                localStorage.setItem("jwt", respData.jwt);
                console.log("Logged in");
                getBoards();
            }
            
}

async function saveNotes(boardId, note) {
    const response = await fetch("http://localhost:8080/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}` },
        body: JSON.stringify({
            boardId: boardId,
            note: note
        })
    });
    const respData = await response.json();
    console.log(respData);
}

async function getBoards() {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch("http://localhost:8080/boards", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
         }
    });
    const respData = await response.json();
    console.log(respData);

    document.getElementById("boards-menu").innerHTML = '<li><a class="dropdown-item" id="new-board">Create new board +</a></li>';

    for (let i in respData) {
        console.log(respData[i].name);
        document.getElementById("boards-menu").innerHTML +=`
        <li><a class="dropdown-item" name="${respData[i].name}" id="${respData[i].id}">${respData[i].name}</a></li>`;
    }
    ws();
}

async function getNotes(boardId) {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch("http://localhost:8080/notes", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
         }
    });
    const respData = await response.json();
    console.log(respData);

    for (let i in respData) {
        console.log(respData[i].note);
        document.getElementById("board").innerHTML+=`
        <div class="note draggable" id="note">
            <div id="note-header">
                <button class="btn">
                    <img src="./images/green.png" alt="">
                </button>
                <button class="btn">
                    <img src="./images/red.png" alt="">
                </button>
                <button class="btn">
                    <img src="./images/blue.png" alt="">
                </button>
            </div>
            <div class="container" id="note-field">
                <p>blah blah</p>
            </div>
        </div>`;
    }
}

async function saveNewBoard(name) {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch("http://localhost:8080/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}` },
        body: JSON.stringify({
            name: name
        })
    });
    const respData = await response.json();
    console.log(respData);

    getBoards();
}

function ws() {
WS_TOKEN = localStorage.getItem('jwt');
const socket = new WebSocket(`ws://localhost:5000?token=${WS_TOKEN}`);
    
    
socket.onopen = function (event) {
    console.log('Connected to WebSocket server');
};

socket.onmessage = function (event) {
    console.log('Received message:', event.data);
    const data = JSON.parse(event.data);
    if (data.status == 0) {
        document.querySelector('#note').setAttribute("style", data.msg);
    } else {
        
    }
    
};

document.querySelector('#board').addEventListener("mouseup" , (evt) => {
    socket.send(document.querySelector("#note").getAttribute("style"));
});

socket.onclose = function (event) {
    console.log('Connection closed');
};
}

document.querySelector('#btn-login').addEventListener('click', () => {
    const user = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    logIn(user, password);
});

// Change board from menu
document.querySelector("#boards-menu").addEventListener("click", (e) => {
    console.log(e.target);
    let boardName = e.target.name;
    if (e.target.id === "new-board") {
        boardName = prompt("Enter name for new board:");
        saveNewBoard(boardName);
    }
    document.getElementById("board").innerHTML=`<button class="btn btn-primary position-absolute end-0" id="new-note-btn">New note</button>
    <h2>${boardName}</h2>
    <div class="note draggable" id="note">
            <div id="note-header">
                <button class="btn" id="delete-note">X</button>
                <button class="btn">
                    <img src="./images/green.png" alt="">
                </button>
                <button class="btn">
                    <img src="./images/red.png" alt="">
                </button>
                <button class="btn">
                    <img src="./images/blue.png" alt="">
                </button>
            </div>
            <div class="container" id="note-field">
                <input class="form-control id="note-value">Something important</input>
            </div>
        </div>`;
    //getNotes(boardName);
});


//document.getElementById("new-note-btn").addEventListener("click", () => {
//    createNewNote();
//    console.log("New note");
//    //saveNotes(boardId, document.querySelector("#note-field > p").innerText);
//    //console.log(document.querySelectorAll("#note"))
//    //getBoards();
//})



function createNewNote() {
    document.getElementById("board").innerHTML+=`
    <div class="note draggable" id="note">
            <div id="note-header">
                <button class="btn" id="delete-note">X</button>
                <button class="btn">
                    <img src="./images/green.png" alt="">
                </button>
                <button class="btn">
                    <img src="./images/red.png" alt="">
                </button>
                <button class="btn">
                    <img src="./images/blue.png" alt="">
                </button>
            </div>
            <div class="container" id="note-field">
                <p>blah blah</p>
            </div>
        </div>`;
  }


  interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
    
      }
    }
  })

  function dragMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
  
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }

  window.dragMoveListener = dragMoveListener
  
