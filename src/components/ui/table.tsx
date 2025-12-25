"use client";
import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";

interface FieldConfig {
  key: string;
  label: string;
  type?: string;
}

interface AutoTableProps {
  data: any[];
  fields?: FieldConfig[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;

  page?: number;
  perPage?: number;
}

export default function AutoTable({
  data,
  fields,
  onEdit,
  onDelete,
  onView,
  page = 1,
  perPage = data.length,
}: AutoTableProps) {
  if (!data || data.length === 0)
    return (
      <div className="p-6 text-center bg-white shadow-sm rounded-xl">
        Tidak ada data.
      </div>
    );

  const columns =
    fields || Object.keys(data[0]).map((key) => ({ key, label: key }));

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-md">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm">
          <tr>
            <th className="px-5 py-4 text-center font-semibold tracking-wide">
              No
            </th>

            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-4 text-left font-semibold tracking-wide"
              >
                {col.label}
              </th>
            ))}

            {(onEdit || onDelete || onView) && (
              <th className="px-5 py-4 text-center font-semibold">Aksi</th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-blue-50/50 transition-colors duration-200"
            >
              <td className="px-5 py-4 text-center text-gray-700 font-medium">
                {(page - 1) * perPage + index + 1}
              </td>

              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4 text-gray-700">
                  {String(item[col.key])}
                </td>
              ))}

              {(onEdit || onDelete || onView) && (
                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      >
                        <Eye size={16} />
                      </button>
                    )}

                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                      >
                        <Edit size={16} />
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
