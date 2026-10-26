const $ = (id) => document.getElementById(id);

const sampleReports = [
  {id:1, location:"Periya Kulam, Kovilpatti", type:"Garbage / plastic waste", description:"Sample report: plastic wrappers seen near the edge of the waterbody.", severity:"Medium", status:"Open", reporter:"Community volunteer", createdAt:"Demo sample"},
  {id:2, location:"Temple Tank (sample)", type:"Water looks polluted", description:"Sample report: water colour looks unusual; inspection may be useful.", severity:"High", status:"Open", reporter:"Resident", createdAt:"Demo sample"},
  {id:3, location:"Village Lake (sample)", type:"Low water level", description:"Sample report: water level appears lower than in the previous season.", severity:"Low", status:"In review", reporter:"Local observer", createdAt:"Demo sample"},
  {id:4, location:"Periya Kulam, Kovilpatti", type:"Blocked inlet / outlet", description:"Sample report: leaves and waste may be obstructing a small inlet.", severity:"Medium", status:"Resolved", reporter:"Community volunteer", createdAt:"Demo sample"}
];
let userReports = [];
let nextId = 5;
let sensor = {level:68, quality:78, temp:28.4, turbidity:12};

function priorityFor(severity, type, description) {
  const text = `${type} ${description}`.toLowerCase();
  if (severity === "High" || /dead fish|chemical|strong smell|overflow|sewage|danger/.test(text)) return "High";
  if (severity === "Low" && !/pollut|garbage|plastic|blocked/.test(text)) return "Low";
  return "Medium";
}
function suggestedAction(type, priority) {
  const t = type.toLowerCase();
  if (priority === "High") return "Request prompt inspection from the appropriate local authority.";
  if (t.includes("garbage") || t.includes("plastic")) return "Community cleanup review; avoid handling unknown waste.";
  if (t.includes("level")) return "Compare with verified local measurements and seasonal records.";
  if (t.includes("blocked")) return "Ask an appropriate local team to inspect the inlet or outlet.";
  if (t.includes("polluted") || t.includes("fish")) return "Request a qualified local inspection; do not touch or enter the water.";
  return "Review the report with community representatives.";
}
function allReports() { return [...userReports, ...sampleReports]; }
function renderReports() {
  const reports = allReports();
  $("totalReports").textContent = String(reports.length).padStart(2,"0");
  $("openReports").textContent = String(reports.filter(r => r.status === "Open").length).padStart(2,"0");
  const high = reports.filter(r => r.status !== "Resolved" && r.severity === "High").length;
  $("aiPriority").textContent = high ? "High" : (reports.some(r => r.status === "Open") ? "Medium" : "Low");
  $("reportsList").innerHTML = reports.map(r => {
    const priority = priorityFor(r.severity, r.type, r.description);
    const icon = /water|pollut|fish|smell/i.test(r.type + r.description) ? "≈" : (/level/i.test(r.type) ? "↓" : "⚑");
    return `<article class="report-item">
      <div class="report-symbol">${icon}</div>
      <div class="report-body">
        <div class="report-meta"><b>${escapeHtml(r.type)}</b><span class="priority ${priority.toLowerCase()}">${priority} priority</span></div>
        <p>${escapeHtml(r.description)}</p>
        <div class="report-location">⌖ ${escapeHtml(r.location)} · ${escapeHtml(r.createdAt)}</div>
        <div class="report-footer"><small>Suggested: ${escapeHtml(suggestedAction(r.type, priority))}</small>
        <select class="status-select" aria-label="Change report status" data-status-id="${r.id}"><option ${r.status==="Open"?"selected":""}>Open</option><option ${r.status==="In review"?"selected":""}>In review</option><option ${r.status==="Resolved"?"selected":""}>Resolved</option></select></div>
      </div>
    </article>`;
  }).join("");
  $("reportsList").querySelectorAll("[data-status-id]").forEach(select => {
    select.addEventListener("change", e => {
      const id = Number(e.target.dataset.statusId);
      const report = userReports.find(r => r.id === id);
      if (report) { report.status = e.target.value; saveUserReports(); renderReports(); showToast("Demo report status updated."); }
      else { const sample = sampleReports.find(r => r.id === id); if(sample){sample.status=e.target.value; renderReports(); showToast("Sample report status updated for this session.");} }
    });
  });
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function updateSensors() {
  sensor.level = Math.max(25, Math.min(95, Math.round(55 + Math.random()*30)));
  sensor.quality = Math.round(45 + Math.random()*50);
  sensor.temp = (25 + Math.random()*8).toFixed(1);
  sensor.turbidity = Math.round(5 + Math.random()*35);
  const quality = sensor.quality >= 72 ? "Good" : sensor.quality >= 55 ? "Fair" : "Needs check";
  $("waterLevel").textContent = sensor.level + "%";
  $("heroLevel").innerHTML = `${sensor.level} <em>%</em>`;
  $("avgLevel").textContent = sensor.level + "%";
  $("waterQuality").textContent = quality;
  $("heroQuality").textContent = quality;
  $("temperature").textContent = sensor.temp + "°C";
  $("turbidity").textContent = sensor.turbidity + " NTU";
  $("levelState").textContent = sensor.level < 40 ? "Low demo reading" : "Normal demo range";
  $("levelState").className = "reading-state " + (sensor.level < 40 ? "warning" : "normal");
  $("qualityState").textContent = quality === "Good" ? "Within demo target" : "Review sample reading";
  $("qualityState").className = "reading-state " + (quality === "Good" ? "normal" : "warning");
  $("turbidityState").textContent = sensor.turbidity > 25 ? "Elevated demo reading" : "Low demo reading";
  $("turbidityState").className = "reading-state " + (sensor.turbidity > 25 ? "warning" : "normal");
  showToast("Simulated sensor readings refreshed. These are not real measurements.");
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3300);
}
function saveUserReports() {
  try { localStorage.setItem("kulam20-demo-reports", JSON.stringify(userReports)); } catch(e) {}
}
function loadUserReports() {
  try {
    const saved = JSON.parse(localStorage.getItem("kulam20-demo-reports") || "[]");
    if (Array.isArray(saved)) userReports = saved;
    if (userReports.length) nextId = Math.max(...userReports.map(r => r.id), 4) + 1;
  } catch(e) { userReports = []; }
}
$("reportForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const location = String(form.get("location") || "").trim();
  const type = String(form.get("issueType") || "").trim();
  const description = String(form.get("description") || "").trim();
  if (!location || !type || !description) { showToast("Please complete all required fields."); return; }
  const severity = String(form.get("severity") || "Medium");
  const priority = priorityFor(severity, type, description);
  const now = new Date().toLocaleString([], {month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"});
  userReports.unshift({
    id:nextId++,
    location,
    type,
    description,
    severity:priority,
    status:"Open",
    reporter:String(form.get("reporter") || "Community member").trim() || "Community member",
    createdAt:now
  });
  saveUserReports();
  renderReports();
  event.currentTarget.reset();
  $("report").scrollIntoView({behavior:"smooth",block:"start"});
  showToast(`Demo report submitted. Suggested priority: ${priority}. ${suggestedAction(type, priority)}`);
});
$("refreshSensors").addEventListener("click", updateSensors);
$("clearDemo").addEventListener("click", () => {
  if (!confirm("Reset locally saved demo reports and restore the original sample reports?")) return;
  userReports = [];
  try { localStorage.removeItem("kulam20-demo-reports"); } catch(e) {}
  sampleReports[0].status = "Open"; sampleReports[1].status = "Open"; sampleReports[2].status = "In review"; sampleReports[3].status = "Resolved";
  renderReports();
  showToast("Demo reports have been reset.");
});
loadUserReports();
renderReports();
