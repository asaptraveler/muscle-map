function switchTab(tabId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// Заполнить выпадающий список упражнений
const exerciseSelect = document.getElementById("exercise-select");
for (let name in exerciseDatabase) {
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  exerciseSelect.appendChild(opt);
}

// Установить дату по умолчанию — сегодня
document.getElementById("new-date").valueAsDate = new Date();

// Добавление новой тренировки
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

// 👇 Загрузить SVG-карту тела из файла
fetch("muscle-map-front.svg")
  .then(res => res.text())
  .then(svg => {
    document.getElementById("muscle-map").innerHTML = svg;
    applyFilters(); // подсветить активные мышцы
  });

fetch("/api/workout")
  .then(res => res.json())
  .then(data => {
    allData = data;
    applyFilters();
  });
