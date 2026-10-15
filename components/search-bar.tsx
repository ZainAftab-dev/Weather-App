"use client"

import type React from "react"
import { useState } from "react"
import { History, Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (city: string) => void
  recent: string[]
}

export default function SearchBar({ onSearch, recent }: SearchBarProps) {
  const [value, setValue] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSearch(value)
      setValue("")
    }
  }

  return (
    <div className="my-6 md:my-8">
      <form onSubmit={submit} role="search" className="flex max-w-2xl gap-2">
        <label htmlFor="city" className="sr-only">
          City
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" aria-hidden />
          <input
            id="city"
            type="text"
            autoComplete="off"
            placeholder="Search a city, e.g. Lahore"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-12 w-full rounded-full border border-white/40 bg-white/95 pl-12 pr-4 text-base text-slate-900 shadow-lg shadow-slate-900/10 placeholder:text-slate-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
          />
        </div>
        <button
          type="submit"
          className="h-12 rounded-full bg-slate-900/85 px-5 ring-1 ring-white/20 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-7"
        >
          Search
        </button>
      </form>

      {recent.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <History className="size-4 text-white/75" aria-hidden />
          <span className="sr-only">Recent searches:</span>
          {recent.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onSearch(city)}
              className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium text-white/90 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
