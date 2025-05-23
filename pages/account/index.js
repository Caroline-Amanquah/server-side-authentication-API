// pages/account/index.js
document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Fetch user data from the backend
    const response = await fetch("http://localhost:3000/api/users/user", {
      method: "GET",
      credentials: "include", // Include the auth-cookie
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Data received from backend:", data);

      // Update DOM with user data
      if (data.name && data.referenceNumber) {
        document.getElementById("user-name").textContent = data.name;
        document.getElementById("reference-number").textContent = data.referenceNumber;

        // Save data to local storage for potential use
        localStorage.setItem("userName", data.name);
        localStorage.setItem("referenceNumber", data.referenceNumber);
      } else {
        throw new Error("User data is missing in the response.");
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user data.");
    }
  } catch (error) {
    console.error("Error loading account data from backend:", error);

    // Redirect to login page if user is not authenticated
    window.location.href = "/";
  }

  // Populate fields from localStorage as fallback
  const userName = localStorage.getItem("userName");
  const referenceNumber = localStorage.getItem("referenceNumber");

  if (userName && referenceNumber) {
    const userNameElement = document.getElementById("user-name");
    const referenceNumberElement = document.getElementById("reference-number");

    if (userNameElement) userNameElement.textContent = userName;
    if (referenceNumberElement) referenceNumberElement.textContent = referenceNumber;
  }

  // Logout button functionality
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton && !logoutButton.dataset.listenerAdded) {
    logoutButton.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const response = await fetch("http://localhost:3000/api/logout", {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log("User logged out successfully");
          window.location.href = "/";
        } else {
          const data = await response.json();
          console.error("Logout failed:", data.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    });

    logoutButton.dataset.listenerAdded = "true"; // Prevent duplicate listeners
  }
});
