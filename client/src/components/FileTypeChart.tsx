import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface File {
  fileType: string;
  fileSize: number;
}

interface Props {
  data: File[];
}

const COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

export default function FileTypeChart({ data }: Props) {
  const grouped = data.reduce((acc: { [type: string]: number }, file) => {
    const type = file.fileType?.split("/")[1] || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            fill="#8884d8"
            
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
