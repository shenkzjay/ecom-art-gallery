import fetch from "node-fetch";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import axios from "axios";

async function testShippingRoute() {
  // Create a new cookie jar to ensure no existing session cookies are used
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  try {
    // Try to access the shipping route without a session
    const response = await client.get("http://localhost:3000/order/shipping/123", {
      maxRedirects: 0, // Don't follow redirects
      validateStatus: () => true, // Accept all status codes
    });

    console.log("Status:", response.status);
    console.log("Redirect URL:", response.headers.location);

    // Check if redirected to login
    if (response.headers.location && response.headers.location.includes("/auth/login")) {
      console.log("Successfully redirected to login page");
    } else {
      console.log("Not redirected to login page");
    }
  } catch (error) {
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Redirect URL:", error.response.headers.location);

      // Check if redirected to login
      if (
        error.response.headers.location &&
        error.response.headers.location.includes("/auth/login")
      ) {
        console.log("Successfully redirected to login page");
      } else {
        console.log("Not redirected to login page");
      }
    } else {
      console.error("Error:", error.message);
    }
  }
}

testShippingRoute().catch(console.error);
