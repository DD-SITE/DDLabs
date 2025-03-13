export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // No action needed since Sentry has been removed
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // No action needed since Sentry has been removed
  }
}

