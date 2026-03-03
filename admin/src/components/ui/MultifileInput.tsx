import {useCallback} from 'react';
import {type FileRejection, useDropzone} from 'react-dropzone';
import {FileText, UploadCloud, X} from 'lucide-react';
import {toast} from 'sonner';
import {cn} from "@/ultis/cn.ts";

interface MultiFileInputProps {
    label?: string;
    value: File[];
    onChange: (files: File[]) => void;
    maxSize?: number; // MB
    maxFiles?: number;
    accept?: Record<string, string[]>;
    description?: string;
}

export function MultiFileInput({
                                   label,
                                   value,
                                   onChange,
                                   maxSize = 10,
                                   maxFiles = 5,
                                   // Cập nhật mặc định để hỗ trợ Kindle formats
                                   accept = {
                                       'application/pdf': ['.pdf'],
                                       'application/epub+zip': ['.epub'],
                                       'application/x-mobipocket-ebook': ['.mobi'],
                                       'application/vnd.amazon.ebook': ['.azw3'],
                                       'application/octet-stream': ['.mobi', '.azw3'] // Dự phòng cho trình duyệt không nhận diện được MIME
                                   },
                                   description
                               }: MultiFileInputProps) {

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            fileRejections.forEach((rejection) => {
                const { file, errors } = rejection;
                if (errors[0].code === 'file-too-large') {
                    toast.error(`${file.name} quá lớn. Tối đa ${maxSize}MB`);
                } else {
                    toast.error(`${file.name} không đúng định dạng hỗ trợ`);
                }
            });
            return;
        }

        const newFiles = [...value, ...acceptedFiles].slice(0, maxFiles);
        onChange(newFiles);
    }, [value, onChange, maxSize, maxFiles]);

    const removeFile = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index);
        onChange(newFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize: maxSize * 1024 * 1024,
        maxFiles
    });

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 ml-1 mb-0.5">
                    {label}
                </span>
            )}

            <div
                {...getRootProps()}
                className={cn(
                    "relative cursor-pointer rounded-xl border border-dashed transition-all p-8 flex flex-col items-center justify-center text-center",
                    "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50/50",
                    isDragActive && "border-slate-500 bg-slate-50",
                    value.length >= maxFiles && "opacity-50 pointer-events-none"
                )}
            >
                <input {...getInputProps()} />
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-400">
                    <UploadCloud size={20} />
                </div>
                <p className="text-sm font-medium text-slate-900">
                    {isDragActive ? 'Thả file ngay' : 'Tải tài liệu lên'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                    {description || `Định dạng: PDF, EPUB, MOBI, AZW3 (Tối đa ${maxSize}MB)`}
                </p>
            </div>

            {value.length > 0 && (
                <div className="mt-3 space-y-2">
                    {value.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white group transition-colors hover:border-slate-200"
                        >
                            <div className="text-slate-400">
                                <FileText size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-slate-700 truncate">
                                    {file.name}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}