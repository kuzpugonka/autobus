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

const renderBusData = (buses) => {
  const tableBody = document.querySelector("#bus tbody");
  tableBody.textContent = "";

  buses.forEach((bus) => {
    const row = document.createElement("tr");

    const nextDepartureDateUTC = new Date(
      `${bus.nextDeparture.date}T${bus.nextDeparture.time}Z`
    );

    row.innerHTML = `
    <td>${bus.busNumber}</td>
    <td>${bus.startPoint} - ${bus.endPoint}</td>
    <td>${formatDate(nextDepartureDateUTC)}</td>
    <td>${formatTime(nextDepartureDateUTC)}</td>
    
    `;
    tableBody.append(row);
  });
};

const init = async () => {
  const buses = await fetchBusData();
  renderBusData(buses);
};
init();
