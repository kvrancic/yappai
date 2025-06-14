import Dashboard from "../dashboard-otp"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <Dashboard />
    </SidebarProvider>
  )
}
