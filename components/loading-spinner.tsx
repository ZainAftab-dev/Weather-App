export default function LoadingSpinner() {
  const block = "panel animate-pulse"
  return (
    <div className="grid gap-5" role="status" aria-label="Loading the weather">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className={`${block} h-80`} />
        <div className="grid grid-cols-2 gap-4">
          <div className={`${block} h-28`} />
          <div className={`${block} h-28`} />
          <div className={`${block} h-28`} />
          <div className={`${block} h-28`} />
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className={`${block} h-64`} />
        <div className={`${block} h-64`} />
      </div>
    </div>
  )
}
