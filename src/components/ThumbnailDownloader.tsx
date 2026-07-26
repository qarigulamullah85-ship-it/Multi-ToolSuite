import React, { useState, useEffect } from "react";
import { Youtube, Download, Copy, Check, Eye, HelpCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ThumbnailDownloader() {
  const [url, setUrl] = useState("");
  const [extractedId, setExtractedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  // Parse YouTube video ID from URL
  const extractYoutubeId = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Direct ID input
    if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    try {
      // Regex for multiple YouTube patterns: watch?v=, embeds, shorts, youtu.be, etc.
      const patterns = [
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|watch\?v=|embed\/|vi?\/|ytscreen\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
        /^[a-zA-Z0-9_-]{11}$/
      ];

      for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
    return null;
  };

  useEffect(() => {
    if (!url) {
      setExtractedId(null);
      setError(null);
      return;
    }

    const id = extractYoutubeId(url);
    if (id) {
      setExtractedId(id);
      setError(null);
    } else {
      setExtractedId(null);
      setError("Could not parse a valid YouTube video URL or Video ID.");
    }
  }, [url]);

  const qualities = [
    {
      key: "maxresdefault",
      label: "Maximum Resolution (Full HD)",
      resolution: "1920 x 1080",
      suffix: "maxresdefault.jpg",
      badge: "Best Quality",
    },
    {
      key: "sddefault",
      label: "Standard Definition (SD)",
      resolution: "640 x 480",
      suffix: "sddefault.jpg",
      badge: "Standard",
    },
    {
      key: "hqdefault",
      label: "High Quality (HQ)",
      resolution: "480 x 360",
      suffix: "hqdefault.jpg",
      badge: "Balanced",
    },
    {
      key: "mqdefault",
      label: "Medium Quality",
      resolution: "320 x 180",
      suffix: "mqdefault.jpg",
      badge: "Compressed",
    },
    {
      key: "default",
      label: "Default Thumbnail",
      resolution: "120 x 90",
      suffix: "default.jpg",
      badge: "Small",
    },
  ];

  const getThumbnailUrl = (id: string, suffix: string) => {
    return `https://img.youtube.com/vi/${id}/${suffix}`;
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Modern browser-side file downloader using fetch and blob, falling back to new tab opening
  const triggerDownload = async (imageUrl: string, filename: string, index: number) => {
    setDownloadingIndex(index);
    try {
      // We load the image into an HTML image element with anonymous cors enabled
      // and draw on canvas to bypass img.youtube.com CORS policy for direct downloading
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("CORS or loading error"));
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            // Fallback
            window.open(imageUrl, "_blank", "noopener,noreferrer");
          }
        }, "image/jpeg", 0.95);
      } else {
        window.open(imageUrl, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      // If CORS or loading blocks us, open in new tab directly as absolute fallback
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      // Clipboard API might be blocked on iframe, fallback to normal typing
    }
  };

  return (
    <div id="youtube-downloader-root" className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
            <Youtube className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
              YouTube Thumbnail Downloader
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Extract and download any YouTube video thumbnail in all available formats.
            </p>
          </div>
        </div>

        {/* Input area */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Enter YouTube Video URL or Video ID
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 dark:text-slate-100 transition-all placeholder:text-slate-400"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handlePaste}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors shrink-0"
            >
              Paste Link
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-400 dark:text-slate-500 mt-1">
            <span>Supports:</span>
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">youtu.be/ID</span>
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">youtube.com/watch?v=ID</span>
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">youtube.com/shorts/ID</span>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium text-red-500 mt-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Extracted Thumbnail Display */}
      <AnimatePresence>
        {extractedId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >
            {/* Left side preview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs sticky top-4">
                <h3 className="text-sm font-bold text-slate-950 dark:text-slate-100 mb-3 font-display flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-500" />
                  Live Preview
                </h3>
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative group">
                  <img
                    src={getThumbnailUrl(extractedId, "maxresdefault.jpg")}
                    alt="YouTube Thumbnail High Quality Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to high quality standard if maxres doesn't exist
                      (e.target as HTMLImageElement).src = getThumbnailUrl(extractedId, "hqdefault.jpg");
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md text-[10px] font-mono text-white px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold">
                    Live
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Video ID detected:</span>
                  </div>
                  <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-semibold select-all">
                    {extractedId}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-2.5 items-start">
                  <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-400">
                    If the maximum resolution is not available, YouTube automatically defaults to high quality. You can select the specific resolution files to download on the right list.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side download list */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-display mb-1">
                Available Download Options
              </h3>

              <div className="space-y-3">
                {qualities.map((q, idx) => {
                  const imgUrl = getThumbnailUrl(extractedId, q.suffix);
                  const filename = `yt_thumbnail_${extractedId}_${q.key}.jpg`;

                  return (
                    <div
                      key={q.key}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-10 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 relative shrink-0">
                          <img
                            src={imgUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If maxres doesn't exist, hide or load hqdefault
                              (e.target as HTMLImageElement).src = getThumbnailUrl(extractedId, "default.jpg");
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {q.label}
                            </h4>
                            <span className="text-[10px] font-semibold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                              {q.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            Resolution: {q.resolution}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(imgUrl, idx)}
                          className="flex-1 sm:flex-none px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          title="Copy Image Address"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy URL</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={downloadingIndex === idx}
                          onClick={() => triggerDownload(imgUrl, filename, idx)}
                          className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:bg-indigo-400 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingIndex === idx ? "Processing..." : "Download"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder info when empty */}
      <AnimatePresence>
        {!extractedId && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/10"
          >
            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-4">
              <Youtube className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-200">
              Ready to Download Thumbnails?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1.5">
              Simply paste a YouTube video link or specific Video ID above to view download links.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all flex items-center gap-1"
              >
                <span>Try Demo Video</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
