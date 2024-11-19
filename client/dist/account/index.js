document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("http://localhost:3000/api/user", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Data received from backend:", data);


      if (user) {
        const userNameElement = document.getElementById("user-name");
        const referenceNumberElement = document.getElementById("reference-number");

        if (userNameElement && user.name) {
          userNameElement.textContent = user.name;
          localStorage.setItem("userName", user.name);
        }

        if (referenceNumberElement && user.referenceNumber) {
          referenceNumberElement.textContent = user.referenceNumber;
          localStorage.setItem("referenceNumber", user.referenceNumber);
        }
      } else {
        throw new Error("User data not found in the response.");
      }
    } else {
      throw new Error("Failed to fetch user account data from the backend.");
    }
  } catch (error) {
    console.error("Error loading account data from backend:", error);
  }

  const userName = localStorage.getItem("userName");
  const referenceNumber = localStorage.getItem("referenceNumber");

  if (userName && referenceNumber) {
    const userNameElement = document.getElementById("user-name");
    const referenceNumberElement = document.getElementById("reference-number");

    if (userNameElement) userNameElement.textContent = userName;
    if (referenceNumberElement) referenceNumberElement.textContent = referenceNumber;
  } else {
    window.location.href = "/";
  }


  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", async function (event) {
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
          window.location.href = "http://localhost:3000";
        } else {
          const data = await response.json();
          console.error("Logout failed:", data.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    });
  } else {
    console.error("Logout button not found in the DOM.");
  }
});
