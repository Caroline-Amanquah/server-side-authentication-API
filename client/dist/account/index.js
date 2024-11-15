// frontend/dist/account/index.js

document.addEventListener("DOMContentLoaded", async function () {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Data received from backend:", data); // Log the data to confirm structure
  
        // Assuming `data` is an array and the first user is the target
        const user = data[0];
  
        // Populate user name and reference number if they exist in the response
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
  
    // Fallback to localStorage if backend fetch fails
    const userName = localStorage.getItem("userName");
    const referenceNumber = localStorage.getItem("referenceNumber");
  
    if (userName && referenceNumber) {
      document.getElementById("user-name").textContent = userName;
      document.getElementById("reference-number").textContent = referenceNumber;
    } else {
      window.location.href = "/";
    }

  });
  
  document.getElementById('logout-button').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent default link behavior

    try {
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Logged out successfully');
        window.location.href = '/'; // Redirect to home page after logout
      } else {
        const data = await response.json();
        console.error('Logout failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  });