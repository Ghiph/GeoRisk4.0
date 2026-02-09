export type RiskLevel = "TINGGI" | "SEDANG" | "RENDAH"

export interface RiskData {
  level: RiskLevel
  score: number
  pga: string
  vs30: string
  jarak_sesar: string
  litologi: string
  saran: string
}

export function getRiskData(lat: number, lon: number): RiskData {
  // Cisarua approx: -6.79, 107.56
  const distSq = (lat - -6.79) ** 2 + (lon - 107.56) ** 2

  if (distSq < 0.01) {
    return {
      level: "TINGGI",
      score: 8.5,
      pga: "0.65 g",
      vs30: "180 m/s (Tanah Lunak)",
      jarak_sesar: "2.1 km (Sesar Lembang)",
      litologi: "Qvu (Batuan Gunungapi Muda)",
      saran:
        "Konstruksi bangunan wajib tahan gempa standar SNI 1726:2019. Waspada likuifaksi.",
    }
  } else if (distSq < 0.05) {
    return {
      level: "SEDANG",
      score: 5.2,
      pga: "0.35 g",
      vs30: "360 m/s (Tanah Sedang)",
      jarak_sesar: "8.5 km (Sesar Lembang)",
      litologi: "Ql (Endapan Danau)",
      saran: "Periksa struktur bangunan. Siapkan jalur evakuasi.",
    }
  } else {
    return {
      level: "RENDAH",
      score: 2.1,
      pga: "0.15 g",
      vs30: "760 m/s (Batuan Keras)",
      jarak_sesar: "> 15 km",
      litologi: "Tmb (Formasi Batuan Tua)",
      saran:
        "Wilayah relatif stabil, tetap waspada gempa megathrust.",
    }
  }
}

// Map layer data
export const SESAR_LEMBANG_COORDS: [number, number][] = [
  [-6.8, 107.45],
  [-6.81, 107.7],
]

export const JABAR_BOUNDARY: [number, number][] = [
  [-5.9, 106.7],
  [-6.2, 106.6],
  [-6.6, 106.4],
  [-7.0, 106.4],
  [-7.4, 106.5],
  [-7.7, 107.0],
  [-7.8, 108.0],
  [-7.7, 108.6],
  [-7.3, 108.8],
  [-6.7, 108.9],
  [-6.3, 108.2],
  [-6.1, 107.8],
  [-5.9, 107.2],
  [-5.9, 106.7],
]

export const VS30_ZONES = {
  soft: [
    [-6.78, 107.55],
    [-6.78, 107.58],
    [-6.8, 107.58],
    [-6.8, 107.55],
  ] as [number, number][],
  hard: [
    [-6.8, 107.55],
    [-6.82, 107.58],
    [-6.82, 107.52],
    [-6.8, 107.52],
  ] as [number, number][],
}

export const HISTORICAL_QUAKES = [
  { lat: -6.785, lon: 107.565, label: "Gempa 2011 (M 3.3)", radius: 6 },
  { lat: -6.795, lon: 107.595, label: "Gempa 2017 (M 4.1)", radius: 8 },
]

export const PGA_ZONE = { lat: -6.805, lon: 107.575, radius: 1500 }
