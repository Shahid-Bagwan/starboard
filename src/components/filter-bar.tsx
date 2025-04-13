"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { FilterOptions } from "@/lib/types"
import { X } from "lucide-react"

// Property types for filtering
const propertyTypeOptions = [
  { id: "office", label: "Office" },
  { id: "retail", label: "Retail" },
  { id: "industrial", label: "Industrial" },
  { id: "multifamily", label: "Multifamily" },
  { id: "hospitality", label: "Hospitality" },
  { id: "mixed-use", label: "Mixed-Use" },
]

// Locations for filtering
const locationOptions = [
  { id: "TX", label: "Texas" },
  { id: "CA", label: "California" },
  { id: "NY", label: "New York" },
  { id: "FL", label: "Florida" },
  { id: "IL", label: "Illinois" },
  { id: "GA", label: "Georgia" },
]

// Deal status options
const statusOptions = [
  { id: "active", label: "Active" },
  { id: "under-contract", label: "Under Contract" },
  { id: "closing", label: "Closing" },
  { id: "off-market", label: "Off Market" },
]

interface FilterBarProps {
  filters: FilterOptions
  onFilterChange: (filters: Partial<FilterOptions>) => void
  onReset: () => void
}

export default function FilterBar({ filters, onFilterChange, onReset }: FilterBarProps) {
  // Format currency for display
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  // Count active filters
  const activeFilterCount =
    filters.propertyTypes.length +
    filters.locations.length +
    filters.status.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000000 ? 1 : 0) +
    (filters.capRateRange[0] > 0 || filters.capRateRange[1] < 10 ? 1 : 0)

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Filters</h2>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs">
            Reset All
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.propertyTypes.map((type) => (
            <Badge key={type} variant="secondary" className="flex items-center gap-1">
              {propertyTypeOptions.find((opt) => opt.id === type)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFilterChange({
                    propertyTypes: filters.propertyTypes.filter((t) => t !== type),
                  })
                }
              />
            </Badge>
          ))}
          {filters.locations.map((location) => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1">
              {locationOptions.find((opt) => opt.id === location)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFilterChange({
                    locations: filters.locations.filter((l) => l !== location),
                  })
                }
              />
            </Badge>
          ))}
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              {statusOptions.find((opt) => opt.id === status)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFilterChange({
                    status: filters.status.filter((s) => s !== status),
                  })
                }
              />
            </Badge>
          ))}
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 50000000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFilterChange({
                    priceRange: [0, 50000000],
                  })
                }
              />
            </Badge>
          )}
          {(filters.capRateRange[0] > 0 || filters.capRateRange[1] < 10) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.capRateRange[0]}% - {filters.capRateRange[1]}%
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFilterChange({
                    capRateRange: [0, 10],
                  })
                }
              />
            </Badge>
          )}
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={["property-type", "location", "price", "cap-rate", "status"]}
        className="w-full"
      >
        <AccordionItem value="property-type">
          <AccordionTrigger>Property Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {propertyTypeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`property-type-${option.id}`}
                    checked={filters.propertyTypes.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onFilterChange({
                          propertyTypes: [...filters.propertyTypes, option.id],
                        })
                      } else {
                        onFilterChange({
                          propertyTypes: filters.propertyTypes.filter((type) => type !== option.id),
                        })
                      }
                    }}
                  />
                  <label
                    htmlFor={`property-type-${option.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {locationOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${option.id}`}
                    checked={filters.locations.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onFilterChange({
                          locations: [...filters.locations, option.id],
                        })
                      } else {
                        onFilterChange({
                          locations: filters.locations.filter((loc) => loc !== option.id),
                        })
                      }
                    }}
                  />
                  <label
                    htmlFor={`location-${option.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2">
              <Slider
                defaultValue={[0, 50000000]}
                value={filters.priceRange}
                min={0}
                max={50000000}
                step={1000000}
                onValueChange={(value) => onFilterChange({ priceRange: value })}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatCurrency(filters.priceRange[0])}</span>
                <span className="text-sm">{formatCurrency(filters.priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cap-rate">
          <AccordionTrigger>Cap Rate</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2">
              <Slider
                defaultValue={[0, 10]}
                value={filters.capRateRange}
                min={0}
                max={10}
                step={0.1}
                onValueChange={(value) => onFilterChange({ capRateRange: value })}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{filters.capRateRange[0]}%</span>
                <span className="text-sm">{filters.capRateRange[1]}%</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="status">
          <AccordionTrigger>Deal Status</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.id}`}
                    checked={filters.status.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onFilterChange({
                          status: [...filters.status, option.id],
                        })
                      } else {
                        onFilterChange({
                          status: filters.status.filter((s) => s !== option.id),
                        })
                      }
                    }}
                  />
                  <label
                    htmlFor={`status-${option.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
