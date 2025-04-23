/**
 * @jest-environment jsdom
 */

// Import the functions to be tested
import { isAmazonProductPage, isSupportedPage } from "./pageMatcher";

// Removed the local function definition

describe("pageMatcher", () => {
  describe("isAmazonProductPage", () => {
    const originalLocation = window.location;

    // Helper to mock window.location.href
    const setLocation = (href: string) => {
      Object.defineProperty(window, "location", {
        writable: true,
        value: { ...originalLocation, href: href },
      });
    };

    // Restore original location after all tests
    afterAll(() => {
      Object.defineProperty(window, "location", {
        writable: true,
        value: originalLocation,
      });
    });

    // Test cases remain largely the same, calling the imported function
    test("should return true for a standard .com product page with /dp/", () => {
      setLocation(
        "https://www.amazon.com/Sample-Product-Name/dp/B07XYZ1234/ref=sr_1_1"
      );
      expect(isAmazonProductPage()).toBe(true);
    });

    test("should return true for a .co.uk product page with /gp/product/", () => {
      setLocation("https://www.amazon.co.uk/gp/product/B08ABC5678?pf_rd_r=XYZ");
      expect(isAmazonProductPage()).toBe(true);
    });

    test("should return true for a .de product page with path variants", () => {
      setLocation(
        "https://www.amazon.de/Another-Product/dp/B09DEF9012/ref=pd_bxgy_img_sccl_1/123-4567890-1234567"
      );
      expect(isAmazonProductPage()).toBe(true);
    });

    test("should return false for an Amazon search results page", () => {
      setLocation("https://www.amazon.com/s?k=test+query&ref=nb_sb_noss");
      expect(isAmazonProductPage()).toBe(false);
    });

    test("should return false for the Amazon home page", () => {
      setLocation("https://www.amazon.ca/");
      expect(isAmazonProductPage()).toBe(false);
    });

    test("should return false for an Amazon account page", () => {
      setLocation("https://www.amazon.fr/gp/css/homepage.html/ref=nav_bb_ya");
      expect(isAmazonProductPage()).toBe(false);
    });

    test("should return false for a non-Amazon URL", () => {
      setLocation("https://www.google.com/");
      expect(isAmazonProductPage()).toBe(false);
    });

    test("should return false for a URL with amazon in the path but not a product page", () => {
      setLocation("https://www.example.com/deals/amazon-day");
      expect(isAmazonProductPage()).toBe(false);
    });

    test("should return true for a product page with extra path segments before dp", () => {
      setLocation(
        "https://www.amazon.com/some/other/segments/Sample-Product-Name/dp/B07XYZ1234/ref=sr_1_1"
      );
      expect(isAmazonProductPage()).toBe(true);
    });
  });

  // Add tests for isSupportedPage (currently trivial)
  describe("isSupportedPage", () => {
    // Mock isAmazonProductPage for these tests if needed in the future
    const originalLocation = window.location;
    const setLocation = (href: string) => {
      Object.defineProperty(window, "location", {
        writable: true,
        value: { ...originalLocation, href: href },
      });
    };
    afterAll(() => {
      Object.defineProperty(window, "location", {
        writable: true,
        value: originalLocation,
      });
    });

    test("should return true when isAmazonProductPage returns true", () => {
      setLocation("https://www.amazon.com/dp/B07XYZ1234");
      expect(isSupportedPage()).toBe(true);
    });

    test("should return false when isAmazonProductPage returns false", () => {
      setLocation("https://www.google.com/");
      expect(isSupportedPage()).toBe(false);
    });

    // Add more tests here if isSupportedPage logic becomes more complex
  });
});
