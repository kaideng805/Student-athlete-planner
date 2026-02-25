let activities = JSON.parse(localStorage.getItem("activities")) || [];

document.getElementById("monthPicker").addEventListener("change", renderCalendar);

function saveData() {
  localStorage.setItem("activities", JSON.stringify(activities));
}

function addActivity() {
  const date = document.getElementById("date").value;
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;
  const type = document.getElementById("type").value;
  const text = document.getElementById("activity").value;

  if (!date || !start || !end || !text) {
    alert("Fill everything out");
    return;
  }

  activities.push({ id: Date.now(), date, start, end, type, text });
  saveData();
  renderCalendar();
}

function deleteActivity(id) {
  activities = activities.filter(a => a.id !== id);
  saveData();
  renderCalendar();
}

function editActivity(id) {
  const activity = activities.find(a => a.id === id);
  const newText = prompt("Edit activity:", activity.text);
  if (newText) {
    activity.text = newText;
    saveData();
    renderCalendar();
  }
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const monthValue = document.getElementById("monthPicker").value;
  if (!monthValue) return;

  const year = parseInt(monthValue.split("-")[0]);
  const month = parseInt(monthValue.split("-")[1]) - 1;

  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  daysOfWeek.forEach(day => {
    const div = document.createElement("div");
    div.className = "day-name";
    div.textContent = day;
    calendar.appendChild(div);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const box = document.createElement("div");
    box.className = "day-box";
    box.innerHTML = `<div class="day-number">${day}</div>`;

    for (let hour = 6; hour <= 22; hour++) {
      const hourLine = document.createElement("div");
      hourLine.className = "hour";
      box.appendChild(hourLine);
    }

    const dayActivities = activities.filter(a => a.date === fullDate);

    dayActivities.forEach(a => {
      const startHour = parseInt(a.start.split(":")[0]);
      const endHour = parseInt(a.end.split(":")[0]);

      const block = document.createElement("div");
      block.className = `activity ${a.type}`;
      block.style.top = ((startHour - 6) * 20 + 20) + "px";
      block.style.height = ((endHour - startHour) * 20) + "px";

      block.innerHTML = `
        ${a.start}-${a.end} ${a.text}
        <button onclick="editActivity(${a.id})">✏</button>
        <button onclick="deleteActivity(${a.id})">🗑</button>
      `;

      box.appendChild(block);
    });

    calendar.appendChild(box);
  }
}

renderCalendar();
