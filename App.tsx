import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { AbsentTeacherForm } from './components/PromptInput.tsx';
import { SubstituteSchedule } from './components/ImageDisplay.tsx';
import { Footer } from './components/Footer.tsx';
import { generateSubstitutes } from './services/geminiService.ts';

export interface AbsentTeacher {
  id: number;
  name: string;
  customName: string;
  reason: string;
  customReason: string;
  notes: string;
}

export interface ScheduleEntry {
  absentTeacher: string;
  reason:string;
  substituteTeacher: string;
  classCovered: string;
  customSubstituteTeacher?: string;
}

const TEACHER_LIST = [
  'Moktar bin Jaman',
  'Kenny Voo Kai Lin',
  'Muhd Nazmi bin Rosli',
  'Mohamad Ali bin Kaling',
  'Baby Trucy Sedrek',
  'Florida Engillia Sim',
  'Surayadi binti Drahman',
  'Jessy Lessy',
  'Nur Syafiqah binti Roslan',
  'Idrus bin Matjisin',
  'Mohd Nazrin bin Ibrahim',
  'Amy Syahida binti Ahbasah'
];

const App: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [day, setDay] = useState<string>('');
  const [preparedBy, setPreparedBy] = useState<string>('');
  const [absentTeachers, setAbsentTeachers] = useState<AbsentTeacher[]>([
    { id: 1, name: '', customName: '', reason: 'Cuti Sakit', customReason: '', notes: '' },
  ]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (date) {
      const dateObj = new Date(date);
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const dayName = new Intl.DateTimeFormat('ms-MY', options).format(dateObj);
      setDay(dayName);
    } else {
      setDay('');
    }
  }, [date]);

  const handleGenerate = useCallback(async () => {
    const teachersWithNames = absentTeachers.filter(t => 
        (t.name.trim() !== '' && t.name !== 'lain-lain') || 
        (t.name === 'lain-lain' && t.customName.trim() !== '')
    );

    if (teachersWithNames.length === 0) {
        setError('Sila pilih atau masukkan sekurang-kurangnya seorang guru yang tidak hadir.');
        return;
    }

    for (const teacher of teachersWithNames) {
        if (teacher.reason === 'lain-lain' && (!teacher.customReason || teacher.customReason.trim() === '')) {
            setError(`Sila nyatakan sebab "Lain-lain" untuk ${teacher.name === 'lain-lain' ? teacher.customName : teacher.name}.`);
            return;
        }
    }

     if (preparedBy.trim() === '') {
      setError('Sila masukkan nama penyedia jadual.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSchedule([]);

    try {
      const teachersForApi = teachersWithNames.map(t => ({
        name: t.name === 'lain-lain' ? t.customName : t.name,
        reason: t.reason === 'lain-lain' ? t.customReason as string : t.reason,
        notes: t.notes
      }));
      const generatedSchedule = await generateSubstitutes(teachersForApi, date, day);
      setSchedule(generatedSchedule);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Gagal menjana cadangan. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [absentTeachers, date, day, preparedBy]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Header />
      <main className="flex-grow w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          <AbsentTeacherForm
            date={date}
            setDate={setDate}
            day={day}
            absentTeachers={absentTeachers}
            setAbsentTeachers={setAbsentTeachers}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            teacherList={TEACHER_LIST}
            preparedBy={preparedBy}
            setPreparedBy={setPreparedBy}
          />
          <SubstituteSchedule
            schedule={schedule}
            setSchedule={setSchedule}
            isLoading={isLoading}
            error={error}
            date={date}
            day={day}
            teacherList={TEACHER_LIST}
            preparedBy={preparedBy}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;