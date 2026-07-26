import React, { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Upload, Download, RefreshCw, Sliders, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ImageInfo {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  url: string;
}

export default function ImageCompressor() {
  const [sourceImage, setSourceImage] = useState<ImageInfo | null>(null);
  const [compressedImage, setCompressedImage] = useState<{
    url: string;
    size: number;
    width: number;
    height: number;
    reduction: number;
  } | null>(null);

  const [quality, setQuality] = useState<number>(0.8);
  const [scale, setScale] = useState<number>(100);
  const [format, setFormat] = useState<string>("image/jpeg");
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load and analyze the uploaded file
  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setSourceImage({
          name: file.name,
          size: file.size,
          type: file.type,
          width: img.naturalWidth,
          height: img.naturalHeight,
          url: url,
        });
        // Reset previously compressed image
        setCompressedImage(null);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Perform client-side compression on canvas
  const compressImage = () => {
    if (!sourceImage) return;

    setIsCompressing(true);

    const img = new Image();
    img.src = sourceImage.url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsCompressing(false);
        return;
      }

      // Calculate new dimensions
      const targetWidth = Math.round(sourceImage.width * (scale / 100));
      const targetHeight = Math.round(sourceImage.height * (scale / 100));

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Export format
      const exportFormat = format === "original" ? sourceImage.type : format;

      // Trigger standard exports
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedUrl = URL.createObjectURL(blob);
            const reduction = ((sourceImage.size - blob.size) / sourceImage.size) * 100;

            setCompressedImage({
              url: compressedUrl,
              size: blob.size,
              width: targetWidth,
              height: targetHeight,
              reduction: reduction > 0 ? reduction : 0,
            });
          }
          setIsCompressing(false);
        },
        exportFormat,
        format === "image/png" ? undefined : quality // PNG does not support canvas quality argument
      );
    };
  };

  // Automatically compress when sliders/formats change for optimal UX
  useEffect(() => {
    if (sourceImage) {
      const delayDebounce = setTimeout(() => {
        compressImage();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [sourceImage, quality, scale, format]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const downloadCompressed = () => {
    if (!compressedImage || !sourceImage) return;

    const originalName = sourceImage.name;
    const extension = format === "image/png" ? ".png" : format === "image/webp" ? ".webp" : ".jpg";
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
    const filename = `${nameWithoutExt}_compressed${extension}`;

    const link = document.createElement("a");
    link.href = compressedImage.url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSourceImage(null);
    setCompressedImage(null);
  };

  return (
    <div id="image-compressor-root" className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                Local Image Compressor
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Reduce image file size instantly right in your browser. 100% private.
              </p>
            </div>
          </div>

          {sourceImage && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset / New Image
            </button>
          )}
        </div>

        {/* Upload State */}
        {!sourceImage && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl py-12 px-6 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/10"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-200">
              Drag and drop your image here
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1.5">
              or click to browse your files. Supports JPG, PNG, WEBP, and SVG formats.
            </p>
            <div className="mt-5">
              <span className="inline-block px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-2xs">
                Select Photo
              </span>
            </div>
          </div>
        )}

        {/* Workspace State */}
        {sourceImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Configuration Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  Compression Settings
                </h3>

                {/* File Format Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "image/jpeg", label: "JPEG" },
                      { val: "image/png", label: "PNG" },
                      { val: "image/webp", label: "WEBP" },
                    ].map((f) => (
                      <button
                        key={f.val}
                        type="button"
                        onClick={() => setFormat(f.val)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          format === f.val
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-2xs"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider (Disabled for pure PNG to prevent UX confusion) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    <span>Quality</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                      {format === "image/png" ? "Lossless" : `${Math.round(quality * 100)}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    disabled={format === "image/png"}
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <span>Small size (0.1)</span>
                    <span>Standard (0.8)</span>
                    <span>Best Quality (1.0)</span>
                  </div>
                </div>

                {/* Scale Size Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    <span>Dimension Scaling</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                      {scale}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={scale}
                    onChange={(e) => setScale(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <span>10% width</span>
                    <span>50% scale</span>
                    <span>Original size (100%)</span>
                  </div>
                </div>
              </div>

              {/* Original File Stats */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Original Metadata
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-normal uppercase tracking-wider mb-0.5">
                      Filename
                    </span>
                    <span className="truncate block font-semibold">{sourceImage.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-normal uppercase tracking-wider mb-0.5">
                      File Size
                    </span>
                    <span className="font-mono block font-semibold text-slate-950 dark:text-white">
                      {formatSize(sourceImage.size)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-normal uppercase tracking-wider mb-0.5">
                      Dimensions
                    </span>
                    <span className="font-mono block font-semibold">
                      {sourceImage.width} x {sourceImage.height} px
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-normal uppercase tracking-wider mb-0.5">
                      Format
                    </span>
                    <span className="font-mono block font-semibold uppercase">
                      {sourceImage.type.split("/")[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original View */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    Original
                  </span>
                  <div className="aspect-square bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2 relative">
                    <img
                      src={sourceImage.url}
                      alt="Original Input Preview"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain rounded"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-[10px] font-mono text-white px-2 py-0.5 rounded">
                      {sourceImage.width}x{sourceImage.height} px
                    </div>
                  </div>
                </div>

                {/* Compressed View */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Compressed</span>
                    {isCompressing && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Compressing...
                      </span>
                    )}
                  </span>
                  <div className="aspect-square bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2 relative">
                    {compressedImage ? (
                      <>
                        <img
                          src={compressedImage.url}
                          alt="Compressed Output Preview"
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full object-contain rounded"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 text-[10px] font-mono text-white px-2 py-0.5 rounded">
                          {compressedImage.width}x{compressedImage.height} px
                        </div>
                        {compressedImage.reduction > 0 && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                            -{compressedImage.reduction.toFixed(0)}%
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                        <span>Rendering output...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Download Bar */}
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  {compressedImage ? (
                    <div>
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <span className="text-xs text-slate-500 dark:text-slate-400">File Size:</span>
                        <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                          {formatSize(compressedImage.size)}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        Saved {formatSize(sourceImage.size - compressedImage.size)} ({compressedImage.reduction.toFixed(1)}% reduction!)
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Updating image metrics...</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={downloadCompressed}
                  disabled={!compressedImage || isCompressing}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Compressed Image</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
