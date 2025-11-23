export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return Response.json({ error: "Query tidak boleh kosong" }, { status: 400 })
    }

    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY
    if (!unsplashKey) {
      console.error("[v0] UNSPLASH_ACCESS_KEY tidak dikonfigurasi")
      return Response.json({ error: "Server tidak dikonfigurasi dengan benar" }, { status: 500 })
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${unsplashKey}`,
    )

    const data = await response.json()

    if (!response.ok) {
      const errorMsg = data.error?.message || `Error ${response.status}`
      console.error("[v0] Unsplash API Error:", errorMsg)
      return Response.json({ error: errorMsg }, { status: response.status })
    }

    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular
      return Response.json({ success: true, imageUrl })
    } else {
      return Response.json({ error: "Tidak ada gambar yang ditemukan" }, { status: 404 })
    }
  } catch (error) {
    const errorMsg = (error as Error).message
    console.error("[v0] Exception:", errorMsg)
    return Response.json({ error: errorMsg }, { status: 500 })
  }
}