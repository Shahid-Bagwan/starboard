export interface DealData {
  id: string
  propertyName: string
  propertyType: string
  status: string
  listedDate: string
  description?: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  tenant: {
    name: string
    creditRating: string
    leaseExpirationDate: string
  }
  financials: {
    rentPerSqFt: number
    marketRentPerSqFt: number
    leaseTerm: number
    capRate: number
    noi: number
    askingPrice: number
  }
  property: {
    size: number
    yearBuilt: number
    occupancyRate: number
  }
  financing: {
    assumable: boolean
    loanAmount: number
    interestRate: number
    loanMaturity: string
    loanToValue: number
  }
  images: {
    main: string
    additional: string[]
  }
  offeringMemorandum: string
}

export interface FilterOptions {
  propertyTypes: string[]
  locations: string[]
  priceRange: [number, number]
  capRateRange: [number, number]
  status: string[]
}
