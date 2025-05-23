import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface FileItem {
  fileType: string;
  // add other properties if needed
}

export default function Analytics({ fileList }: { fileList: FileItem[] }) {
  const stats = fileList.reduce(
    (acc: { pdf: number; doc: number; ppt: number; other: number }, file: FileItem) => {
      const type = file.fileType.toLowerCase();
      if (type.includes("pdf")) acc.pdf++;
      else if (type.includes("doc")) acc.doc++;
      else if (type.includes("ppt")) acc.ppt++;
      else acc.other++;
      return acc;
    },
    { pdf: 0, doc: 0, ppt: 0, other: 0 }
  );

  const pieData = [
    { name: "PDF", value: stats.pdf },
    { name: "DOCX", value: stats.doc },
    { name: "PPTX", value: stats.ppt },
    { name: "Other", value: stats.other },
  ].filter((d) => d.value > 0);

  const COLORS = ["#10b981", "#6366f1", "#f97316", "#e11d48"];

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">📊 File Type Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={({ name, value }) => `${name} (${value})`}
            labelLine={false}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: 8 }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ marginTop: 30 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}
