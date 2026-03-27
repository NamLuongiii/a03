import {useCallback, useEffect, useState} from 'react';
import {type FileRejection, useDropzone} from 'react-dropzone';
import {UploadCloud, X} from 'lucide-react';
import {toast} from 'sonner';

interface CoverInputProps {
    value?: File | null;
    initialUrl?: string; // Nhận URL từ server (book.cover.url)
    onChange: (file: File | null) => void;
    maxSize?: number;
}

export function CoverInput({value, initialUrl, onChange, maxSize = 2}: CoverInputProps) {
    const [preview, setPreview] = useState<string | null>(null);

    // Cập nhật preview khi có file mới hoặc có initialUrl
    useEffect(() => {
        if (value) {
            const objectUrl = URL.createObjectURL(value);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (initialUrl) {
            setPreview(initialUrl);
        } else {
            setPreview(null);
        }
    }, [value, initialUrl]);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            const error = fileRejections[0].errors[0];
            if (error.code === 'file-too-large') {
                toast.error(`File quá lớn. Tối đa ${maxSize}MB`);
            } else {
                toast.error('Định dạng file không hỗ trợ (JPG, PNG, WebP)');
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            onChange(acceptedFiles[0]);
        }
    }, [onChange, maxSize]);

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setPreview(null);
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {'image/*': ['.jpeg', '.jpg', '.png', '.webp']},
        maxSize: maxSize * 1024 * 1024,
        multiple: false
    });

    return (
        <div className="space-y-1.5 w-40 mx-auto">
            <div
                {...getRootProps()}
                className={`
                    relative group cursor-pointer border border-dashed transition-all
                    flex flex-col items-center justify-center overflow-hidden aspect-[1/1.6] bg-slate-50/50
                    ${isDragActive ? 'border-slate-900 bg-slate-100' : 'border-slate-200 hover:border-slate-300'}
                `}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover absolute inset-0"/>
                        <div
                            className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <button
                                type="button"
                                onClick={removeFile}
                                className="bg-white p-2 rounded-xl text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                <X size={18}/>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-6 text-center">
                        <div
                            className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400 shadow-sm">
                            <UploadCloud size={18}/>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-slate-600">
                                {isDragActive ? 'Thả để tải lên' : 'Tải ảnh bìa'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                                Max {maxSize}MB (JPG, PNG)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}