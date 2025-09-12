import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, TrendingUp, Wallet, Search } from "lucide-react"
import { SellCreditsDialog } from "@/components/marketplace/SellCreditsDialog"
import { useMarketplace } from "@/hooks/useMarketplace"

// Removed mock listings; using live data from Supabase via useMarketplace

function CertificationBadge({ certification }: { certification: string }) {
  return (
    <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
      {certification}
    </Badge>
  )
}

export function Marketplace() {
  const { listings, userProfile, loading, error, sellCredits, buyCredits } = useMarketplace()
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
          {userProfile && (
            <SellCreditsDialog creditBalance={userProfile.available_credits} onSell={sellCredits} loading={loading} />
          )}
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
                <p className="text-muted-foreground">{userProfile?.industry_name ?? '—'}</p>
              </div>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-4 w-28 ml-auto" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-foreground">{userProfile?.available_credits ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Carbon Credits</div>
                </>
              )}
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
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-2 w-1/3">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-sm text-muted-foreground">No open trade listings available</div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{listing.industry_name}</span>
                      <CertificationBadge certification={"VCS"} />
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Created</span>
                      <span>•</span>
                      <span>{new Date(listing.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Quantity</div>
                      <div className="font-medium text-foreground">{listing.no_of_credits} credits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Price</div>
                      <div className="font-medium text-foreground">₹{listing.current_market_price.toLocaleString()}</div>
                    </div>
                    <Button className="bg-primary hover:bg-primary-hover" onClick={() => buyCredits(listing)} disabled={loading}>
                      Buy Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}