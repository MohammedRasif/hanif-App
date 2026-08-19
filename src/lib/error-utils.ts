/**
 * Extracts human-readable error details from RTK Query / Axios error objects.
 */
export const getErrorMessage = (
  error: any,
  fallbackMessage = "An unexpected error occurred.",
): string => {
  if (!error) return fallbackMessage;

  console.log("[Error Extractor Input]:", JSON.stringify(error, null, 2));

  const data = error?.data || error;

  if (typeof data?.details === "string" && data.details.trim() !== "") {
    return data.details;
  }

  if (Array.isArray(data?.details)) {
    return data.details.join(", ");
  }

  if (typeof data?.message === "string" && data.message.trim() !== "") {
    return data.message;
  }

  if (typeof data?.detail === "string" && data.detail.trim() !== "") {
    return data.detail;
  }

  if (typeof data?.error === "string" && data.error.trim() !== "") {
    return data.error;
  }

  if (typeof error?.message === "string" && error.message.trim() !== "") {
    return error.message;
  }

  return fallbackMessage;
};
