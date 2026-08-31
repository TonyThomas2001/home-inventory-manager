requireAuth();

const currentUser = getStoredUser();
if (currentUser && currentUser.role === "Admin") {
  document.getElementById("adminDashboardLink").style.display = "inline-block";
}

let items = [];

const grid = document.getElementById("itemGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categoryFilter");
const locationSelect = document.getElementById("locationFilter");
const toast = document.getElementById("toast");

function populateFilters() {
  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const locations = ["All", ...new Set(items.map((i) => i.location))];

  categorySelect.innerHTML = categories
    .map((c) => `<option value="${c}">${c}</option>`)
    .join("");
  locationSelect.innerHTML = locations
    .map((l) => `<option value="${l}">${l}</option>`)
    .join("");
}

function formatPrice(price) {
  return Number(price).toLocaleString("en-US");
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const location = locationSelect.value;

  const filtered = items.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(query);
    const matchesCategory = category === "All" || item.category === category;
    const matchesLocation = location === "All" || item.location === location;
    return matchesQuery && matchesCategory && matchesLocation;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>Category: ${item.category} | Quantity: ${item.quantity}</p>
      <p>Location: ${item.location} | Price: $${formatPrice(item.price)}</p>
      <p>Description: ${item.description || ""}</p>
      <div class="item-actions">
        <button class="edit-btn" data-id="${item._id}">Edit Item</button>
        <button class="delete-btn" data-id="${item._id}">Delete Item</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = `edit-item.html?id=${btn.dataset.id}`;
    });
  });

  grid.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Delete this item?")) return;
      try {
        await apiFetch(`/items/${id}`, { method: "DELETE" });
        items = items.filter((i) => i._id !== id);
        populateFilters();
        render();
        showToast("Item deleted successfully!");
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

async function loadItems() {
  try {
    items = await apiFetch("/items");
    populateFilters();
    render();
  } catch (error) {
    alert(error.message);
  }
}

searchInput.addEventListener("input", render);
categorySelect.addEventListener("change", render);
locationSelect.addEventListener("change", render);

document.getElementById("addItemBtn").addEventListener("click", () => {
  window.location.href = "add-item.html";
});

document.getElementById("addItemBtnTop").addEventListener("click", () => {
  window.location.href = "add-item.html";
});

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  clearSession();
  window.location.href = "login.html";
});

loadItems();
