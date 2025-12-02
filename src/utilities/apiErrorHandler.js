// utils/apiErrorHandler.js
export const handleApiError = (error, $q) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || "Something went wrong.";

  if (status === 400) {
    $q.notify({
      message: "Bad Request: Please check your input.",
      color: "negative",
      icon: "error",
    });
  } else if (status === 401) {
    $q.notify({
      message: "Unauthorized: Please login again.",
      color: "negative",
      icon: "lock",
    });
  } else if (status === 403) {
    $q.notify({
      message: "Forbidden: You don’t have permission.",
      color: "negative",
      icon: "block",
    });
  } else if (status === 404) {
    $q.notify({
      message: "Not Found: The requested resource was not found.",
      color: "negative",
      icon: "search_off",
    });
  } else if (status === 409) {
    $q.notify({
      message: "Conflict: Duplicate or conflicting data.",
      color: "negative",
      icon: "report_problem",
    });
  } else if (status === 500) {
    $q.notify({
      message: "Server Error: Please try again later.",
      color: "negative",
      icon: "error_outline",
    });
  } else {
    $q.notify({
      message,
      color: "negative",
      icon: "error",
    });
  }

  console.error("API Error:", error);
};
