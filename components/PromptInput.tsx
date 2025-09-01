import React from 'react';
import type { AbsentTeacher } from '../App';
import { Spinner } from './Spinner';

interface AbsentTeacherFormProps {
  date: string;
  setDate: (date: string) => void;
  day: string;
  absentTeachers: AbsentTeacher[];
  setAbsentTeachers: (teachers: AbsentTeacher[]) => void;
  onGenerate: () => void;
  isLoading: boolean;
  teacherList: string[];
  preparedBy: string;
  setPreparedBy: (name: string) => void;
}

const REASON_OPTIONS = ['Cuti Sakit', 'Cuti Rehat Khas', 'Kursus', 'Mesyuarat', 'Kecemasan'];

const AddIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .53 1.405c.784-.248 1.576-.395 2.37-.468v.443c0 1.517 1.233 2.75 2.75 2.75h2.5A2.75 2.75 0 0 0 14 5.193v-.443c.795.077 1.58.22 2.365.468a.75.75 0 1 0 .53-1.405c-.784-.248-1.576-.395-2.37-.468v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 10a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Z" clipRule="evenodd" /></svg>
);


export const AbsentTeacherForm: React.FC<AbsentTeacherFormProps> = ({ date, setDate, day, absentTeachers, setAbsentTeachers, onGenerate, isLoading, teacherList, preparedBy, setPreparedBy }) => {
    
    const updateTeacher = (id: number, field: keyof Omit<AbsentTeacher, 'id'>, value: string) => {
        const updated = absentTeachers.map(t => {
            if (t.id === id) {
                const newTeacher = { ...t, [field]: value };
                // If selecting a regular teacher, clear custom name
                if (field === 'name' && value !== 'lain-lain') {
                    newTeacher.customName = '';
                }
                // If selecting a regular reason, clear custom reason
                if (field === 'reason' && value !== 'lain-lain') {
                    newTeacher.customReason = '';
                }
                return newTeacher;
            }
            return t;
        });
        setAbsentTeachers(updated);
    };

    const addTeacher = () => {
        const newId = (absentTeachers.length > 0 ? Math.max(...absentTeachers.map(t => t.id)) : 0) + 1;
        setAbsentTeachers([...absentTeachers, { id: newId, name: '', customName:'', reason: 'Cuti Sakit', customReason: '', notes: '' }]);
    };

    const removeTeacher = (id: number) => {
        if (absentTeachers.length > 1) {
            setAbsentTeachers(absentTeachers.filter(t => t.id !== id));
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Tarikh</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="day" className="block text-sm font-medium text-slate-700 mb-1">Hari</label>
                    <input type="text" id="day" value={day} disabled className="w-full p-2 border border-slate-300 rounded-md bg-slate-100 cursor-not-allowed"/>
                </div>
                 <div>
                    <label htmlFor="preparedBy" className="block text-sm font-medium text-slate-700 mb-1">Disediakan oleh</label>
                    <input 
                        type="text" 
                        id="preparedBy" 
                        value={preparedBy} 
                        onChange={e => setPreparedBy(e.target.value)} 
                        placeholder="Masukkan nama anda"
                        className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
                    />
                </div>
            </div>

            <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4">Senarai Guru Tidak Hadir</h3>
            <div className="space-y-4">
                {absentTeachers.map((teacher) => (
                    <div key={teacher.id} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,1fr,auto] gap-4 items-start md:items-center">
                        <div className="flex flex-col">
                            <select
                                value={teacher.name}
                                onChange={(e) => updateTeacher(teacher.id, 'name', e.target.value)}
                                className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                aria-label="Nama Guru"
                            >
                                <option value="" disabled>Pilih Guru</option>
                                {teacherList.map(name => <option key={name} value={name}>{name}</option>)}
                                <option value="lain-lain">Lain-lain...</option>
                            </select>
                             {teacher.name === 'lain-lain' && (
                                <input
                                    type="text"
                                    placeholder="Sila taip nama guru"
                                    value={teacher.customName}
                                    onChange={(e) => updateTeacher(teacher.id, 'customName', e.target.value)}
                                    className="w-full p-2 mt-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
                                    aria-label="Nama Guru Lain"
                                />
                            )}
                        </div>
                        <div>
                            <select
                                value={teacher.reason}
                                onChange={(e) => updateTeacher(teacher.id, 'reason', e.target.value)}
                                className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                aria-label="Sebab Tidak Hadir"
                            >
                                {REASON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                <option value="lain-lain">Lain-lain...</option>
                            </select>
                            {teacher.reason === 'lain-lain' && (
                                <input
                                    type="text"
                                    placeholder="Sila nyatakan sebab"
                                    value={teacher.customReason}
                                    onChange={(e) => updateTeacher(teacher.id, 'customReason', e.target.value)}
                                    className="w-full p-2 mt-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
                                    aria-label="Sebab Lain-lain"
                                />
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Catatan (cth: Bahan di atas meja)"
                            value={teacher.notes}
                            onChange={(e) => updateTeacher(teacher.id, 'notes', e.target.value)}
                            className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
                             aria-label="Catatan"
                        />
                        <button onClick={() => removeTeacher(teacher.id)} disabled={absentTeachers.length <= 1} className="p-2 text-red-600 hover:text-red-800 disabled:text-slate-300 disabled:cursor-not-allowed" aria-label="Buang Guru">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="flex items-center justify-between mt-6">
                <button onClick={addTeacher} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <AddIcon className="w-5 h-5 mr-2"/>
                    Tambah Guru
                </button>
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Spinner className="w-5 h-5 mr-3" />
                            Menjana...
                        </>
                    ) : (
                        'Jana Cadangan Guru Ganti'
                    )}
                </button>
            </div>
        </div>
    );
};