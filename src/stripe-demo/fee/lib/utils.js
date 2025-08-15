document.addEventListener("DOMContentLoaded", () => {
    return;
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const userCookie = cookies.find((cookie) => cookie.startsWith("user="));
    
    if (!userCookie || !userCookie.split("=")[1]) {
        window.location.href = "unauthorized.html";
    } else {
        // Extract the cookie value and decode special characters
        const cookieValue = userCookie.split("=")[1];
        const decodedValue = decodeURIComponent(cookieValue);

        // Remove the "j:" prefix if it exists and parse the JSON
        const jsonString = decodedValue.startsWith("j:") ? decodedValue.slice(2) : decodedValue;
        let userData;
        try {
            userData = JSON.parse(jsonString);
        } catch (error) {
            console.error("Failed to parse user data:", error);
            window.location.href = "unauthorized.html";
            return;
        }

        // Update user-card innerText with userData.email
        const userCard = document.getElementById("user-card");
        if(userCard && userData.email) {
            userCard.innerText = userData.email;
        }
    }
});

function getBrandImage(brand) {
  if (!brand) {
    return "unknown.png";
  }

  const lowerBrand = brand.toLowerCase();

  if (lowerBrand.includes("visa")) {
    return "visa.png";
  }
  if (lowerBrand.includes("mastercard")) {
    return "mastercard.png";
  }
  if (lowerBrand.includes("amex") || lowerBrand.includes("american express")) {
    return "amex.png";
  }
  if (lowerBrand.includes("discover")) {
    return "discover.png";
  }
  if (lowerBrand.includes("diners")) {
    return "diners.png";
  }
  if (lowerBrand.includes("jcb")) {
    return "jcb.png";
  }
  // Fallback image if the brand doesn't match any of the above.
  return "unknown.png";
}
