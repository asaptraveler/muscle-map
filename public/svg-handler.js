function highlightMuscles(muscles) {
  const activeMuscles = new Set(muscles);
  const allIds = Array.from(document.querySelectorAll("g")).map(el => el.id);

  allIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("primary");
  });

  activeMuscles.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("primary");
  });
}
