export function getFileUrl(path?: string | null) {
    if (!path) return undefined;
  
    // Already full URL
    if (path.startsWith("http")) {
      return path;
    }
  
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:8080";
  
    return `${baseUrl}/${path.replace(/^\/+/, "")}`;
  }