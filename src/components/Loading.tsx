export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#d48e66]/20 border-t-[#d48e66] rounded-full animate-spin" />
        <p className="text-sm text-[#8a7a6e]">Loading...</p>
      </div>
    </div>
  );
}
