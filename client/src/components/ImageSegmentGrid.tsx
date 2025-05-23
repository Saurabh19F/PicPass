interface ImageSegmentGridProps {
  previewUrl: string;
  selectedSegments: number[];
  onSegmentClick: (index: number) => void;
  onClear?: () => void;
}

export default function ImageSegmentGrid({
  previewUrl,
  selectedSegments,
  onSegmentClick,
  onClear,
}: ImageSegmentGridProps) {
  return (
    <div className="flex flex-col items-center gap-2 mt-4 w-full">
      <div className="relative w-full max-w-[400px] aspect-square rounded-xl overflow-hidden shadow-lg">
        <img
          src={previewUrl}
          alt="uploaded"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
          {Array.from({ length: 36 }, (_, i) => (
            <div
              key={i}
              role="button"
              aria-label={`Select segment ${i + 1}`}
              className={`border border-white/20 transition duration-200 ease-in-out cursor-pointer flex items-center justify-center text-[10px] font-bold ${
                selectedSegments.includes(i + 1)
                  ? "bg-blue-500/70 text-white shadow-inner"
                  : "hover:bg-blue-400/30 hover:text-white text-transparent"
              }`}
              onClick={() => onSegmentClick(i + 1)}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-sm text-gray-700 dark:text-gray-300 flex justify-between w-full max-w-[400px]">
        <span>
          🧩 <strong>{selectedSegments.length}</strong>{" "}
          segment{selectedSegments.length !== 1 ? "s" : ""} selected
        </span>
        {onClear && (
          <button
            onClick={onClear}
            className="text-red-600 hover:underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
          >
            Clear Selection
          </button>
        )}
      </div>
    </div>
  );
}
