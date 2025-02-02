import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function InstallButton() {
  return (
    <Button variant="outline" className="fixed top-4 left-4 gap-2">
      <Download className="w-4 h-4" />
      تثبيت
    </Button>
  )
}

