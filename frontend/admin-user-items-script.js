requireAuth();

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get("id"),
    name: decodeURIComponent(params.get("name") || ""),
  };
}

function formatPrice(price) {
  return Number(price).toLocaleString("en-US");
}

async function loadUserItems() {
  const { id } = getParams();
  if (!id) {
    alert("No user selected.");
    window.location.href = "admin-dashboard.html";
    return;
  }

  try {
    const data = await apiFetch(`/admin/users/${id}/items`);
    const { user, items } = data;

    document.getElementById("pageTitle").textContent =
      `${user.firstName} ${user.lastName}'s Inventory`;
    document.getElementById("userSubtitle").textContent =
      `${user.email} (${user.role})`;

    const grid = document.getElementById("itemGrid");
    const emptyState = document.getElementById("emptyState");
    grid.innerHTML = "";

    if (items.length === 0) {
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        <h3></h3>
        <p></p>
        <p></p>
        <p></p>
      `;
      const [h3, pCatQty, pLocPrice, pDesc] = card.children;
      h3.textContent = item.name;
      pCatQty.textContent = `Category: ${item.category} | Quantity: ${item.quantity}`;
      pLocPrice.textContent = `Location: ${item.location} | Price: $${formatPrice(item.price)}`;
      pDesc.textContent = `Description: ${item.description || ""}`;
      grid.appendChild(card);
    });
  } catch (error) {
    alert(error.message);
    window.location.href = "admin-dashboard.html";
  }
}

document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();
  clearSession();
  window.location.href = "login.html";
});

loadUserItems();
