export default function StepProgress({ current, total }) {
  const percent = (current / total) * 100;

  return (
    <div className="flex items-center justify-between">
      <div className="text-xs md:text-sm text-gray-700">
        Step <span>{current}</span> of <span>{total}</span>
      </div>
      <div className="w-32 md:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-pink-400" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
