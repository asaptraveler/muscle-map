function switchTab(tabId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

const exerciseSelect = document.getElementById("exercise-select");
for (let name in exerciseDatabase) {
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  exerciseSelect.appendChild(opt);
}

document.getElementById("new-date").valueAsDate = new Date();

function addWorkoutEntry() {
  const name = document.getElementById("exercise-select").value;
  const date = document.getElementById("new-date").value;
  const sets = parseInt(document.getElementById("new-sets").value);
  const reps = parseInt(document.getElementById("new-reps").value);
  const weight = document.getElementById("new-weight").value;
  const muscles = exerciseDatabase[name] || [];

  const entry = { name, date, sets, reps, weight, muscles };
  allData.unshift(entry);

  document.getElementById("add-status").textContent = `✅ Добавлено: ${name}`;
  applyFilters();
  switchTab("dashboard");
}
