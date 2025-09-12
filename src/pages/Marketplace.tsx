import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, TrendingUp, Wallet, Plus, Search } from "lucide-react"

interface Listing {
  id: string
  seller: string
  quantity: number
  price: number
  certification: string
  location: string
  vintage: string
  projectType: string
}

const marketplaceListings: Listing[] = [
  {
    id: "1",
    seller: "Green Energy Corp",
    quantity: 500,
    price: 2340,
    certification: "VCS",
    location: "Karnataka",
    vintage: "2024",
    projectType: "Solar Farm"
  },
  {
    id: "2", 
    seller: "EcoTech Industries",
    quantity: 250,
    price: 2380,
    certification: "Gold Standard",
    location: "Tamil Nadu",
    vintage: "2024", 
    projectType: "Wind Energy"
  },
  {
    id: "3",
    seller: "Renewable Solutions Ltd",
    quantity: 750,
    price: 2295,
    certification: "VCS",
    location: "Karnataka",
    vintage: "2023",
    projectType: "Biogas"
  }
]

function CertificationBadge({ certification }: { certification: string }) {
  return (
    <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
      {certification}
    </Badge>
  )
}

export function Marketplace() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Carbon Credit Marketplace</h1>
          <p className="text-muted-foreground">
            Buy and sell verified carbon credits on our secure blockchain platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Sell Credits
          </Button>
        </div>
      </div>

      {/* Wallet Balance */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Your Credit Balance</h3>
                <p className="text-muted-foreground">Available for trading</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">543</div>
              <div className="text-sm text-muted-foreground">Carbon Credits</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹2,340</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-sm text-success">+5.2%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,847</div>
            <p className="text-xs text-muted-foreground mt-1">Credits available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">234</div>
            <p className="text-xs text-muted-foreground mt-1">Credits traded</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Available Credits
          </CardTitle>
          <CardDescription>
            Verified carbon credits ready for purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketplaceListings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{listing.seller}</span>
                      <CertificationBadge certification={listing.certification} />
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{listing.projectType}</span>
                      <span>•</span>
                      <span>{listing.location}</span>
                      <span>•</span>
                      <span>Vintage {listing.vintage}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="font-medium text-foreground">{listing.quantity} credits</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="font-medium text-foreground">₹{listing.price.toLocaleString()}</div>
                  </div>
                  
                  <Button className="bg-primary hover:bg-primary-hover">
                    Buy Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}