interface AbsentTeacherInfo {
  name: string;
  reason: string;
}

export async function generateSubstitutes(
  absentTeachers: AbsentTeacherInfo[], 
  date: string, 
  day: string
): Promise<any> {
  try {
    const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ absentTeachers, date, day }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.error || `Ralat pelayan: ${response.status}`);
    }

    return responseBody;

  } catch (error) {
    console.error("Ralat memanggil Netlify function:", error);
    throw new Error("Gagal menghubungi perkhidmatan AI. Sila semak sambungan anda.");
  }
}