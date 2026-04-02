// Geocoding via OpenStreetMap Nominatim — free, no API key needed
export async function geocodeAddress(address: string, city = 'Bologna'): Promise<{ lat: number; lng: number } | null> {
  const query = `${address}, ${city}, Italy`
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=it`,
      { headers: { 'Accept-Language': 'it', 'User-Agent': 'CityApp/1.0' } }
    )
    const data = await res.json()
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
    return null
  } catch {
    return null
  }
}
