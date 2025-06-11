import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Appointment, FinancialRecord } from '../../types';
import { Button, Card, Select } from '../../components/ui';
import { ArrowDownTrayIcon, ChartBarIcon } from '../../components/icons';
import { formatDate, formatCurrency, exportToCSV, getMonthName } from '../../utils/helpers';
import { APPOINTMENTS_KEY } from '../../constants'; // FINANCIALS_KEY was removed as records are derived
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../contexts/AppContext';


const FinancialsPage: React.FC = () => {
  const { showNotification, theme: currentTheme } = useAppContext(); // Get theme from context
  const [appointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);
  
  const financialRecords: FinancialRecord[] = useMemo(() => {
    return appointments
      .filter(app => app.status === 'completed' && typeof app.serviceValue === 'number' && app.serviceValue > 0)
      .map(app => ({
        id: app.id, 
        appointmentId: app.id,
        date: app.date,
        amount: app.serviceValue!,
        description: `Serviço para ${app.clientName} (${app.location})`,
      }));
  }, [appointments]);

  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState<string>(''); 

  const yearsWithData = useMemo(() => {
    const years = new Set<string>();
    financialRecords.forEach(record => years.add(new Date(record.date).getFullYear().toString()));
    return Array.from(years).sort((a,b) => parseInt(b) - parseInt(a));
  }, [financialRecords]);

  const monthsWithDataInYear = useMemo(() => {
    if (!filterYear) return [];
    const months = new Set<string>();
    financialRecords.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getFullYear().toString() === filterYear) {
        months.add((recordDate.getMonth() + 1).toString().padStart(2, '0')); 
      }
    });
    return Array.from(months).sort().map(month => ({
        value: month,
        label: getMonthName(parseInt(month)-1)
    }));
  }, [financialRecords, filterYear]);


  const filteredRecords = useMemo(() => {
    return financialRecords.filter(record => {
      const recordDate = new Date(record.date);
      const yearMatch = !filterYear || recordDate.getFullYear().toString() === filterYear;
      const monthMatch = !filterMonth || (recordDate.getMonth() + 1).toString().padStart(2, '0') === filterMonth;
      return yearMatch && monthMatch;
    }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [financialRecords, filterYear, filterMonth]);
  
  const sortedMonthlySummary = useMemo(() => {
    const summary: { [monthKey: string]: number } = {}; // monthKey will be "0" through "11"
    const recordsToSummarize = filterYear ? financialRecords.filter(r => new Date(r.date).getFullYear().toString() === filterYear) : financialRecords;

    recordsToSummarize.forEach(record => {
      const monthKey = (new Date(record.date).getMonth()).toString(); // "0" to "11"
      summary[monthKey] = (summary[monthKey] || 0) + record.amount;
    });

    const monthOrder = Array.from({length: 12}, (_, i) => i.toString()); // Array of "0" to "11"

    return monthOrder.map(monthKeyStr => ({
        monthIndex: parseInt(monthKeyStr), // Keep numeric month index
        name: getMonthName(parseInt(monthKeyStr)),
        Ganhos: summary[monthKeyStr] || 0
    })).filter(item => item.Ganhos > 0 || recordsToSummarize.some(r => new Date(r.date).getMonth() === item.monthIndex));
  }, [financialRecords, filterYear]);


  const totalGains = useMemo(() => {
    return filteredRecords.reduce((sum, record) => sum + record.amount, 0);
  }, [filteredRecords]);

  const annualTotal = useMemo(() => {
     if (!filterYear) return 0;
     return financialRecords
        .filter(r => new Date(r.date).getFullYear().toString() === filterYear)
        .reduce((sum, r) => sum + r.amount, 0);
  }, [financialRecords, filterYear]);

  const handleExport = () => {
    if (filteredRecords.length === 0) {
      showNotification("Não há dados financeiros para exportar com os filtros atuais.", "info");
      return;
    }
    const filename = `financeiro_${filterYear}${filterMonth ? '_' + filterMonth : ''}`;
    exportToCSV(
      filteredRecords.map(r => ({
          Data: formatDate(r.date),
          Descricao: r.description,
          Valor: r.amount.toFixed(2)
      })),
      filename,
      [
        { key: 'Data', label: 'Data' },
        { key: 'Descricao', label: 'Descrição' },
        { key: 'Valor', label: 'Valor (R$)' },
      ]
    );
    showNotification("Dados financeiros exportados!", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Controle Financeiro</h1>
        <Button onClick={handleExport} variant="primary" disabled={filteredRecords.length === 0}>
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Exportar CSV
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Filtrar por Ano:"
            value={filterYear}
            onChange={(e) => { setFilterYear(e.target.value); setFilterMonth(''); }}
            options={[{value: '', label: 'Todos os Anos'}, ...yearsWithData.map(year => ({ value: year, label: year }))]}
          />
          <Select
            label="Filtrar por Mês:"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            options={[{value: '', label: 'Todos os Meses (do ano selecionado)'}, ...monthsWithDataInYear]}
            disabled={!filterYear}
          />
          <div className="md:col-span-1 flex items-end">
            <Card className="w-full p-3 text-center bg-purple-50 dark:bg-purple-900/30">
                 <p className="text-sm text-purple-700 dark:text-purple-300">Total Filtrado:</p>
                 <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(totalGains)}</p>
            </Card>
          </div>
        </div>
         {filterYear && (
            <div className="mt-4 text-center">
                 <p className="text-md text-slate-600 dark:text-slate-300">Total Anual ({filterYear}): <span className="font-bold">{formatCurrency(annualTotal)}</span></p>
            </div>
        )}
      </Card>

      {filterYear && sortedMonthlySummary.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Ganhos Mensais ({filterYear})</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={sortedMonthlySummary} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} className="stroke-slate-300 dark:stroke-slate-700"/>
                <XAxis dataKey="name" tick={{ fill: currentTheme === 'dark' ? '#cbd5e1' : '#475569', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => formatCurrency(value as number)} tick={{ fill: currentTheme === 'dark' ? '#cbd5e1' : '#475569', fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ 
                    backgroundColor: currentTheme === 'dark' ? '#334155' : '#ffffff', 
                    borderColor: currentTheme === 'dark' ? '#475569' : '#e2e8f0', 
                    color: currentTheme === 'dark' ? '#f1f5f9' : '#1e293b' 
                  }}
                  itemStyle={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                  cursor={{ fill: currentTheme === 'dark' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.1)' }} 
                />
                <Legend wrapperStyle={{ color: currentTheme === 'dark' ? '#cbd5e1' : '#475569' }} />
                <Bar dataKey="Ganhos" fill="#7C3AED" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}


      {filteredRecords.length === 0 ? (
        <Card className="text-center p-8">
            <ChartBarIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Nenhum registro financeiro encontrado para o período selecionado.</p>
        </Card>
      ) : (
        <Card>
            <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Registros Detalhados</h2>
            <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Descrição</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor</th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800/50 divide-y divide-slate-200 dark:divide-slate-700">
                {filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">{formatDate(record.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">{record.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600 dark:text-green-400">{formatCurrency(record.amount)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </Card>
      )}
    </div>
  );
};

export default FinancialsPage;