const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorBanner = document.getElementById("errorBanner");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value) || password.value.length === 0) {
    errorBanner.textContent = "Invalid email or password.";
    errorBanner.style.display = "block";
    return;
  }

  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.value, password: password.value }),
    });
    errorBanner.style.display = "none";
    saveSession(data);

    window.location.href =
      data.role === "Admin" ? "admin-dashboard.html" : "inventory.html";
  } catch (error) {
    errorBanner.textContent = error.message || "Invalid email or password.";
    errorBanner.style.display = "block";
  }
});

document.getElementById("registerLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "register.html";
});

document
  .getElementById("forgotPasswordLink")
  .addEventListener("click", function (e) {
    e.preventDefault();
    alert("Please contact your admin to reset your password.");
  });

document.getElementById("googleLogin").addEventListener("click", function () {
  console.log("Google login clicked");
});

document.getElementById("appleLogin").addEventListener("click", function () {
  console.log("Apple login clicked");
});
