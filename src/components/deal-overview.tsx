"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Building, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DealCard from "./deal-card"
import DealList from "./deal-list"
import FilterBar from "./filter-bar"
import { mockDeals } from "@/lib/mock-data"
import type { DealData, FilterOptions } from "@/lib/types"

export default function DealOverview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deals, setDeals] = useState<DealData[]>(mockDeals)
  const [filteredDeals, setFilteredDeals] = useState<DealData[]>(mockDeals)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState<string>("price-desc")
  const [searchQuery, setSearchQuery] = useState("")

  // Initialize filters from URL params or defaults
  const [filters, setFilters] = useState<FilterOptions>({
    propertyTypes: [],
    locations: [],
    priceRange: [0, 50000000],
    capRateRange: [0, 10],
    status: [],
  })

  // Handle deal selection
  const handleDealClick = (dealId: string) => {
    router.push(`/deals/${dealId}`)
  }

  // Apply filters and sorting
  useEffect(() => {
    let result = [...mockDeals]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (deal) =>
          deal.propertyName.toLowerCase().includes(query) ||
          deal.address.city.toLowerCase().includes(query) ||
          deal.address.state.toLowerCase().includes(query),
      )
    }

    // Apply property type filter
    if (filters.propertyTypes.length > 0) {
      result = result.filter((deal) => filters.propertyTypes.includes(deal.propertyType))
    }

    // Apply location filter
    if (filters.locations.length > 0) {
      result = result.filter((deal) => filters.locations.includes(deal.address.state))
    }

    // Apply price range filter
    result = result.filter(
      (deal) =>
        deal.financials.askingPrice >= filters.priceRange[0] && deal.financials.askingPrice <= filters.priceRange[1],
    )

    // Apply cap rate filter
    result = result.filter(
      (deal) =>
        deal.financials.capRate >= filters.capRateRange[0] && deal.financials.capRate <= filters.capRateRange[1],
    )

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter((deal) => filters.status.includes(deal.status))
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.financials.askingPrice - b.financials.askingPrice)
        break
      case "price-desc":
        result.sort((a, b) => b.financials.askingPrice - a.financials.askingPrice)
        break
      case "cap-rate-asc":
        result.sort((a, b) => a.financials.capRate - b.financials.capRate)
        break
      case "cap-rate-desc":
        result.sort((a, b) => b.financials.capRate - a.financials.capRate)
        break
      case "date-asc":
        result.sort((a, b) => new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime())
        break
      case "date-desc":
        result.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime())
        break
      default:
        break
    }

    setFilteredDeals(result)
  }, [filters, sortOption, searchQuery])

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      propertyTypes: [],
      locations: [],
      priceRange: [0, 50000000],
      capRateRange: [0, 10],
      status: [],
    })
    setSearchQuery("")
    setSortOption("price-desc")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Real Estate Deals</h1>
          <p className="text-muted-foreground mt-1">Browse {filteredDeals.length} available investment opportunities</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="cap-rate-desc">Cap Rate (High to Low)</SelectItem>
              <SelectItem value="cap-rate-asc">Cap Rate (Low to High)</SelectItem>
              <SelectItem value="date-desc">Recently Added</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4">
            <Input
              placeholder="Search by property name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {filteredDeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No deals found</h3>
              <p className="text-muted-foreground text-center mt-2">Try adjusting your filters or search criteria</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <Tabs value={viewMode} className="w-full">
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDeals.map((deal) => (
                    <div key={deal.id} onClick={() => handleDealClick(deal.id)} className="cursor-pointer">
                      <DealCard deal={deal} isCompact={true} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <div className="space-y-4">
                  {filteredDeals.map((deal) => (
                    <div key={deal.id} onClick={() => handleDealClick(deal.id)} className="cursor-pointer">
                      <DealList deal={deal} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
