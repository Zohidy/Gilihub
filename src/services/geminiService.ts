import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getTourRecommendation(preference: string, activity?: string, budget?: string, duration?: string) {
  try {
    const prompt = `
      Anda adalah pakar wisata lokal di Gili Trawangan. 
      Berikan rekomendasi rencana perjalanan (itinerary) yang dipersonalisasi berdasarkan:
      - Preferensi: ${preference}
      - Jenis Aktivitas: ${activity || 'Semua'}
      - Anggaran: ${budget || 'Semua'}
      - Durasi: ${duration || 'Semua'}

      Berikan jawaban dalam format Markdown yang indah, mencakup:
      1. Judul Menarik
      2. Ringkasan Rencana Perjalanan
      3. Mengapa ini cocok untuk mereka
      4. Tips Lokal Rahasia

      Gunakan bahasa yang ramah dan inspiratif.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return "Maaf, saya tidak bisa memberikan rekomendasi saat ini. Silakan coba lagi nanti.";
  }
}
