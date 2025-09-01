import React from 'react';
import type { ScheduleEntry } from '../App';
import { Spinner } from './Spinner';

// Declare jsPDF types for TypeScript
declare const jspdf: any;

interface SubstituteScheduleProps {
  schedule: ScheduleEntry[];
  setSchedule: (schedule: ScheduleEntry[]) => void;
  isLoading: boolean;
  error: string | null;
  date: string;
  day: string;
  teacherList: string[];
  preparedBy: string;
}

const InitialState: React.FC = () => (
  <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-lg h-full flex flex-col justify-center items-center bg-slate-50">
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-400 mb-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.15 2.25 2.25 0 0 0 2.25 2.25h.008a2.25 2.25 0 0 0 2.25-2.25 2.25 2.25 0 0 1 2.25-2.25h.008a2.25 2.25 0 0 1 2.25 2.25v.632m-11.585 7.428a2.25 2.25 0 0 0 2.25 2.25h5.171a2.25 2.25 0 0 0 2.25-2.25v-5.172a2.25 2.25 0 0 0-2.25-2.25H6.375a2.25 2.25 0 0 0-2.25 2.25v5.172Z" />
    </svg>
    <h3 className="text-xl font-semibold text-slate-600">Jadual Guru Ganti Akan Dipaparkan Di Sini</h3>
    <p className="text-slate-500 mt-2">Sila lengkapkan maklumat di atas dan klik 'Jana Cadangan'.</p>
  </div>
);

export const SubstituteSchedule: React.FC<SubstituteScheduleProps> = ({ schedule, setSchedule, isLoading, error, date, day, teacherList, preparedBy }) => {
  const handleEditSubstitute = (index: number, newName: string) => {
    const updatedSchedule = schedule.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, substituteTeacher: newName };
        if (newName !== 'lain-lain') {
          delete updatedItem.customSubstituteTeacher; // Clean up custom name if not needed
        }
        return updatedItem;
      }
      return item;
    });
    setSchedule(updatedSchedule);
  };

  const handleEditCustomSubstitute = (index: number, customName: string) => {
    const updatedSchedule = schedule.map((item, i) => {
      if (i === index) {
        return { ...item, customSubstituteTeacher: customName };
      }
      return item;
    });
    setSchedule(updatedSchedule);
  };
  
  const generatePDF = () => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Jadual Guru Ganti", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Tarikh: ${date} (${day})`, 105, 28, { align: 'center' });
    if(preparedBy){
      doc.text(`Disediakan oleh: ${preparedBy}`, 105, 36, { align: 'center' });
    }

    const tableColumn = ["Bil.", "Guru Tidak Hadir", "Sebab", "Kelas/Waktu Ganti", "Guru Ganti"];
    const tableRows: any[] = [];

    schedule.forEach((item, index) => {
      const substitute = item.substituteTeacher === 'lain-lain'
        ? item.customSubstituteTeacher || 'TIADA NAMA'
        : item.substituteTeacher;

      const rowData = [
        index + 1,
        item.absentTeacher,
        item.reason,
        item.classCovered,
        substitute,
      ];
      tableRows.push(rowData);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      didDrawPage: (data: any) => {
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Dijana menggunakan Sistem Guru Ganti SK Long Sebangang', 105, pageHeight - 10, { align: 'center' });
      },
    });
    
    doc.save(`jadual_guru_ganti_${date}.pdf`);
  };

  const hasSchedule = schedule && schedule.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 min-h-[300px] flex flex-col">
      {isLoading && (
        <div className="m-auto flex flex-col items-center justify-center text-slate-500">
          <Spinner className="w-10 h-10 mb-4" />
          <p className="text-lg">AI sedang merujuk jadual waktu...</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="m-auto text-center text-red-600 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="font-semibold">{error}</p>
        </div>
      )}
      {!isLoading && !error && !hasSchedule && <InitialState />}
      {!isLoading && !error && hasSchedule && (
        <>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th scope="col" className="px-4 py-3 w-12">Bil.</th>
                <th scope="col" className="px-4 py-3">Guru Tidak Hadir</th>
                <th scope="col" className="px-4 py-3">Sebab</th>
                <th scope="col" className="px-4 py-3">Kelas/Waktu Ganti</th>
                <th scope="col" className="px-4 py-3">Guru Ganti (Boleh Disunting)</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => {
                  const teacherOptions = [...teacherList];
                  if (!teacherOptions.includes(item.substituteTeacher) && item.substituteTeacher !== 'lain-lain') {
                      teacherOptions.push(item.substituteTeacher);
                  }

                  return (
                    <tr key={index} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{index + 1}</td>
                      <td className="px-4 py-3">{item.absentTeacher}</td>
                      <td className="px-4 py-3">{item.reason}</td>
                      <td className="px-4 py-3">{item.classCovered}</td>
                      <td className="px-4 py-3">
                         <select
                          value={item.substituteTeacher}
                          onChange={(e) => handleEditSubstitute(index, e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                          aria-label="Tukar Guru Ganti"
                        >
                          <option value="" disabled>Pilih Guru Ganti</option>
                          {teacherOptions.map(name => <option key={name} value={name}>{name}</option>)}
                          <option value="lain-lain">Lain-lain...</option>
                        </select>
                         {item.substituteTeacher === 'lain-lain' && (
                            <input
                                type="text"
                                placeholder="Sila taip nama guru ganti"
                                value={item.customSubstituteTeacher || ''}
                                onChange={(e) => handleEditCustomSubstitute(index, e.target.value)}
                                className="w-full p-2 mt-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                aria-label="Nama Guru Ganti Lain"
                            />
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
          </div>
          <div className="mt-6 text-right">
              <button
                onClick={generatePDF}
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Jana PDF
              </button>
          </div>
        </>
      )}
    </div>
  );
};