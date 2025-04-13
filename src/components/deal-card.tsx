"use client"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

export default function DealCard({ deal, isCompact = false }: { deal: DealData; isCompact?: boolean }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
      <div className="relative">
        <Image
          src={deal.images.main || "https://picsum.photos/200/300"}
          alt={deal.propertyName}
          width={400}
          height={300}
          className={`w-full ${isCompact ? "h-48" : "h-64"} object-cover`}
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className="bg-white text-black hover:bg-gray-100">{deal.propertyType}</Badge>
          {deal.status === "under-contract" && (
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Under Contract</Badge>
          )}
        </div>
      </div>
      <CardContent className={`${isCompact ? "p-4" : "p-6"}`}>
        <h3 className={`font-semibold ${isCompact ? "text-base" : "text-lg"}`}>{deal.propertyName}</h3>
        <div className="flex items-center text-muted-foreground text-sm mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          {deal.address.city}, {deal.address.state}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className={`font-bold ${isCompact ? "text-lg" : "text-xl"}`}>
            {formatCurrency(deal.financials.askingPrice)}
          </div>
          <Badge variant="outline">{deal.financials.capRate}% Cap</Badge>
        </div>

        {!isCompact && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-xs text-muted-foreground">Property Size</div>
              <div className="font-medium">{deal.property.size.toLocaleString()} SF</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">NOI</div>
              <div className="font-medium">{formatCurrency(deal.financials.noi)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
