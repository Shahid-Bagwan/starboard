import Image from "next/image"
import Link from "next/link"
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

export default function RelatedDeals({ deals }: { deals: DealData[] }) {
  if (deals.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No related deals found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <Link key={deal.id} href={`/deals/${deal.id}`}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
            <div className="relative h-48">
              <Image
                src={deal.images.main || "/placeholder.svg"}
                alt={deal.propertyName}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge className="bg-white text-black hover:bg-gray-100">{deal.propertyType}</Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{deal.propertyName}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1 mb-2">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {deal.address.city}, {deal.address.state}
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="font-bold">{formatCurrency(deal.financials.askingPrice)}</div>
                <div className="text-sm">{deal.financials.capRate}% Cap</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
