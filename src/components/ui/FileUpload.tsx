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
  maxFileSize?: number; 
  acceptedTypes?: string[];
  className?: string;
  existingFiles?: UploadedFile[];
}
export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10,
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
