"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch: (city: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onSearch(searchInput)
      setSearchInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2 max-w-2xl">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-6 py-3 text-lg rounded-lg border-2 border-white/30 bg-white/95 dark:bg-slate-800/95 backdrop-blur focus:border-primary focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <Button
          type="submit"
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
        >
          <Search size={20} />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </form>
  )
}
