const API_BASE_URL = "https://rentcar.stepprojects.ge/api/Users";
      const TOKEN_KEY = "authToken";
      const USER_KEY = "currentUser";
 
      // Initialize on page load
      document.addEventListener("DOMContentLoaded", () => {
        checkAuthStatus();
      });

      // helper to know whether we are on the login/register page
      function isLoginPage() {
        return document.getElementById("registerForm") !== null;
      }
 
      // Check if user is already logged in
      function checkAuthStatus() {
        const token = localStorage.getItem(TOKEN_KEY);
        const user = localStorage.getItem(USER_KEY);
 
        if (token && user) {
          showUserInHeader(JSON.parse(user));
          document.getElementById("logoutBtn").classList.remove("hidden");
          if (isLoginPage()) {
            showAuthenticatedState();
          }
        } else {
          if (isLoginPage()) {
            showUnauthenticatedState();
          }
        }
      }
 
      // Toggle between login and register forms
      function toggleForms() {
        document.getElementById("registerForm").classList.toggle("hidden");
        document.getElementById("loginForm").classList.toggle("hidden");
        clearMessages();
      }
 
      // Handle Registration
      async function handleRegister(event) {
        event.preventDefault();
 
        const phoneNumber = document.getElementById("regPhoneNumber").value;
        const email = document.getElementById("regEmail").value;
        const firstName = document.getElementById("regFirstName").value;
        const lastName = document.getElementById("regLastName").value;
        const password = document.getElementById("regPassword").value;
        const role = document.getElementById("regRole").value;
 
        if (password.length < 6) {
          showMessage(
            "registerMessage",
            "Password must be at least 6 characters",
            "error",
          );
          return;
        }
 
        const registerData = {
          phoneNumber,
          email,
          firstName,
          lastName,
          password,
          role,
        };
 
        try {
          const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
          });
 
          const data = await response.json();
 
          if (response.ok) {
            showMessage(
              "registerMessage",
              "Registration successful! Logging you in...",
              "success",
            );
            setTimeout(() => {
              document.getElementById("loginPhoneNumber").value = phoneNumber;
              document.getElementById("loginPassword").value = password;
              toggleForms();
            }, 1500);
          } else {
            showMessage(
              "registerMessage",
              data.message || "Registration failed",
              "error",
            );
          }
        } catch (error) {
          showMessage("registerMessage", "Error: " + error.message, "error");
          console.error("Registration error:", error);
        }
      }
 
      // Handle Login
      async function handleLogin(event) {
        event.preventDefault();
 
        const phoneNumber = document.getElementById("loginPhoneNumber").value;
        const password = document.getElementById("loginPassword").value;
 
        const loginData = {
          phoneNumber,
          password,
        };
 
        try {
          const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          });
 
          const data = await response.json();
 
          if (response.ok) {
            // Store user data and token
            localStorage.setItem(TOKEN_KEY, data.token || data.phoneNumber);
            localStorage.setItem(
              USER_KEY,
              JSON.stringify({
                phoneNumber: data.phoneNumber,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
              }),
            );
 
            showMessage("loginMessage", "Login successful!", "success");
 
            setTimeout(() => {
              showUserInHeader(JSON.parse(localStorage.getItem(USER_KEY)));
              showAuthenticatedState();
              clearForms();
            }, 1000);
          } else {
            showMessage(
              "loginMessage",
              data.message || "Login failed. Please check your credentials.",
              "error",
            );
          }
        } catch (error) {
          showMessage("loginMessage", "Error: " + error.message, "error");
          console.error("Login error:", error);
        }
      }
 
      // Show user information in header
      function showUserInHeader(user) {
        const displayName = `${user.firstName} ${user.lastName}`;
        document.getElementById("userDisplayName").textContent = displayName;
        document.getElementById("userDisplayArea").classList.remove("hidden");
        document.getElementById("notLoggedInArea").classList.add("hidden");
      }
 
      // Logout function
      function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        document.getElementById("userDisplayArea").classList.add("hidden");
        document.getElementById("notLoggedInArea").classList.remove("hidden");
        document.getElementById("logoutBtn").classList.add("hidden");
        showUnauthenticatedState();
        clearForms();
      }
 
      // Show authenticated state (only on the login/register page)
      function showAuthenticatedState() {
        if (!isLoginPage()) return;
        document.getElementById("registerForm").classList.add("hidden");
        document.getElementById("loginForm").classList.add("hidden");
        document.getElementById("logoutBtn").classList.remove("hidden");
 
        const welcomeDiv = document.createElement("div");
        welcomeDiv.className = "auth-box";
        welcomeDiv.innerHTML = `
                <h2 class="form-title">Welcome!</h2>
                <p style="text-align: center; color: #666; font-size: 16px;">
                    You are successfully logged in. You can now choose your favorite dishes .
                </p>
            `;
 
        const container = document.querySelector(".container");
        container.innerHTML = "";
        container.appendChild(welcomeDiv);
      }
 
      // Show unauthenticated state (only on the login/register page)
      function showUnauthenticatedState() {
        if (!isLoginPage()) return;
        document.getElementById("registerForm").classList.remove("hidden");
        document.getElementById("loginForm").classList.add("hidden");
        document.getElementById("logoutBtn").classList.add("hidden");
 
        const container = document.querySelector(".container");
        if (
          container.querySelector(
            ".auth-box:not(#registerForm):not(#loginForm)",
          )
        ) {
          container.innerHTML = "";
          container.appendChild(document.getElementById("registerForm"));
          container.appendChild(document.getElementById("loginForm"));
        }
      }
 
      // Show message
      function showMessage(elementId, message, type) {
        const messageDiv = document.getElementById(elementId);
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
      }
 
      // Clear all messages
      function clearMessages() {
        document.getElementById("registerMessage").innerHTML = "";
        document.getElementById("loginMessage").innerHTML = "";
      }
 
      // Clear form inputs
      function clearForms() {
        document.getElementById("registerForm").reset();
        document.getElementById("loginForm").reset();
      }