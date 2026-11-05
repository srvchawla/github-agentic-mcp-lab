const STORAGE_KEY = "agentic-lab-progress-v1";
const THEME_KEY = "agentic-lab-theme";
const checkboxes = [...document.querySelectorAll("[data-complete]")];
const validIds = new Set(checkboxes.map((checkbox) => checkbox.dataset.complete));
const completed = new Set();
const announcement = document.querySelector("#announcement");
const storageNotice = document.querySelector("#storage-notice");

function notifyStorage(message, error) {
  console.warn(message, error);
  storageNotice.textContent = message;
  storageNotice.hidden = false;
}

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (!Array.isArray(saved) || !saved.every((id) => typeof id === "string" && validIds.has(id))) {
    throw new Error("Saved progress has an unsupported format.");
  }
  saved.forEach((id) => completed.add(id));
} catch (error) {
  notifyStorage("Saved progress could not be loaded. You can still use the checkboxes in this session.", error);
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  } catch (error) {
    notifyStorage("Your browser could not save progress. Your current progress will be lost when this page closes.", error);
  }
}

function renderProgress() {
  checkboxes.forEach((checkbox) => {
    const done = completed.has(checkbox.dataset.complete);
    checkbox.checked = done;
    checkbox.nextElementSibling.textContent = done ? "Lab completed" : "Mark lab complete";
  });
  document.querySelectorAll("[data-lab-nav]").forEach((link) => {
    const done = completed.has(link.dataset.labNav);
    link.querySelector(".nav-completion").textContent = done ? "✓" : "";
    if (done) link.setAttribute("aria-label", `${link.querySelector("span:nth-child(2)").textContent.trim()} — completed`);
    else link.removeAttribute("aria-label");
  });
  document.querySelectorAll("[data-card-status]").forEach((status) => {
    const done = completed.has(status.dataset.cardStatus);
    status.textContent = done ? "✓ Completed" : "Not started";
    status.classList.toggle("complete", done);
  });
  const total = checkboxes.length;
  document.querySelector("#progress-count").textContent = `${completed.size} / ${total}`;
  const bar = document.querySelector("#progress-bar");
  bar.max = total;
  bar.value = completed.size;
  document.querySelector("#progress-message").textContent =
    completed.size === total ? "All labs complete. Now go build something great." :
    completed.size ? "Nice work. Keep building your next capability." :
    "Every great workflow starts with a first step.";
  const next = checkboxes.find((checkbox) => !completed.has(checkbox.dataset.complete));
  const start = document.querySelector("#start-learning");
  start.href = next ? `#lab-${next.dataset.complete}` : "#lab-0";
  start.firstChild.textContent = completed.size ? (next ? "Continue learning " : "Revisit the labs ") : "Start the workshop ";
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) completed.add(checkbox.dataset.complete);
    else completed.delete(checkbox.dataset.complete);
    saveProgress();
    renderProgress();
    announcement.textContent = `${completed.size} of ${checkboxes.length} labs complete.`;
  });
});
renderProgress();

const themeButton = document.querySelector("#theme-toggle");
const systemTheme = matchMedia("(prefers-color-scheme: dark)");
let savedTheme = null;
try {
  savedTheme = localStorage.getItem(THEME_KEY);
} catch (error) {
  notifyStorage("Your theme preference cannot be loaded. Using your system theme.", error);
}
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  themeButton.title = themeButton.getAttribute("aria-label");
}
setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : systemTheme.matches ? "dark" : "light");
systemTheme.addEventListener("change", (event) => {
  if (savedTheme !== "dark" && savedTheme !== "light") setTheme(event.matches ? "dark" : "light");
});
themeButton.addEventListener("click", () => {
  savedTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(savedTheme);
  try {
    localStorage.setItem(THEME_KEY, savedTheme);
  } catch (error) {
    notifyStorage("Your browser could not save the theme. It will apply only to this session.", error);
  }
});

const sidebar = document.querySelector("#sidebar");
const menuButton = document.querySelector("#menu-toggle");
function closeMenu() {
  sidebar.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open lab navigation");
}
menuButton.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", `${open ? "Close" : "Open"} lab navigation`);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
const views = [...document.querySelectorAll("[data-view]")];
function navigate(focusHeading = false) {
  const requested = location.hash.slice(1) || "overview";
  const target = views.find((view) => view.dataset.view === requested);
  const viewId = target ? requested : "overview";
  views.forEach((view) => { view.hidden = view.dataset.view !== viewId; });
  document.querySelectorAll(".sidebar nav a").forEach((link) => {
    const active = link.hash === `#${viewId}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  const currentView = views.find((view) => !view.hidden);
  const heading = currentView.querySelector("h1");
  document.title = viewId === "overview" ? "Agentic Workflows + MCP · Hands-on Lab" : `${heading.textContent} · Agentic Lab`;
  closeMenu();
  if (requested === "playground") {
    document.querySelector("#playground").scrollIntoView();
  } else if (focusHeading) {
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.focus({ preventScroll: true });
  }
}
window.addEventListener("hashchange", () => navigate(true));
navigate();

const resetDialog = document.querySelector("#reset-dialog");
document.querySelector("#reset-progress").addEventListener("click", () => resetDialog.showModal());
resetDialog.addEventListener("close", () => {
  if (resetDialog.returnValue !== "reset") return;
  completed.clear();
  saveProgress();
  renderProgress();
  announcement.textContent = "Lab progress reset.";
});

document.querySelectorAll(".markdown-body pre").forEach((pre, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-button";
  button.textContent = "Copy";
  button.setAttribute("aria-label", `Copy code example ${index + 1}`);
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pre.querySelector("code").textContent);
      button.textContent = "Copied!";
      announcement.textContent = "Code copied to clipboard.";
      setTimeout(() => { button.textContent = "Copy"; }, 1800);
    } catch (error) {
      console.warn("Clipboard write failed.", error);
      button.textContent = "Select code to copy";
      announcement.textContent = "Clipboard access failed. Select the code and copy it manually.";
    }
  });
  pre.append(button);
});

document.querySelector("#test-permission").addEventListener("click", () => {
  const action = document.querySelector("#requested-action").value;
  const allowed = ["add-labels", "add-comment"].includes(action);
  const result = document.querySelector("#permission-result");
  result.className = `permission-result ${allowed ? "allowed" : "blocked"}`;
  result.querySelector(".result-symbol").textContent = allowed ? "✓" : "⊘";
  result.querySelector("strong").textContent = allowed ? "Allowed. Explicitly scoped, safely applied." : "Blocked. A request cannot grant permission.";
  result.querySelector("p").textContent = allowed
    ? `${action} is declared in safe-outputs. A separate job can apply this approved operation; the agent remains read-only.`
    : `${action} is not in this allowlist. The issue stays unchanged, even if its body asks the agent to do it.`;
});
