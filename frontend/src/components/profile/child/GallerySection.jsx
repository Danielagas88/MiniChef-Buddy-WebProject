import { Camera } from "lucide-react";

/**
 * Gallery section component displaying user's uploaded photos
 */
export default function GallerySection({ images, loading, onDelete }) {
  return (
    <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-sm p-6 border border-(--card-surface-border) transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-(--text-primary) flex items-center gap-2">
            <Camera className="text-emerald-500" size={20} /> My Gallery
          </h3>
        </div>
        <span className="text-[10px] font-bold text-(--text-secondary) bg-(--input-bg) px-2 py-1 rounded-full border border-(--border-color)">
          {images.length} Photos
        </span>
      </div>

      {loading ? (
        <div className="text-center py-10 text-(--muted) text-sm">
          Loading... ⏳
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img._id}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm border-2 border-(--border-color) bg-(--input-bg) hover:shadow-md transition-all"
            >
              <img
                src={img.imageUrl}
                alt={img.caption || "My Dish"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <button
                onClick={() => onDelete(img._id)}
                className="absolute top-2 right-2 bg-(--card-bg) text-red-500 w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow hover:bg-red-500 hover:text-white z-20"
                aria-label="Delete photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-(--border-color) rounded-3xl flex flex-col items-center justify-center p-8 text-(--text-secondary) bg-(--input-bg)">
          <p className="text-sm font-bold italic">Gallery is empty</p>
        </div>
      )}
    </div>
  );
}
