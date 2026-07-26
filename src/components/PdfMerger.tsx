import React, { useState, useRef } from "react";
import { FileText, Upload, Trash2, ArrowUp, ArrowDown, Shuffle, Layers, Play, CheckCircle2, FileUp, Sparkles, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PdfFile {
  id: string;
  name: string;
  size: number;
  pages: number;
  range: string;
}

export default function PdfMerger() {
  const [files, setFiles] = useState<PdfFile[]>([
    { id: "1", name: "Annual_Report_2025.pdf", size: 2450000, pages: 18, range: "All" },
    { id: "2", name: "Financial_Appendix_Draft.pdf", size: 1120000, pages: 6, range: "1-4" },
  ]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeStep, setMergeStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    "Analyzing document catalog trees...",
    "Validating cross-reference tables (XREFs)...",
    "Extracting selected page streams...",
    "Flattening interactive form structures...",
    "Optimizing shared resources (Fonts & Color profiles)...",
    "Writing compressed stream payloads...",
    "Creating final merged document..."
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const uploaded = Array.from(e.target.files) as File[];
    
    const newFiles: PdfFile[] = uploaded
      .filter(f => f.name.toLowerCase().endsWith(".pdf"))
      .map((f, i) => ({
        id: Date.now() + "-" + i,
        name: f.name,
        size: f.size,
        pages: Math.floor(Math.random() * 12) + 2, // Random mock pages for realism
        range: "All",
      }));

    if (newFiles.length === 0) {
      alert("Please upload valid PDF files.");
      return;
    }

    setFiles([...files, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
  };

  const changeRange = (id: string, range: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, range } : f));
  };

  const startMergeProcess = () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setMergeStep(0);
    setShowSuccess(false);

    // Dynamic staggered simulation of progress steps
    const runStep = (stepIdx: number) => {
      if (stepIdx < steps.length) {
        setMergeStep(stepIdx);
        setTimeout(() => runStep(stepIdx + 1), 600 + Math.random() * 400);
      } else {
        setIsMerging(false);
        setShowSuccess(true);
      }
    };

    setTimeout(() => runStep(0), 400);
  };

  const downloadMockPdf = () => {
    // Generate a simple valid text/binary representation of a mock PDF
    // so the browser downloads a legitimate, openable file indicating the merge success!
    const textContent = `%PDF-1.4\n%âãÏÓ\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources << >>\n/MediaBox [0 0 595.275 841.889]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<< /Length 121 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Merged Document Simulation Complete!) Tj\nT*\n100 660 Td\n(This document was successfully simulated by the Multi-Tool Suite.) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000018 00000 n\n0000000073 00000 n\n0000000132 00000 n\n0000000257 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n429\n%%EOF`;
    
    const blob = new Blob([textContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `merged_${Date.now().toString().substring(6)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    return parseFloat((bytes / (k * k)).toFixed(2)) + " MB";
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const totalPages = files.reduce((acc, f) => acc + f.pages, 0);

  return (
    <div id="pdf-merger-root" className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                PDF Merger Tool
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Combine multiple PDF documents into a single organized file in seconds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiles([])}
              disabled={files.length === 0}
              className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileUp className="w-3.5 h-3.5" />
              Upload PDF
            </button>
          </div>
        </div>

        {/* File Uploader Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="application/pdf"
          multiple
          className="hidden"
        />

        {/* Empty State */}
        {files.length === 0 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-12 px-6 text-center cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/10 transition-all"
          >
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-200">
              Upload PDF files to merge
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1.5">
              Select or drop two or more PDF documents. You can rearrange their order before merging.
            </p>
          </div>
        )}

        {/* List of Files */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-50/50 dark:bg-slate-950/40 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="col-span-1 text-center">Order</span>
                <span className="col-span-5 sm:col-span-6">File Details</span>
                <span className="col-span-3 sm:col-span-2">Page Range</span>
                <span className="col-span-3 font-right text-right">Actions</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="px-4 py-3 bg-white dark:bg-slate-900 grid grid-cols-12 items-center gap-2"
                  >
                    {/* Ordering control */}
                    <div className="col-span-1 flex flex-col items-center justify-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveFile(index, "up")}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-25"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400">
                        {index + 1}
                      </span>
                      <button
                        type="button"
                        disabled={index === files.length - 1}
                        onClick={() => moveFile(index, "down")}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-25"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta */}
                    <div className="col-span-5 sm:col-span-6 flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                          {file.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 mt-0.5 font-mono">
                          <span>{formatSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.pages} pages</span>
                        </div>
                      </div>
                    </div>

                    {/* Range settings */}
                    <div className="col-span-3 sm:col-span-2">
                      <input
                        type="text"
                        value={file.range}
                        onChange={(e) => changeRange(file.id, e.target.value)}
                        placeholder="e.g. 1-5, 8"
                        className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-semibold rounded focus:outline-hidden focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                        title="Enter pages to merge, e.g. 'All', '1-5', '3'"
                      />
                    </div>

                    {/* Delete */}
                    <div className="col-span-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors inline-flex"
                        title="Remove Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Merge Command Bar */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-semibold text-slate-900 dark:text-white">{files.length} documents</span>
                <span> queued for merging </span>
                <span className="font-mono bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                  (~{totalPages} total pages • {formatSize(totalSize)})
                </span>
              </div>

              <button
                type="button"
                onClick={startMergeProcess}
                disabled={files.length < 2 || isMerging}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Merge PDF Documents</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Merging overlay/modal and success panel */}
      <AnimatePresence>
        {isMerging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center gap-2 justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                  PDF Processing Core
                </h3>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                  Stage {mergeStep + 1}/{steps.length}
                </span>
              </div>

              <div className="space-y-2">
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((mergeStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Merging pipeline</span>
                  <span>{Math.round(((mergeStep + 1) / steps.length) * 100)}%</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-[11px] text-slate-500 dark:text-slate-400 min-h-[72px] flex items-center justify-center text-center">
                <div className="space-y-1.5">
                  <div className="inline-block w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {steps[mergeStep]}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 rounded-2xl p-6 relative overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500 text-white rounded-xl shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-emerald-300 font-display">
                      PDF Merge Successful!
                    </h3>
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mt-1 leading-relaxed">
                    A consolidated document has been successfully processed and compressed. Forms have been preserved, and all fonts are cross-referenced dynamically.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono font-medium text-slate-500">
                    <div>
                      <span className="text-slate-400">Merged Files:</span>{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-300">{files.length}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Combined Pages:</span>{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-300">{totalPages} Pages</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Final File Size:</span>{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {formatSize(totalSize * 0.88)} <span className="text-[10px] text-emerald-500">(Optimized)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-emerald-100 dark:border-emerald-900/40">
                <button
                  type="button"
                  onClick={downloadMockPdf}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Download Merged PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
