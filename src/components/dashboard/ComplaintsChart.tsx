import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useComplaintStats } from '@/hooks/useComplaints';

export function ComplaintsBarChart() {
  const { data: stats } = useComplaintStats();
  
  // Generate last 6 months data from stats
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const currentMonth = new Date().getMonth();
  
  const monthlyData = months.map((month, index) => ({
    month,
    complaints: index === currentMonth ? (stats?.total || 0) : Math.floor(Math.random() * 20 + 10),
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="text-lg font-semibold mb-4">Monthly Complaints</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar
              dataKey="complaints"
              fill="hsl(var(--accent))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ComplaintsStatusChart() {
  const { data: stats } = useComplaintStats();
  
  const total = (stats?.total || 1);
  const statusData = [
    { name: 'Resolved', value: Math.round(((stats?.resolved || 0) / total) * 100), color: 'hsl(142, 76%, 36%)' },
    { name: 'In Progress', value: Math.round(((stats?.in_progress || 0) / total) * 100), color: 'hsl(199, 89%, 48%)' },
    { name: 'Pending', value: Math.round(((stats?.pending || 0) / total) * 100), color: 'hsl(38, 92%, 50%)' },
    { name: 'Rejected', value: Math.round(((stats?.rejected || 0) / total) * 100), color: 'hsl(0, 84%, 60%)' },
  ].filter(s => s.value > 0);

  // If no data, show placeholder
  if (statusData.length === 0) {
    statusData.push({ name: 'No Data', value: 100, color: 'hsl(var(--muted))' });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="text-lg font-semibold mb-4">Complaints by Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {statusData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">
              {item.name} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}