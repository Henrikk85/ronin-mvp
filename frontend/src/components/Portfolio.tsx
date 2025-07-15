import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react'

interface PortfolioHolding {
  symbol: string
  name: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  value: number
}

export default function Portfolio() {
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-holdings')
    if (saved) {
      try {
        const holdings = JSON.parse(saved)
        setPortfolioHoldings(holdings)
      } catch (error) {
        console.error('Error loading portfolio from localStorage:', error)
      }
    }
  }, [])

  const handleRemoveHolding = (symbol: string) => {
    const updatedHoldings = portfolioHoldings.filter(holding => holding.symbol !== symbol)
    setPortfolioHoldings(updatedHoldings)
    localStorage.setItem('portfolio-holdings', JSON.stringify(updatedHoldings))
    
    const addedStocks = JSON.parse(localStorage.getItem('added-stocks') || '[]')
    const updatedAddedStocks = addedStocks.filter((stock: string) => stock !== symbol)
    localStorage.setItem('added-stocks', JSON.stringify(updatedAddedStocks))
  }

  const totalValue = portfolioHoldings.reduce((sum, holding) => sum + holding.value, 0)
  const totalGainLoss = portfolioHoldings.reduce((sum, holding) => {
    const gainLoss = (holding.currentPrice - holding.purchasePrice) * holding.quantity
    return sum + gainLoss
  }, 0)

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfolio</h1>
        <p className="text-gray-600">Manage your investment holdings</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Gain/Loss</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{portfolioHoldings.length}</div>
              <div className="text-sm text-gray-600">Holdings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {portfolioHoldings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No holdings in your portfolio yet.</p>
            <p className="text-gray-400 mt-2">Add stocks from the Dashboard to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioHoldings.map(holding => {
            const gainLoss = holding.currentPrice - holding.purchasePrice
            const gainLossPercent = (gainLoss / holding.purchasePrice) * 100
            const isPositive = gainLoss >= 0
            
            return (
              <Card key={holding.symbol} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{holding.symbol}</CardTitle>
                      <CardDescription className="text-sm">{holding.name}</CardDescription>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {holding.symbol}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove {holding.symbol} from your portfolio. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleRemoveHolding(holding.symbol)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <span className="font-medium">{holding.quantity} shares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Price:</span>
                      <span className="font-medium">${holding.currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Purchase Price:</span>
                      <span className="font-medium">${holding.purchasePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-gray-600">Total Value:</span>
                      <span className="font-bold text-lg">${holding.value.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Gain/Loss:</span>
                      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        <span className="font-medium">
                          {isPositive ? '+' : ''}${(gainLoss * holding.quantity).toFixed(2)} ({gainLossPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
