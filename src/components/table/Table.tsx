import type { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
}

const Table = ({ headers, children }: TableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full min-w-[650px]">
        <thead className="bg-slate-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-slate-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;