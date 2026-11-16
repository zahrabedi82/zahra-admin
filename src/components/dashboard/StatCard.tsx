import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 wrap-break-word text-2xl font-bold text-gray-800 sm:text-3xl">
            {value}
          </h2>
        </div>

        <div className="shrink-0 text-3xl text-blue-600 sm:text-4xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;