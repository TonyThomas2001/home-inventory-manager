requireAuth();

let users = [];

const tableBody = document.getElementById("userTableBody");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const registeredUsersEl = document.getElementById("registeredUsersCount");
const totalItemsEl = document.getElementById("totalItemsCount");

async function loadStats() {
  try {
    const stats = await apiFetch("/admin/stats");
    registeredUsersEl.textContent = stats.registeredUsers;
    totalItemsEl.textContent = stats.totalItems;
  } catch (error) {
    console.error(error.message);
  }
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const role = roleFilter.value;

  const filtered = users.filter((u) => {
    const matchesQuery =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query);
    const matchesRole = role === "All" || u.role === role;
    return matchesQuery && matchesRole;
  });

  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
    filtered.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.firstName} ${user.lastName}</td>
        <td>${user.email}</td>
        <td class="role">${user.role}</td>
        <td class="items-col">${user.itemCount}</td>
        <td class="action-col">
          <div class="action-buttons">
            <button class="view-items-link" data-id="${user._id}" data-name="${user.firstName} ${user.lastName}">View Items</button>
            <button class="delete-link" data-id="${user._id}">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    tableBody.querySelectorAll(".view-items-link").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const name = encodeURIComponent(btn.dataset.name);
        window.location.href = `admin-user-items.html?id=${id}&name=${name}`;
      });
    });

    tableBody.querySelectorAll(".delete-link").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const user = users.find((u) => u._id === id);
        if (
          !user ||
          !confirm(`Remove ${user.firstName} ${user.lastName} from the system?`)
        )
          return;
        try {
          await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
          users = users.filter((u) => u._id !== id);
          loadStats();
          render();
        } catch (error) {
          alert(error.message);
        }
      });
    });
  }
}

async function loadUsers() {
  try {
    users = await apiFetch("/admin/users");
    render();
  } catch (error) {
    alert(error.message);
    window.location.href = "inventory.html";
  }
}

searchInput.addEventListener("input", render);
roleFilter.addEventListener("change", render);

document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();
  clearSession();
  window.location.href = "login.html";
});

loadStats();
loadUsers();
