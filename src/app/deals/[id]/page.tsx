"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Building, Calendar, DollarSign, Download, FileText, MapPin } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { mockDeals } from "@/lib/mock-data"
import type { DealData } from "@/lib/types"
import RelatedDeals from "@/components/related-deals"

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function DealDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [deal, setDeal] = useState<DealData | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedDeals, setRelatedDeals] = useState<DealData[]>([])

  useEffect(() => {
    // In a real app, this would be an API call
    const dealId = params.id as string
    const foundDeal = mockDeals.find((d) => d.id === dealId)

    if (foundDeal) {
      setDeal(foundDeal)

      // Find related deals (same property type or location)
      const related = mockDeals
        .filter(
          (d) =>
            d.id !== dealId &&
            (d.propertyType === foundDeal.propertyType || d.address.state === foundDeal.address.state),
        )
        .slice(0, 3)

      setRelatedDeals(related)
    }

    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deals
        </Button>
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg">
          <Building className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold">Deal Not Found</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            The deal you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/")}>View All Deals</Button>
        </div>
      </div>
    )
  }

  // Calculate years remaining on lease
  const leaseExpirationDate = new Date(deal.tenant.leaseExpirationDate)
  const currentDate = new Date()
  const yearsRemaining = (
    (leaseExpirationDate.getTime() - currentDate.getTime()) /
    (1000 * 60 * 60 * 24 * 365.25)
  ).toFixed(1)

  // Calculate if rent is below market
  const rentDifference = (
    ((deal.financials.marketRentPerSqFt - deal.financials.rentPerSqFt) / deal.financials.marketRentPerSqFt) *
    100
  ).toFixed(1)
  const isBelowMarket = deal.financials.rentPerSqFt < deal.financials.marketRentPerSqFt

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deals
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src={deal.images.main || "/placeholder.svg"}
              alt={deal.propertyName}
              width={800}
              height={500}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-white text-black hover:bg-gray-100">{deal.propertyType}</Badge>
              {deal.status === "under-contract" && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Under Contract</Badge>
              )}
              {deal.financing.assumable && (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Assumable Financing</Badge>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold">{deal.propertyName}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {deal.address.street}, {deal.address.city}, {deal.address.state} {deal.address.zip}
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="tenant">Tenant</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Building className="h-4 w-4 mr-1" />
                    Property Size
                  </div>
                  <div className="text-xl font-semibold">{deal.property.size.toLocaleString()} SF</div>
                </div>

                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Cap Rate
                  </div>
                  <div className="text-xl font-semibold">{deal.financials.capRate}%</div>
                </div>

                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Year Built
                  </div>
                  <div className="text-xl font-semibold">{deal.property.yearBuilt}</div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Key Highlights</div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-emerald-100 text-emerald-800 rounded-full p-1 mr-2 mt-0.5">
                      <DollarSign className="h-3 w-3" />
                    </span>
                    <span>Strong tenant with {yearsRemaining} years remaining on lease</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-emerald-100 text-emerald-800 rounded-full p-1 mr-2 mt-0.5">
                      <DollarSign className="h-3 w-3" />
                    </span>
                    <span>
                      {isBelowMarket
                        ? `Current rent is ${rentDifference}% below market rate, providing upside potential`
                        : `Current rent is above market rate, providing stable income`}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-emerald-100 text-emerald-800 rounded-full p-1 mr-2 mt-0.5">
                      <DollarSign className="h-3 w-3" />
                    </span>
                    <span>Assumable financing at favorable {deal.financing.interestRate}% interest rate</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">Property Description</div>
                <p className="text-sm text-muted-foreground">
                  {deal.description ||
                    "This premium commercial property offers an exceptional investment opportunity in a prime location. The building features modern amenities, excellent visibility, and easy access to major transportation routes. Currently occupied by a high-quality tenant with a strong credit rating, this property provides stable cash flow and potential for appreciation."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="financials" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Asking Price</div>
                    <div className="text-xl font-semibold">{formatCurrency(deal.financials.askingPrice)}</div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Net Operating Income (NOI)</div>
                    <div className="text-xl font-semibold">{formatCurrency(deal.financials.noi)}</div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Cap Rate</div>
                    <div className="text-xl font-semibold">{deal.financials.capRate}%</div>
                    <div className="mt-2 text-xs">
                      <div className="flex justify-between mb-1">
                        <span>Market Average: 5.8%</span>
                        <span>7.0%</span>
                      </div>
                      <Progress value={((deal.financials.capRate - 5.8) / (7.0 - 5.8)) * 100} className="h-1.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Rent per Square Foot</div>
                    <div className="text-xl font-semibold">${deal.financials.rentPerSqFt.toFixed(2)}</div>
                    <div className="mt-2 text-xs">
                      <div className="flex justify-between mb-1">
                        <span>vs Market: ${deal.financials.marketRentPerSqFt.toFixed(2)}</span>
                        <span className={isBelowMarket ? "text-emerald-600" : "text-amber-600"}>
                          {isBelowMarket ? `${rentDifference}% Below` : `${Math.abs(Number(rentDifference))}% Above`}
                        </span>
                      </div>
                      <Progress
                        value={(deal.financials.rentPerSqFt / deal.financials.marketRentPerSqFt) * 100}
                        className="h-1.5"
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Financing</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Loan Amount:</span>
                        <span className="font-medium">{formatCurrency(deal.financing.loanAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Interest Rate:</span>
                        <span className="font-medium">{deal.financing.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Loan to Value:</span>
                        <span className="font-medium">{deal.financing.loanToValue}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Maturity:</span>
                        <span className="font-medium">{formatDate(deal.financing.loanMaturity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tenant" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-semibold">{deal.tenant.name}</div>
                    <div className="text-sm text-muted-foreground">Primary Tenant</div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">{deal.tenant.creditRating} Credit</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Lease Expiration</div>
                  <div className="text-lg font-semibold">{formatDate(deal.tenant.leaseExpirationDate)}</div>
                  <div className="text-sm">{yearsRemaining} years remaining</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Lease Term</div>
                  <div className="text-lg font-semibold">{deal.financials.leaseTerm} Years</div>
                  <div className="text-sm">NNN Lease</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Occupancy</div>
                  <div className="text-lg font-semibold">{deal.property.occupancyRate}%</div>
                  <div className="text-sm">Single Tenant</div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">Lease Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Rent Escalations:</span>
                    <span>2.5% Annual Increases</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Renewal Options:</span>
                    <span>Two 5-year options</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tenant Improvements:</span>
                    <span>$10/SF Allowance</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Map"
                  alt="Property location map"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Demographics</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Population (3mi):</span>
                      <span>125,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Median Income:</span>
                      <span>$85,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Median Age:</span>
                      <span>36</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Market Insights</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Vacancy Rate:</span>
                      <span>4.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Lease Term:</span>
                      <span>7.5 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>YoY Rent Growth:</span>
                      <span className="text-emerald-600">+3.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <div className="text-2xl font-bold mb-2">{formatCurrency(deal.financials.askingPrice)}</div>
            <div className="text-sm text-muted-foreground mb-6">
              {formatCurrency(Math.round(deal.financials.askingPrice / deal.property.size))} per SF
            </div>

            <div className="space-y-4">
              <Button className="w-full">Contact Broker</Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Download Offering Memo
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />
                Export Deal Summary
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Listed By</div>
                <div className="font-medium">Commercial Property Advisors</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Broker</div>
                <div className="font-medium">Michael Johnson</div>
                <div className="text-sm">michael@cpadvisors.com</div>
                <div className="text-sm">(555) 123-4567</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Listed On</div>
                <div className="font-medium">{formatDate(deal.listedDate)}</div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Business Details</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Business Type</div>
                <div className="font-medium">Corporate Office</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Industry</div>
                <div className="font-medium">Technology</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Employees</div>
                <div className="font-medium">120</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Annual Revenue</div>
                <div className="font-medium">$25M - $50M</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Years in Business</div>
                <div className="font-medium">15</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Business Opportunities</h2>
        <RelatedDeals deals={relatedDeals} />
      </div>
    </div>
  )
}
