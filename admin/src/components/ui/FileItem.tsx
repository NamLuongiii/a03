import {Download, FileText, HardDrive, X} from 'lucide-react';
import {cn} from "@/ultis/cn.ts";
import type {ModelsDigitalBook} from "@/api";

interface FileItemProps {
    file: ModelsDigitalBook;
    onDelete?: (id: number) => void;
    className?: string;
}

export function FileItem({ file, onDelete, className }: FileItemProps) {
    // Hàm lấy tên file từ URL nếu không có field name riêng
    const fileName = file.name

    // Hàm lấy phần mở rộng để hiển thị (ví dụ: PDF, EPUB)
    const fileExt = fileName?.split('.').pop()?.toUpperCase() || 'FILE';

    return (
        <div className={cn(
            "group flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white transition-all hover:border-slate-200",
            className
        )}>
            {/* Icon đại diện cho File */}
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-50 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                <FileText size={18} className="text-slate-400 group-hover:text-slate-600" />
                <span className="text-[8px] font-bold text-slate-400 mt-0.5">{fileExt}</span>
            </div>

            {/* Thông tin File */}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate pr-2">
                    {fileName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-tight">
                        <HardDrive size={10} />
                        <span>Cloud Storage</span>
                    </div>
                </div>
            </div>

            {/* Actions: Download & Delete */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {file.url && (
                    <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        <Download size={14} />
                    </a>
                )}

                <button
                    type="button"
                    onClick={() => file.id && onDelete?.(file.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}