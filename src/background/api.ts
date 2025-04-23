/**
 * Functions for interacting with external (mock) APIs.
 */

/**
 * Fetches mock insights for a given product URL.
 * In a real implementation, this would make a network request to the backend.
 *
 * Task 2.3: Currently mocks the API call and skips ID token retrieval.
 *
 * @param productUrl - The URL of the product page.
 * @returns A promise that resolves with a mock insight string.
 */
export async function fetchProductInsights(
  productUrl: string
): Promise<string> {
  console.log(`Mock fetching insights for: ${productUrl}`);

  // TODO: Task 2.3 - Retrieve user ID token if user is logged in
  // const idToken = await getIdToken(); // Hypothetical function to get token
  // const headers = idToken ? { 'Authorization': `Bearer ${idToken}` } : {};

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock API response
  const mockResponse = `This is a mock insight for ${productUrl}`;

  console.log("Returning mock insight:", mockResponse);
  return mockResponse;
}

// TODO: Add functions for other API calls (e.g., chat)
