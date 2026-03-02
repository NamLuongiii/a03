import {useCallback, useState} from 'react';
import {type FileRejection, useDropzone} from 'react-dropzone';
import {UploadCloud, X} from 'lucide-react';
import {toast} from 'sonner';

interface CoverInputProps {
    value?: File | null;
    onChange: (file: File | null) => void;
    maxSize?: number; // tính bằng MB
}

export function CoverInput({ value, onChange, maxSize = 2 }: CoverInputProps) {
    const [preview, setPreview] = useState<string | null>(value ? URL.createObjectURL(value) : null);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        // Xử lý lỗi validate
        if (fileRejections.length > 0) {
            const error = fileRejections[0].errors[0];
            if (error.code === 'file-too-large') {
                toast.error(`File quá lớn. Tối đa là ${maxSize}MB`);
            } else if (error.code === 'file-invalid-type') {
                toast.error('Định dạng file không hỗ trợ. Vui lòng dùng JPG, PNG hoặc WebP');
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            onChange(file);
            setPreview(URL.createObjectURL(file));
        }
    }, [onChange, maxSize]);

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setPreview(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxSize: maxSize * 1024 * 1024,
        multiple: false
    });

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Ảnh bìa sách</label>

            <div
                {...getRootProps()}
                className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed transition-colors
          flex flex-col items-center justify-center overflow-hidden min-h-[200px]
          ${isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'}
        `}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={removeFile}
                                className="bg-white/90 p-2 rounded-full text-slate-900 hover:bg-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                            <UploadCloud size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-700">
                                {isDragActive ? 'Thả file vào đây' : 'Kéo thả hoặc click để tải ảnh'}
                            </p>
                            <p className="text-xs text-slate-400">
                                Định dạng: JPG, PNG, WebP (Tối đa {maxSize}MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}