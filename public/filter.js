function applyFilters() {
  const startDate = document.getElementById("date-start").value;
  const endDate = document.getElementById("date-end").value;
  const limit7 = document.getElementById("limit-7days").checked;

  let filtered = [...allData];

  if (startDate) {
    filtered = filtered.filter(row => row.date >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter(row => row.date <= endDate);
  }

  if (limit7 && !startDate && !endDate) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const formatted = weekAgo.toISOString().slice(0, 10);
    filtered = filtered.filter(row => row.date >= formatted);
  }

  renderTableAndSVG(filtered);
}

function resetFilters() {
  document.getElementById("date-start").value = "";
  document.getElementById("date-end").value = "";
  applyFilters();
}

function renderTableAndSVG(data) {
  const tableDiv = document.getElementById("workout-table");
  tableDiv.innerHTML = "";

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Exercise</th><th>Muscles</th><th>Date</th><th>Sets</th><th>Reps</th><th>Weight</th></tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.muscles.join(", ")}</td>
      <td>${entry.date}</td>
      <td>${entry.sets}</td>
      <td>${entry.reps}</td>
      <td>${entry.weight}</td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableDiv.appendChild(table);

  // Отрисовать SVG
  highlightMuscles(data.flatMap(e => e.muscles));
}
