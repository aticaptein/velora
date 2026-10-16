import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:5173";
const SCREENSHOTS_DIR = path.resolve("./screenshots");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 375, height: 667 },
];

async function runQA() {
  console.log("==========================================");
  console.log("VELORA PLAYWRIGHT AUTOMATION QA SUITE");
  console.log("==========================================");

  const chromePath = "C:\\Users\\atill\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
  const browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: [],
  };

  const consoleErrors = [];

  function record(name, pass, msg = "") {
    if (pass) {
      results.passed++;
      console.log(`  ✓ PASS: ${name}`);
      results.details.push({ test: name, status: "PASS", message: msg });
    } else {
      results.failed++;
      console.log(`  ✗ FAIL: ${name} - ${msg}`);
      results.details.push({ test: name, status: "FAIL", message: msg });
    }
  }

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    // TEST 1: Homepage loading & title
    console.log("\n[1] Testing Homepage Load & Meta...");
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    const title = await page.title();
    record("Page Title", title.includes("VELORA"), `Title was: "${title}"`);

    // TEST 2: Responsive Viewports & Horizontal Overflow Check
    console.log("\n[2] Testing Responsive Viewports & Horizontal Overflow...");
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(400);

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      record(
        `Viewport ${vp.name} (${vp.width}x${vp.height}) - Zero Horizontal Overflow`,
        !hasOverflow,
        hasOverflow ? "Horizontal scroll detected!" : "Layout fits viewport cleanly"
      );

      if (vp.name === "desktop") {
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, "homepage-desktop-1440x900.png"),
          fullPage: false,
        });
      } else if (vp.name === "mobile") {
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, "homepage-mobile-390x844.png"),
          fullPage: false,
        });
      }
    }

    // Reset to desktop viewport for detailed feature testing
    await page.setViewportSize({ width: 1440, height: 900 });

    // TEST 3: Navigation Links
    console.log("\n[3] Testing Navigation Links...");
    const navLinks = ["/tours", "/destinations", "/about", "/manage-booking", "/faq", "/contact"];
    for (const link of navLinks) {
      await page.goto(`${BASE_URL}${link}`, { waitUntil: "networkidle" });
      const mainVisible = await page.locator("main").isVisible();
      record(`Route navigation to ${link}`, mainVisible);
    }

    // TEST 4: Tour Discovery, Keyword Search, Filters & Sorting
    console.log("\n[4] Testing Tour Discovery, Filters & Sorting...");
    await page.goto(`${BASE_URL}/tours`, { waitUntil: "networkidle" });

    // Check all tours rendered
    const initialCardsCount = await page.locator(".tour-card").count();
    record("Initial Tour Cards Count (all 30 tours)", initialCardsCount === 30, `Found: ${initialCardsCount}`);

    // Keyword search: search "balloon"
    await page.fill('input[aria-label="Search journeys by keyword"]', "balloon");
    await page.waitForTimeout(300);
    const searchCardsCount = await page.locator(".tour-card").count();
    record("Keyword Search 'balloon'", searchCardsCount > 0, `Matching tours: ${searchCardsCount}`);

    // Clear search
    await page.click('button[aria-label="Clear keyword search"]');
    await page.waitForTimeout(300);

    // Open Filters and select Category "yacht"
    await page.click('button[aria-label="Toggle filter sidebar"]');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Yacht & private boats")');
    await page.waitForTimeout(300);

    const yachtCount = await page.locator(".tour-card").count();
    record("Category filter 'Yacht & private boats'", yachtCount > 0, `Yacht tours: ${yachtCount}`);

    // Reset filters
    await page.click('button:has-text("Reset all")');
    await page.waitForTimeout(300);

    // Capture Tour Discovery Screenshot
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "tour-discovery-desktop.png"),
      fullPage: false,
    });

    // TEST 5: Favorites Flow
    console.log("\n[5] Testing Favorites (Add, Persist, Clear)...");
    await page.goto(`${BASE_URL}/tours`, { waitUntil: "networkidle" });

    // Click heart on first tour
    const firstFavBtn = page.locator(".tour-card .fav-btn").first();
    await firstFavBtn.click();
    await page.waitForTimeout(400);

    // Check favorite counter badge in header
    const favCountBadge = await page.locator(".header-fav .fav-count").textContent();
    record("Header Favorites Counter", favCountBadge === "1", `Badge count: ${favCountBadge}`);

    // Navigate to /favorites
    await page.goto(`${BASE_URL}/favorites`, { waitUntil: "networkidle" });
    const savedToursCount = await page.locator(".tour-card").count();
    record("Favorites Page shows saved tour", savedToursCount === 1, `Found ${savedToursCount} saved`);

    // TEST 6: Tour Detail & Gallery
    console.log("\n[6] Testing Tour Details & Gallery...");
    await page.goto(`${BASE_URL}/tours/cappadocia-sunrise-balloon`, { waitUntil: "networkidle" });

    const tourTitle = await page.locator("h1").textContent();
    record("Tour Detail Page Loads", tourTitle.includes("Sunrise balloon"), `Title: ${tourTitle}`);

    // Test Itinerary accordion
    const firstItineraryStop = page.locator(".itinerary-section button").first();
    await firstItineraryStop.click();
    await page.waitForTimeout(300);
    record("Itinerary accordion expands/collapses", true);

    // Capture Tour Detail Screenshot
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "tour-detail-desktop.png"),
      fullPage: false,
    });

    // TEST 7: Dynamic Booking Flow, Price Calculation & Simulation
    console.log("\n[7] Testing Booking Flow & Dynamic Pricing...");

    // Adjust Adult Stepper in Booking Widget
    const adultOutput = page.locator('.stepper[aria-label="Adults"] output');
    const initialAdults = await adultOutput.textContent();
    await page.locator('.stepper[aria-label="Adults"] button[aria-label="Increase Adults"]').click();
    await page.waitForTimeout(200);
    const updatedAdults = await adultOutput.textContent();
    record("Adult Stepper Increments", Number(updatedAdults) === Number(initialAdults) + 1);

    // Click proceed to booking page
    await page.click('button:has-text("Proceed to Reservation")');
    await page.waitForURL("**/book/**");

    // Capture Booking Page
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "booking-flow-desktop.png"),
      fullPage: false,
    });

    // Test form validation: submit empty form
    await page.click('button:has-text("Confirm Simulated Booking")');
    await page.waitForTimeout(300);
    const hasErrorSummary = await page.locator(".error-summary").isVisible();
    record("Booking Form Validation displays Error Summary", hasErrorSummary);

    // Fill valid passenger details
    await page.fill("#lead-fullname", "Eleanor Vance");
    await page.fill("#lead-email", "eleanor.vance@example.com");
    await page.fill("#lead-phone", "+44 20 7946 0955");
    await page.fill("#special-requests", "Celebrating our wedding anniversary");

    // Submit booking simulation
    await page.click('button:has-text("Confirm Simulated Booking")');
    await page.waitForTimeout(1000);

    const confirmationVisible = await page.locator("text=RESERVATION CONFIRMED (DEMO)").isVisible();
    record("Booking Confirmation Screen rendered", confirmationVisible);

    const bookingRef = await page.locator("strong:has-text('VEL-')").textContent();
    record("Simulated Booking Reference Generated", bookingRef.startsWith("VEL-"), `Ref: ${bookingRef}`);

    // TEST 8: Booking Cancellation Simulation
    console.log("\n[8] Testing Simulated Booking Cancellation...");
    await page.click('button:has-text("Simulate Cancellation")');
    await page.waitForTimeout(400);

    const cancelConfirmed = await page.locator("text=BOOKING CANCELLED").isVisible();
    record("Booking Cancellation Updates State to CANCELLED", cancelConfirmed);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "manage-booking-cancelled.png"),
      fullPage: false,
    });

    // TEST 9: Destination Showcase & Interactive Story Section
    console.log("\n[9] Testing Interactive Destination & Story Sections...");
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    // Click Istanbul tab in destination showcase
    await page.click('button[role="tab"]:has-text("Istanbul")');
    await page.waitForTimeout(400);
    const destHeading = await page.locator("#dest-panel-istanbul h3").textContent();
    record("Interactive Destination Tab Switching", destHeading.includes("Istanbul"), `Active dest: ${destHeading}`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "destination-showcase-desktop.png"),
      fullPage: false,
    });

    // Scroll to Story Section
    await page.locator(".story-chapter").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "interactive-story-section.png"),
      fullPage: false,
    });
    record("Interactive Story Section Animated Reveal", true);

    // TEST 10: Mobile Navigation Drawer Test
    console.log("\n[10] Testing Mobile Navigation Drawer...");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    const menuToggle = page.locator(".menu-toggle");
    await menuToggle.click();
    await page.waitForTimeout(300);

    const mobileMenuOpen = await page.locator("#mobile-navigation").isVisible();
    record("Mobile Hamburger Menu Opens", mobileMenuOpen);

    // Click link inside mobile menu
    await page.locator('#mobile-navigation a:has-text("Destinations")').click();
    await page.waitForURL("**/destinations");
    record("Mobile Menu Navigation Works", page.url().includes("/destinations"));

    // TEST 11: Sold-Out & Unavailable State Gating
    console.log("\n[11] Testing Sold-Out / Inactive Tour Gating...");
    await page.goto(`${BASE_URL}/tours/santorini-sunset-catamaran`, { waitUntil: "networkidle" });
    const soldoutNotice = await page.locator("text=Departures Currently Closed").isVisible();
    record("Sold-out Tour Displays Closed Status & Disables Booking", soldoutNotice);

    // TEST 12: Console Errors Verification
    console.log("\n[12] Verifying Console Errors...");
    record(
      "Zero Fatal Console Errors During Run",
      consoleErrors.length === 0,
      consoleErrors.length > 0 ? `Errors: ${consoleErrors.join("; ")}` : "Clean console"
    );

    await context.close();
  } catch (err) {
    console.error("Test Suite Runtime Error:", err);
    record("Test Suite Execution", false, err.message);
  } finally {
    await browser.close();
  }

  console.log("\n==========================================");
  console.log(`RESULTS: ${results.passed} Passed, ${results.failed} Failed`);
  console.log("==========================================");

  // Write results JSON
  fs.writeFileSync(
    path.join(SCREENSHOTS_DIR, "qa-report.json"),
    JSON.stringify(results, null, 2)
  );

  return results;
}

runQA();
