interface TableProps {
  headers: string[];
  children: React.ReactNode;
}
const Table = ({ headers, children }: TableProps) => {
return(
    <div className="overflow-x-auto bg-white rounded-xl shadow">
         <table className="min-w-full">
             <thead className="bg-slate-100">
                  <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
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
}











export default Table;