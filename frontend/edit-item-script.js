requireAuth();

const form = document.getElementById("itemForm");

const currentUser = getStoredUser();
if (currentUser && currentUser.role === "Admin") {
  document.getElementById("adminDashboardLink").style.display = "inline-block";
}

const requiredFields = [
  { id: "itemName", fieldId: "nameField" },
  { id: "category", fieldId: "categoryField" },
  { id: "quantity", fieldId: "quantityField" },
  { id: "price", fieldId: "priceField" },
  { id: "location", fieldId: "locationField" },
];

function getItemIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadItem() {
  const id = getItemIdFromUrl();
  if (!id) {
    alert("No item selected.");
    window.location.href = "inventory.html";
    return;
  }

  try {
    const items = await apiFetch("/items");
    const item = items.find((i) => i._id === id);

    if (!item) {
      alert("Item not found.");
      window.location.href = "inventory.html";
      return;
    }

    document.getElementById("itemName").value = item.name;
    document.getElementById("category").value = item.category;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("price").value = item.price;
    document.getElementById("location").value = item.location;
    document.getElementById("description").value = item.description || "";
  } catch (error) {
    alert(error.message);
  }
}

function clearErrors() {
  requiredFields.forEach(({ fieldId }) => {
    const field = document.getElementById(fieldId);
    field.classList.remove("has-error");
    field.querySelector(".error-text").style.display = "none";
  });
}

function showError(fieldId) {
  const field = document.getElementById(fieldId);
  field.classList.add("has-error");
  field.querySelector(".error-text").style.display = "block";
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  clearErrors();

  let valid = true;
  requiredFields.forEach(({ id, fieldId }) => {
    const el = document.getElementById(id);
    if (!el.value || (el.type === "number" && el.value.trim() === "")) {
      showError(fieldId);
      valid = false;
    }
  });

  if (!valid) return;

  const id = getItemIdFromUrl();
  const payload = {
    name: document.getElementById("itemName").value,
    category: document.getElementById("category").value,
    quantity: Number(document.getElementById("quantity").value),
    price: Number(document.getElementById("price").value),
    location: document.getElementById("location").value,
    description: document.getElementById("description").value,
  };

  try {
    await apiFetch(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    alert("Item updated successfully!");
    window.location.href = "inventory.html";
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("cancelBtn").addEventListener("click", function () {
  window.location.href = "inventory.html";
});

document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();
  clearSession();
  window.location.href = "login.html";
});

loadItem();
