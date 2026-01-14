export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white/80 animate-spin"></div>
      </div>
    </div>
  )
}
