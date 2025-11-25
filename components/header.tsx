import { Database } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <Database className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Product Store</h1>
      </div>
    </header>
  )
}
