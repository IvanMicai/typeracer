(() => {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const wsMessage = document.querySelector('#wsMessage');
  const roomCurerntText = document.querySelector('#roomCurrentText');
  const roomScoreBoard = document.querySelector('#roomScoreBoard');
  const roomName = document.querySelector('#roomName');

  /* Buttons */
  const formEnterButton = document.querySelector('#formEnter');
  const roomExitButton = document.querySelector('#roomExit');
  const roomReadyButton = document.querySelector('#roomReady');
  const roomStatusRunning = document.querySelector('#roomStatusRunning');
  const roomStatusWaiting = document.querySelector('#roomStatusWaiting');
  const roomStatusSpectating = document.querySelector('#roomStatusSpectating');
  const roomStatusFinished = document.querySelector('#roomStatusFinished');
  const roomKeystrokes = document.querySelector('#roomKeystrokes')
  const roomActiveUsers = document.querySelector('#roomActiveUsers')
  const roomActiveSince = document.querySelector('#roomActiveSince')
  const roomCounter = document.querySelector('#roomCounter')
  const roomBelowMean = document.querySelector('#roomBelowMean')
  /*  Forms */
  const usernameInput = document.querySelector('#usernameInput');
  const roomInput = document.querySelector('#roomInput');
  const roomTextArea = document.querySelector('#roomTextArea');
  /* Containers */
  const roomTyperacerDiv = document.querySelector('#roomTyperacer');
  const formTyperacerDiv = document.querySelector('#formTyperacer');

  /* Context */
  let currentRoom = {};
  let currentText = ''
  let ws;

  /* Interface Actions */
  formEnterButton.onclick = () => {
    formTyperacerDiv.classList.add('d-none')
    roomTyperacerDiv.classList.remove('d-none')

    const roomname = roomInput.value;
    const username = usernameInput.value;

    currentRoom = JSON.parse(httpGet(`http://${location.host}/room/${roomname}/user/${username}`))
    updateInterface(currentRoom)

    wsStartup();
  }

  roomExitButton.onclick = () => {
    formTyperacerDiv.classList.remove('d-none')
    roomTyperacerDiv.classList.add('d-none')

    wsShutdown();
  }

  /* WebSockert handler */
  const wsStartup = () => {
    const roomname = roomInput.value;
    const username = usernameInput.value;

    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://${location.host}?room=${roomname}&username=${username}`);

    ws.onmessage = (e) => wsProcess(e);
    ws.onerror = () => console.log('WebSocket error');
    ws.onopen = () => console.log('WebSocket connection established');
    ws.onclose = () => console.log('WebSocket connection closed');
  }

  const wsShutdown = () => {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }
  }

  roomReadyButton.onclick = () => {
    const roomname = roomInput.value;
    const username = usernameInput.value;

    wsSendMessage({ type: 'ready', data: { username, roomname } });
    roomTextArea.focus();
  }

  const wsSendMessage = (msg) => {
    if (!ws) {
      return false;
    }

    ws.send(JSON.stringify(msg));
  };

  const updateRommName = (name) => {
    roomName.innerHTML = name;
  }

  const updateScoreBoard = (scoreBoard) => {
    let html = '';

    for (let i = 0; i < Object.keys(scoreBoard).length; i++) {
      html += `<tr>`
      html += `<td scope='row'>${i + 1}</td>`
      html += `<td>${Object.keys(scoreBoard)[i]}</td>`
      html += `<td>${scoreBoard[Object.keys(scoreBoard)[i]].score}</td>`
      switch (scoreBoard[Object.keys(scoreBoard)[i]].status) {
        case 'running':
          html += '<td><span class="badge badge-primary">Running...</span></td>'
          break;
        case 'ready':
          html += '<td><span class="badge badge-success">Ready</span></td>'
          break;
        case 'finished':
          html += '<td><span class="badge badge-info">Finished</span></td>'
          break;
        case 'waiting':
          html += '<td><span class="badge badge-secondary">Waiting for players...</span></td>'
          break;
        case 'spectating':
          html += '<td><span class="badge badge-dark">Spectating...</span></td>'
          break;
      }
      html += `</tr>`
    }

    roomScoreBoard.innerHTML = html;
  }

  const roomStatus = (room) => {
    roomStatusWaiting.classList.add('d-none')
    roomStatusRunning.classList.add('d-none')
    roomStatusSpectating.classList.add('d-none')
    roomStatusFinished.classList.add('d-none')

    switch (room.status) {
      case 'waiting':
        roomStatusWaiting.classList.remove('d-none')
        break;
      case 'running':
        roomStatusRunning.classList.remove('d-none')
        break;
      case 'spectating':
        roomStatusSpectating.classList.remove('d-none')
        break;
      case 'finished':
        roomStatusFinished.classList.remove('d-none')
        break;
    }

    roomKeystrokes.innerText = room.keystrokes;
    roomActiveUsers.innerText = room.active_users;
    roomActiveSince.innerText = room.active_since;
    roomCounter.innerText = room.counter;
    roomBelowMean.innerText = room.below_mean;
  }

  roomTextArea.oninput = () => {
    const data = {
      username: usernameInput.value,
      roomname: roomInput.value,
      cursor: roomTextArea.value.length - 1,
      character: roomTextArea.value[roomTextArea.value.length - 1],
    };

    wsSendMessage({ type: 'typing', data })
  }

  const wsProcess = (e) => {
    const data = JSON.parse(e.data)
    console.log(data)
    if (data.type == 'status') {
      updateInterface(data)
    } else if (data.type == 'start') {
      console.log('start hhah', data.text)
      currentRoom.text = data.text
    }
  }

  const updateInterface = (data) => {
    roomStatus(data)
    updateRommName(data.name)
    updateScoreBoard(data.score_board)
    correctCursor = data.score_board[usernameInput.value].correctCursor
    roomCurerntText.innerHTML = textColor({ correctCursor, currentCursor: roomTextArea.value.length - 1 });
  }

  const textColor = ({ correctCursor, currentCursor }) => {
    currentCursor += 1;

    let html = '';
    if (!currentRoom.text) {
      return '';
    }

    for (let i = 0; i < currentRoom.text.length && i <= correctCursor; i++) {
      html += currentRoom.text[i].fontcolor('green');
    }

    for (let i = correctCursor + 1; i < currentRoom.text.length && i < currentCursor; i++) {
      html += currentRoom.text[i].fontcolor('red');
    }

    html += currentRoom.text.slice(Math.max(correctCursor, currentCursor), currentRoom.text.length);

    return html;
  }


  /* Utilities */
  const httpGet = (url) => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
  }

})();