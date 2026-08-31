const form = document.getElementById("registerForm");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const matchError = document.getElementById("matchError");
const emailError = document.getElementById("emailError");
const emailInput = document.getElementById("email");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  let valid = true;

  if (password.value !== confirmPassword.value) {
    matchError.style.display = "block";
    valid = false;
  } else {
    matchError.style.display = "none";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value)) {
    emailError.style.display = "block";
    valid = false;
  } else {
    emailError.style.display = "none";
  }

  if (!valid) return;

  const payload = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: emailInput.value,
    password: password.value,
  };

  try {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    saveSession(data);
    window.location.href = "inventory.html";
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("loginLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "login.html";
});
