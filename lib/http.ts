export class HttpError extends Error {
  status: number;
  details?: any;
  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function http<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  const contentType = response.headers.get("content-type");
  const json = contentType?.includes("application/json")
    ? await response.json()
    : null;

  // Caso o servidor use a lib response.ts
  if (json && typeof json === "object" && "success" in json) {
    if (!json.success) {
      throw new HttpError(json.error || "Erro desconhecido", response.status, json.details);
    }
    return json.data as T;
  }

  // Fallback para APIs sem padronização (caso algo ainda não use response.ts)
  if (!response.ok) {
    const msg =
      (json && (json.error || json.message)) ||
      (await response.text()) ||
      "Erro desconhecido";
    throw new HttpError(msg, response.status);
  }

  return (json as T) || ({} as T);
}
