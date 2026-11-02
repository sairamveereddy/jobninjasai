"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Users, ArrowRight, Sparkles } from "lucide-react";

interface BulkResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  roleTitle?: string;
  onUploadSuccess: (candidates: any[]) => void;
}

export function BulkResumeModal({
  isOpen,
  onClose,
  roleId,
  roleTitle,
  onUploadSuccess,
}: BulkResumeModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [results, setResults] = useState<any[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
        f.name.endsWith('.pdf') || f.name.endsWith('.doc') || f.name.endsWith('.docx') || f.name.endsWith('.txt')
      );
      if (droppedFiles.length > 0) {
        setFiles(prev => [...prev, ...droppedFiles]);
        setErrorMessage(null);
      } else {
        setErrorMessage("Please drop valid resume files (.pdf, .docx, or .txt)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selected]);
      setErrorMessage(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setErrorMessage("Please select at least one resume to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("roleId", roleId);
      files.forEach(file => {
        formData.append("files", file);
      });

      const res = await fetch("/api/resumes/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process resumes");
      }

      setResults(data.details || []);
      setUploadProgress({ current: files.length, total: files.length });
      if (data.candidates && data.candidates.length > 0) {
        onUploadSuccess(data.candidates);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload and parse resumes.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDone = () => {
    setFiles([]);
    setResults(null);
    setUploadProgress(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#5e6ad2] border border-indigo-100">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Bulk Resume Intake</h2>
              <p className="text-xs text-slate-500">
                Upload multiple candidate resumes for <span className="font-medium text-slate-700">{roleTitle || "this role"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!results ? (
            <>
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-[#5e6ad2] bg-indigo-50/40 scale-[0.99]"
                    : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-[#5e6ad2] mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Drop resumes here, or <span className="text-[#5e6ad2] hover:underline">browse files</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, Word (.docx), and TXT • Batch parsing with automatic contact extraction
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Selected Files Preview */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Selected Resumes ({files.length})</span>
                    <button
                      type="button"
                      onClick={() => setFiles([])}
                      className="text-slate-400 hover:text-rose-600 text-[11px]"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          ) : (
            /* Results View */
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold">Successfully parsed and imported {results.length} candidates!</p>
                  <p className="text-emerald-700 mt-0.5 text-[11px]">
                    Candidate profiles, parsed text, and contact information have been added to this role.
                  </p>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {results.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-2.5 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.email}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      item.isNew
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {item.isNew ? "New Profile" : "Updated Existing"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          {!results ? (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUploading || files.length === 0}
                className="flex items-center gap-2 rounded-xl bg-[#5e6ad2] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#4f59c0] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Parsing & Ingesting ({files.length})...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Parse & Ingest ({files.length} resumes)
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleDone}
              className="flex items-center gap-2 rounded-xl bg-[#5e6ad2] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#4f59c0] transition-colors cursor-pointer"
            >
              Done & View on Board
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
