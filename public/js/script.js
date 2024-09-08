const fetchBusData = async () => {
  try {
    const response = await fetch("/next-departure");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching bus data: ${error}`);
  }
};

const formatDate = (date) => date.toISOString().split("T")[0];
const formatTime = (date) => date.toTimeString().split(" ")[0].slice(0, 5);

const getTimeRemainingSeconds = (departureTime) => {
  const now = new Date();
  const timeDiference = departureTime - now;
  return Math.floor(timeDiference / 1000)
};

const renderBusData = (buses) => {
  const tableBody = document.querySelector("#bus tbody");
  tableBody.textContent = "";

  buses.forEach((bus) => {
    const row = document.createElement("tr");

    const nextDepartureDateUTC = new Date(
      `${bus.nextDeparture.date}T${bus.nextDeparture.time}Z`
    );

    const remainingSeconds = getTimeRemainingSeconds(nextDepartureDateUTC);
    const remainingTimeText = remainingSeconds < 60 ? 'Отправляется' : bus.nextDeparture.remaining;

    row.innerHTML = `
    <td>${bus.busNumber}</td>
    <td>${bus.startPoint} - ${bus.endPoint}</td>
    <td>${formatDate(nextDepartureDateUTC)}</td>
    <td>${formatTime(nextDepartureDateUTC)}</td>    
    <td>${remainingTimeText}</td>    
    `;
    tableBody.append(row);
  });
};

const initWebSocket = () => {
  const ws = new WebSocket(`wss://${location.host}`);

  ws.addEventListener("open", () => {
    console.log(`Websocked connection`);
  });

  ws.addEventListener("message", (event) => {
    const buses = JSON.parse(event.data);
    renderBusData(buses);
  });

  ws.addEventListener("error", (error) => {
    console.log(`Websocket error: ${error}`);
  });

  ws.addEventListener("close", () => {
    console.log(`Websocket connection close`);
  });
};

const updateTime = () => {
  const currentTimeEl = document.getElementById("current-time");
  const now = new Date();
  currentTimeEl.textContent = now.toTimeString().split(" ")[0];

  setTimeout(updateTime, 1000);
};

const init = async () => {
  const buses = await fetchBusData();
  renderBusData(buses);

  initWebSocket();

  updateTime();
};

init();
