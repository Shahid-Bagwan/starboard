import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import type { DealData } from "@/lib/types"

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function DealList({ deal }: { deal: DealData }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto">
          <Image src={deal.images.main || "/placeholder.svg"} alt={deal.propertyName} fill className="object-cover" />
          <div className="absolute top-2 left-2">
            <Badge className="bg-white text-black hover:bg-gray-100">{deal.propertyType}</Badge>
          </div>
          {deal.status === "under-contract" && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Under Contract</Badge>
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg">{deal.propertyName}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {deal.address.city}, {deal.address.state}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{formatCurrency(deal.financials.askingPrice)}</div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(Math.round(deal.financials.askingPrice / deal.property.size))} per SF
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <div className="text-xs text-muted-foreground">Property Size</div>
              <div className="font-medium">{deal.property.size.toLocaleString()} SF</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Cap Rate</div>
              <div className="font-medium">{deal.financials.capRate}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">NOI</div>
              <div className="font-medium">{formatCurrency(deal.financials.noi)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Tenant</div>
              <div className="font-medium">{deal.tenant.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
