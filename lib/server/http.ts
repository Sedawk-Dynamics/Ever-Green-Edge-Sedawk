// Server only. Small helpers shared by the API routes.

export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

export const fail = (message: string, status = 400) => json({ ok: false, error: message }, status)

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text()
    if (text.length > 20_000) return null
    const data = JSON.parse(text)
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null
  } catch {
    return null
  }
}
