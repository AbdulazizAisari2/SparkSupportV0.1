import React, { useState, useRef, useCallback } from 'react';
import { Upload, File, Image, FileText, Download, Eye, Trash2, Paperclip } from 'lucide-react';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  preview?: string;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  existingFiles?: UploadedFile[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  className = '',
  existingFiles = []
}) => {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf')) return FileText;
    if (type.includes('doc')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateUpload = (file: File): Promise<UploadedFile> => {
    return new Promise((resolve) => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        setUploadProgress(prev => ({ ...prev, [fileId]: Math.min(progress, 100) }));
        
        if (progress >= 100) {
          clearInterval(interval);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
          
          // Create uploaded file object
          const uploadedFile: UploadedFile = {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file), // In real app, this would be server URL
            uploadedAt: new Date(),
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
          };
          
          resolve(uploadedFile);
        }
      }, 100);
    });
  };

  const handleFiles = useCallback(async (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    
    // Validate file count
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file sizes and types
    const validFiles = newFiles.filter(file => {
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB`);
        return false;
      }
      
      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.type === type || file.name.toLowerCase().endsWith(type);
      });
      
      if (!isValidType) {
        alert(`File ${file.name} is not a supported type`);
        return false;
      }
      
      return true;
    });

    // Upload files
    const uploadPromises = validFiles.map(file => simulateUpload(file));
    const uploadedFiles = await Promise.all(uploadPromises);
    
    const updatedFiles = [...files, ...uploadedFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, maxFiles, maxFileSize, acceptedTypes, onFilesChange]);

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105'
            : 'border-gray-300 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-dark-700/50'
          }
        `}
      >
        <div className="space-y-4">
          <div className="relative">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-200 ${
              isDragging 
                ? 'bg-primary-500 text-white scale-110' 
                : 'bg-gray-100 dark:bg-dark-700 text-gray-400 dark:text-gray-500'
            }`}>
              <Upload className="w-8 h-8" />
            </div>
            {isDragging && (
              <div className="absolute inset-0 bg-primary-400 rounded-full blur opacity-50 animate-pulse"></div>
            )}
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold transition-colors ${
              isDragging 
                ? 'text-primary-700 dark:text-primary-300' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {isDragging ? 'Drop files here!' : 'Upload Files'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Max {maxFiles} files, {maxFileSize}MB each. Supports images, PDFs, and documents.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Paperclip className="w-4 h-4" />
            <span>Attached Files ({files.length})</span>
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const isUploading = uploadProgress[file.id] !== undefined;
              const progress = uploadProgress[file.id] || 0;
              
              return (
                <div
                  key={file.id}
                  className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-4 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-3">
                    {/* File Icon/Preview */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-dark-600"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleTimeString()}
                      </p>
                      
                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-1.5">
                            <div
                              className="h-1.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-200"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                            Uploading... {Math.round(progress)}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {!isUploading && (
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.preview && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.url, '_blank');
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const a = document.createElement('a');
                            a.href = file.url;
                            a.download = file.name;
                            a.click();
                          }}
                          className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};