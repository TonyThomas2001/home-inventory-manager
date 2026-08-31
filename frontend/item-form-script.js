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

  const payload = {
    name: document.getElementById("itemName").value,
    category: document.getElementById("category").value,
    quantity: Number(document.getElementById("quantity").value),
    price: Number(document.getElementById("price").value),
    location: document.getElementById("location").value,
    description: document.getElementById("description").value,
  };

  try {
    await apiFetch("/items", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    alert("Item added successfully!");
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
