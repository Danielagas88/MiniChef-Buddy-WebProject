export default function Brand({ onClick }) {
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
      <div className="w-9 h-9 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-xl">
        🍳
      </div>
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-pink-700">
          MiniChef Buddy
        </h1>
        <p className="text-xs text-gray-500">
          Fun & safe cooking for kids with an AI buddy
        </p>
      </div>
    </div>
  );
}
