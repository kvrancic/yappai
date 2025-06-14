import TranscriptAnalysis from "../../transcript-analysis"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function TranscriptPage() {
  return (
    <SidebarProvider>
      <TranscriptAnalysis />
    </SidebarProvider>
  )
}
