'use client';

import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface StatusData {
  name: string;
  value: number;
  status: string;
}

interface NucleusData {
  name: string;
  value: number;
  nucleus: string;
}

interface MonthData {
  month: string;
  count: number;
}

interface SuccessRateData {
  data: {
    name: string;
    value: number;
  }[];
  total: number;
  successRate: number;
}

interface AnalyticsChartsProps {
  casesByStatus: StatusData[];
  casesByNucleus: NucleusData[];
  monthlyActivity: MonthData[];
  successRate: SuccessRateData;
}

// Chart Color Palettes
const STATUS_CHART_COLORS: Record<string, string> = {
  DRAFT: '#9CA3AF',
  INVITE_SENT: '#3B82F6',
  INVITE_ACCEPTED: '#06B6D4',
  INTERVIEW_PHASE: '#A855F7',
  SESSION_SCHEDULED: '#6366F1',
  IN_MEDIATION: '#EAB308',
  AGREEMENT_REACHED: '#22C55E',
  NEGATIVE_TERM: '#F97316',
  CLOSED: '#6B7280',
  ARCHIVED: '#9CA3AF',
};

const SUCCESS_COLORS = ['#22C55E', '#F97316', '#3B82F6'];

const NUCLEUS_COLORS = [
  '#4A4458', // primary
  '#7A2048', // crimson-dark
  '#A855F7', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#3B82F6', // blue
  '#EAB308', // yellow
];

export function AnalyticsCharts({
  casesByStatus,
  casesByNucleus,
  monthlyActivity,
  successRate,
}: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cases by Status - Pie Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-primary">
            Processos por Status
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Distribuição dos processos de acordo com seu status atual
        </p>
        {casesByStatus.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={casesByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {casesByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_CHART_COLORS[entry.status] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <PieChartIcon className="h-12 w-12 mb-2" />
            <p className="text-sm">Sem dados disponíveis</p>
          </div>
        )}
      </div>

      {/* Cases by Nucleus - Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-primary">
            Processos por Núcleo
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Volume de processos por núcleo de atuação
        </p>
        {casesByNucleus.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={casesByNucleus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#4A4458" label={{ position: 'right' }}>
                {casesByNucleus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={NUCLEUS_COLORS[index % NUCLEUS_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <BarChart3 className="h-12 w-12 mb-2" />
            <p className="text-sm">Sem dados disponíveis</p>
          </div>
        )}
      </div>

      {/* Monthly Activity - Line Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-primary">
            Atividade Mensal
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Processos criados nos últimos 6 meses
        </p>
        {monthlyActivity.some(m => m.count > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4A4458"
                strokeWidth={2}
                dot={{ fill: '#4A4458', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <TrendingUp className="h-12 w-12 mb-2" />
            <p className="text-sm">Sem dados disponíveis</p>
          </div>
        )}
      </div>

      {/* Success Rate - Donut Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-primary">
            Taxa de Sucesso
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Resultados dos processos concluídos
        </p>
        {successRate.data.some(d => d.value > 0) ? (
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={successRate.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {successRate.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SUCCESS_COLORS[index % SUCCESS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {successRate.total > 0 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-3xl font-bold text-primary">
                  {successRate.successRate}%
                </div>
                <div className="text-xs text-gray-500">Taxa de Acordo</div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {successRate.data.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: SUCCESS_COLORS[index] }}
                  />
                  <span className="text-xs text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <PieChartIcon className="h-12 w-12 mb-2" />
            <p className="text-sm">Sem dados disponíveis</p>
          </div>
        )}
      </div>
    </div>
  );
}
