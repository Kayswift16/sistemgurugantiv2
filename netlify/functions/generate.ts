import { GoogleGenAI, Type } from "@google/genai";
import type { Handler } from "@netlify/functions";

const teacherRoster = `
1. Moktar bin Jaman (MJ)
2. Kenny Voo Kai Lin (KV)
3. Muhd Nazmi bin Rosli (MN)
4. Mohamad Ali bin Kaling (MA)
5. Baby Trucy Sedrek (BB)
6. Florida Engillia Sim (FS)
7. Surayadi binti Drahman (SD)
8. Jessy Lessy (JL)
9. Nur Syafiqah binti Roslan (NS)
10. Idrus bin Matjisin (IM)
11. Mohd Nazrin bin Ibrahim (NZ / MNZ)
12. Amy Syahida binti Ahbasah (AY)`;

const schoolTimetable = `
JADUAL WAKTU INDUK 2025 - SK LONG SEBANGANG, LAWAS (Waktu rehat: 0950-1010)

HARI: ISNIN
- TAHUN 1: 0720-0820 BM/NS, 0820-0850 PK/NZ, 0850-0950 BI/FS, 1010-1110 PM/AY, 1110-1210 MT/SD
- TAHUN 2: 0720-0850 BM/JL, 0850-0950 SN/MA, 1010-1110 PM/MN, 1110-1210 BI/FS
- TAHUN 3: 0720-0820 SN/KV, 0820-0920 BI/BB, 0920-0950 MT/NS, 1010-1110 PM/SD, 1110-1210 BM/JL
- TAHUN 4: 0720-0820 BI/MN, 0820-0850 MT/IM, 0850-0950 SN/AY, 1010-1110 BM/NS, 1110-1140 MZ/KV, 1140-1240 PS/BB
- TAHUN 5: 0720-0820 BI/FS, 0820-0850 MT/SD, 0850-0950 BM/NZ, 1010-1110 SN/JL, 1110-1210 PM/BB, 1210-1240 RBT/AY
- TAHUN 6: 0720-0750 BI/BB, 0750-0850 SEJ/AY, 0850-0950 MT/IM, 1010-1110 BM/NZ, 1110-1140 MZ/IM, 1140-1240 SN/MA

HARI: SELASA
- TAHUN 1: 0750-0850 BM/NS, 0850-0950 BI/FS, 1010-1110 MT/SD, 1110-1210 PS/NS
- TAHUN 2: 0750-0850 BM/JL, 0850-0950 PM/MN, 1010-1110 MT/KV, 1110-1210 BI/FS
- TAHUN 3: 0820-0920 BI/BB, 0920-0950 PK/NZ, 1010-1140 BM/JL, 1140-1210 PS/SD
- TAHUN 4: 0820-0920 MT/IM, 0920-0950 RBT/AY, 1010-1110 BM/NS, 1110-1140 SN/AY, 1140-1240 BI/MN
- TAHUN 5: 0750-0850 BI/FS, 0850-0920 MT/SD, 1010-1110 SEJ/AY, 1110-1140 BM/NZ, 1140-1210 PM/BB
- TAHUN 6: 0750-0850 BM/NZ, 0850-0950 MT/IM, 1010-1110 MT/IM, 1110-1140 BI/BB, 1140-1240 SN/MA

HARI: RABU
- TAHUN 1: 0720-0820 BI/FS, 0820-0850 PM/AY, 0850-0950 BM/NS, 1010-1110 BM/NS, 1110-1140 MZ/KV, 1140-1210 PM/AY
- TAHUN 2: 0720-0750 PM/MN, 0750-0850 PJ/IM, 0850-0950 BM/JL, 1010-1110 BI/FS, 1110-1210 MT/KV
- TAHUN 3: 0720-0820 MT/NS, 0820-0850 PM/SD, 0850-0950 BI/BB, 1010-1140 BM/JL, 1140-1210 PM/SD
- TAHUN 4: 0720-0820 PJ/NZ, 0820-0920 BI/MN, 0920-0950 SEJ/AY, 1010-1110 PM/SD, 1110-1210 BM/NS, 1210-1240 PK/NZ
- TAHUN 5: 0720-0820 PJ/MA, 0820-0850 PM/BB, 0850-0950 BI/FS, 1010-1040 MZ/AY, 1040-1140 BM/NZ, 1140-1210 SN/JL
- TAHUN 6: 0720-0820 PS/SD, 0820-0850 BM/NZ, 0850-0950 MT/IM, 1010-1110 PM/MJ, 1110-1210 BI/BB, 1210-1240 PK/MA

HARI: KHAMIS
- TAHUN 1: 0720-0750 BI/FS, 0750-0850 PJ/NZ, 0850-0950 BM/NS, 1010-1110 SN/AY, 1110-1210 MT/SD
- TAHUN 2: 0720-0820 MT/KV, 0820-0920 BI/FS, 0920-0950 PK/AY, 1010-1110 PS/FS, 1110-1210 BM/JL
- TAHUN 3: 0720-0820 BM/JL, 0820-0850 MZ/SD, 0850-0950 BI/BB, 1010-1110 SN/KV, 1110-1210 MT/NS
- TAHUN 4: 0720-0750 BM/NS, 0750-0850 SN/AY, 0850-0950 PM/SD, 1010-1110 BI/MN, 1110-1210 MT/IM
- TAHUN 5: 0720-0820 MT/SD, 0820-0920 SN/JL, 0920-0950 BI/FS, 1010-1110 BM/NZ, 1110-1210 PS/AY
- TAHUN 6: 0720-0820 BI/BB, 0820-0850 SN/MA, 0850-0950 PM/MJ, 1010-1110 RBT/BB, 1110-1210 BM/NZ

HARI: JUMAAT
- TAHUN 1: 0720-0820 BI/FS, 0820-0920 SN/AY, 0920-0950 MT/SD, 1010-1110 BM/NS
- TAHUN 2: 0720-0820 BM/JL, 0820-0850 MT/KV, 0850-0920 BI/FS, 0920-0950 MZ/IM, 1010-1140 SN/MA
- TAHUN 3: 0720-0750 BI/BB, 0750-0850 PJ/NZ, 0850-0950 MT/NS, 1010-1110 BM/JL
- TAHUN 4: 0720-0820 BM/NS, 0820-0850 PM/SD, 0850-0950 BI/MN, 1010-1140 MT/IM
- TAHUN 5: 0720-0820 MT/SD, 0820-0850 PK/MA, 0850-0950 BM/NZ, 1010-1140 BI/FS
- TAHUN 6: 0720-0820 PJ/MA, 0820-0850 PM/MJ, 0850-0950 BI/BB, 1010-1110 BM/NZ
`;

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { absentTeachers, date, day } = JSON.parse(event.body || '{}');
        
        if (!absentTeachers || !date || !day) {
            return { 
              statusCode: 400, 
              body: JSON.stringify({ error: 'Parameter yang diperlukan tiada.' }) 
            };
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const teacherList = absentTeachers.map((t: any) => `- ${t.name} (Sebab: ${t.reason})`).join('\n');

        const prompt = `
            Anda adalah sistem pengurusan sekolah yang sangat cekap untuk SK Long Sebangang.
            Tugas anda adalah untuk menyediakan jadual guru ganti yang lengkap untuk semua kelas bagi guru yang tidak hadir.

            Berikut adalah CONTEXT PENTING untuk rujukan anda:
            1. Senarai Penuh Guru dan Kod Nama:
            ${teacherRoster}

            2. Jadual Waktu Penuh Sekolah 2025:
            ${schoolTimetable}

            MAKLUMAT KETIDAKHADIRAN SEMASA:
            Tarikh: ${day}, ${date}
            Senarai Guru Tidak Hadir:
            ${teacherList}

            ARAHAN:
            Berdasarkan CONTEXT dan MAKLUMAT KETIDAKHADIRAN SEMASA:
            1. Untuk setiap guru dalam "Senarai Guru Tidak Hadir", cari SEMUA kelas yang diajar oleh guru tersebut pada hari ${day} dari "Jadual Waktu Penuh Sekolah". Jika nama guru tidak dijumpai dalam jadual waktu, abaikan guru tersebut.
            2. Untuk SETIAP KELAS yang dijumpai, cari seorang guru ganti.
            3. Guru ganti mestilah seorang guru dari "Senarai Penuh Guru" yang TIDAK mempunyai kelas pada waktu yang sama dan TIDAK ada dalam senarai guru tidak hadir.
            4. Cipta satu entri JADUAL GANTI untuk setiap kelas yang perlu diganti. Jika seorang guru tidak hadir mempunyai 3 kelas pada hari itu, anda perlu cipta 3 entri jadual ganti.
            5. Pastikan nama guru yang dicadangkan adalah NAMA PENUH dari senarai guru, BUKAN kod nama.
            6. Sertakan sebab asal untuk setiap entri yang dijana. Jangan sertakan sebarang catatan.

            Sila berikan jawapan dalam format JSON sahaja, iaitu sebuah array objek.
          `;
  
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  absentTeacher: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  classCovered: { type: Type.STRING },
                  substituteTeacher: { type: Type.STRING }
                },
                required: ["absentTeacher", "reason", "classCovered", "substituteTeacher"],
              },
            },
          },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("API mengembalikan respons kosong.");
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: jsonText,
        };

    } catch (error) {
        console.error("Ralat dalam Netlify function:", error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Perkhidmatan AI gagal menjana cadangan." }) 
        };
    }
};