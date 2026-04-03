export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

export function isSupabaseConnectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const cause = error.cause as { code?: string; message?: string } | undefined;

  return (
    error.message.toLowerCase().includes("fetch failed") ||
    cause?.code === "UND_ERR_CONNECT_TIMEOUT" ||
    cause?.message?.toLowerCase().includes("connect timeout") === true
  );
}

export function getSupabaseUnavailableMessage() {
  return "Supabase is currently unreachable from this machine. The page is showing a safe fallback until connectivity is restored.";
}
