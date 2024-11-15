//frontend/dist/login.js
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const feedback = document.getElementById("feedback");
  
    const emailInput = document.getElementById("event-name");
    const passwordInput = document.getElementById("password-input");
  
    const toggleButton = document.querySelector(".govuk-js-password-input-toggle");
    if (toggleButton && passwordInput) {
        toggleButton.addEventListener("click", function () {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";
            toggleButton.textContent = isPassword ? "Hide" : "Show";
            toggleButton.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
        });
      }
  })
  
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission
  
    if (validateForm()) {
      try {
        const email = emailInput.value;
        const password = passwordInput.value;
        let userExists = false;
        let userData = null;
  
        // Check if user exists by fetching all users
        const userCheckResponse = await fetch("http://localhost:3000/api/users", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
  
        if (userCheckResponse.ok) {
          const users = await userCheckResponse.json();
  
          // Find if the user already exists
          userData = users.find((user) => user.email === email);
  
          if (userData) {
            userExists = true;
          }
        }
  
        if (userExists) {
          // If user exists, redirect to account page with existing details
          localStorage.setItem("userName", userData.name);
          localStorage.setItem("referenceNumber", userData.referenceNumber);
  
          feedback.textContent = "Welcome back!";
          feedback.classList.add("govuk-notification-banner--success");
          feedback.style.display = "block";
  
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          // If user doesn't exist, proceed with account creation
          const response = await fetch("http://localhost:3000/api/user", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: fullNameInput.value, email, password }),
            cache: "no-store",
          });
  
          const data = await response.json();
  
          if (response.ok) {
            // Save user data to localStorage for retrieval on the account page
            localStorage.setItem("userName", data.user.name);
            localStorage.setItem("referenceNumber", data.user.referenceNumber);
  
            feedback.textContent = "Account created successfully!";
            feedback.classList.add("govuk-notification-banner--success");
            feedback.style.display = "block";
            form.reset();
  
            setTimeout(() => {
              window.location.href = "/account";
            }, 3000);
          } else {
            feedback.textContent = data.message || "Error creating account";
            feedback.classList.add("govuk-notification-banner--error");
            feedback.style.display = "block";
          }
        }
      } catch (error) {
        console.error("Error:", error);
        feedback.textContent = "An unexpected error occurred. Please try again later.";
        feedback.classList.add("govuk-notification-banner--error");
        feedback.style.display = "block";
      }
    }
  });
  
  // Validation functions
  
  emailInput.addEventListener("input", validateEmail);
  passwordInput.addEventListener("input", validatePassword);
  
  function validateForm() {
      let formIsValid = true;
      if (!validateEmail()) formIsValid = false;
      if (!validatePassword()) formIsValid = false;
      return formIsValid;
  }
  
  function validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
          displayError(emailInput, "email-error", "Email is required.");
          return false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
          displayError(emailInput, "email-error", "Enter an email in the correct format, like name@gmail.com.");
          return false;
      } else {
          clearError(emailInput, "email-error");
          return true;
      }
  }
  
  function validatePassword() {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;
      if (!passwordInput.value.trim()) {
          displayError(passwordInput, "password-error", "Password is required.");
          return false;
      } else if (!passwordRegex.test(passwordInput.value.trim())) {
          displayError(passwordInput, "password-error", "Password must contain uppercase, lowercase, digit, and special character.");
          return false;
      } else {
          clearError(passwordInput, "password-error");
          return true;
      }
  }
  
  function displayError(inputElement, errorId, errorMessage) {
      const formGroup = inputElement.closest(".govuk-form-group");
      formGroup.classList.add("govuk-form-group--error");
      inputElement.classList.add("govuk-input--error");
  
      let errorElement = document.getElementById(errorId);
      if (!errorElement) {
          errorElement = document.createElement("p");
          errorElement.id = errorId;
          errorElement.className = "govuk-error-message";
          errorElement.innerHTML = `<span class="govuk-visually-hidden">Error:</span> ${errorMessage}`;
          const labelElement = formGroup.querySelector("label, legend");
          formGroup.insertBefore(errorElement, labelElement.nextSibling);
      }
  
      inputElement.setAttribute("aria-describedby", errorId);
  }
  
  function clearError(inputElement, errorId) {
      const formGroup = inputElement.closest(".govuk-form-group");
      formGroup.classList.remove("govuk-form-group--error");
      inputElement.classList.remove("govuk-input--error");
  
      const errorElement = document.getElementById(errorId);
      if (errorElement) {
          errorElement.remove();
      }
  
      inputElement.removeAttribute("aria-describedby");
  }
  