import { Suspense } from "react"
import DealOverview from "@/components/deal-overview"

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DealOverview />
    </Suspense>
  )
}
