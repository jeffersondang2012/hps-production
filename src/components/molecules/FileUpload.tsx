import React, { useRef, useState } from 'react';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';
import clsx from 'clsx';

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onChange: (files: File[]) => void;
  error?: string;
  helperText?: string;
}

export const FileUpload = ({
  label,
  accept,
  multiple = false,
  maxSize = 5,
  onChange,
  error,
  helperText,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      // Kiểm tra định dạng file
      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type || `application/${file.name.split('.').pop()}`;
        if (!acceptedTypes.some(type => fileType.match(new RegExp(type.replace('*', '.*'))))) {
          return false;
        }
      }

      // Kiểm tra kích thước file
      if (file.size > maxSize * 1024 * 1024) {
        return false;
      }

      return true;
    });

    setSelectedFiles(prevFiles => 
      multiple ? [...prevFiles, ...validFiles] : validFiles
    );
    onChange(validFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      onChange(newFiles);
      return newFiles;
    });
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={clsx(
          'relative border-2 border-dashed rounded-lg p-4',
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
          error && 'border-red-300'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div className="text-center">
          <Icon name="ArrowUpTrayIcon" className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              Chọn tệp
            </Button>
            <p className="mt-1 text-sm text-gray-500">
              hoặc kéo thả file vào đây
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {accept && `Định dạng: ${accept}`} {maxSize && `(Tối đa ${maxSize}MB)`}
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <ul className="mt-4 space-y-2">
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded p-2"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon name="XMarkIcon" size="sm" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {(error || helperText) && (
        <p className={clsx(
          'text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}; 