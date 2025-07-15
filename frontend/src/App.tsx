import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, MessageCircle, Send, CheckCircle, X, DollarSign, BarChart3, PieChart as PieChartIcon, Plus } from 'lucide-react'
import './App.css'

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface StockSuggestion {
  symbol: string
  name: string
  reason: string
  targetPrice: number
  confidence: 'High' | 'Medium' | 'Low'
}

function App() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI investment assistant. Ask me anything about investing, market trends, or portfolio management.',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [rebalanceApproved, setRebalanceApproved] = useState<boolean | null>(null)
  const [addedStocks, setAddedStocks] = useState<Set<string>>(new Set())

  const portfolioData = [
    { name: 'Stocks', value: 60, color: '#3b82f6' },
    { name: 'Bonds', value: 25, color: '#10b981' },
    { name: 'Real Estate', value: 10, color: '#f59e0b' },
    { name: 'Cash', value: 5, color: '#6b7280' }
  ]

  const stockSuggestions: StockSuggestion[] = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      reason: 'Strong AI and data center growth potential with expanding market share',
      targetPrice: 950,
      confidence: 'High'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      reason: 'Solid cloud computing growth and AI integration across products',
      targetPrice: 420,
      confidence: 'High'
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc',
      reason: 'E-commerce recovery and AWS continued dominance in cloud services',
      targetPrice: 180,
      confidence: 'Medium'
    }
  ]

  const rebalanceSuggestion = {
    current: { stocks: 60, bonds: 25, realEstate: 10, cash: 5 },
    suggested: { stocks: 55, bonds: 30, realEstate: 10, cash: 5 },
    reason: 'Market volatility suggests increasing bond allocation for better risk management'
  }

  useEffect(() => {
    fetchMarketData()
  }, [])

  const fetchMarketData = async () => {
    try {
      const symbols = ['AAPL', 'MSFT', 'GOOGL']
      const names = ['Apple Inc', 'Microsoft Corp', 'Alphabet Inc']
      const apiKey = import.meta.env.VITE_FINNHUB_API_KEY

      if (!apiKey || apiKey === 'your_finnhub_api_key_here') {
        setMarketData([
          { symbol: '^GSPC', name: 'S&P 500', price: 4756.50, change: 23.45, changePercent: 0.49 },
          { symbol: '^IXIC', name: 'NASDAQ', price: 14845.73, change: -45.67, changePercent: -0.31 },
          { symbol: '^DJI', name: 'Dow Jones', price: 37863.80, change: 156.89, changePercent: 0.42 }
        ])
        setLoading(false)
        return
      }

      const promises = symbols.map(async (symbol, index) => {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
        const data = await response.json()
        return {
          symbol,
          name: names[index],
          price: data.c || 0,
          change: data.d || 0,
          changePercent: data.dp || 0
        }
      })

      const results = await Promise.all(promises)
      setMarketData(results)
    } catch (error) {
      console.error('Error fetching market data:', error)
      setMarketData([
        { symbol: '^GSPC', name: 'S&P 500', price: 4756.50, change: 23.45, changePercent: 0.49 },
        { symbol: '^IXIC', name: 'NASDAQ', price: 14845.73, change: -45.67, changePercent: -0.31 },
        { symbol: '^DJI', name: 'Dow Jones', price: 37863.80, change: 156.89, changePercent: 0.42 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY

      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: 'I\'m a demo AI assistant. To enable real responses, please add your OpenAI API key to the .env file. For now, I can tell you that diversification is key to a successful investment strategy!',
          isUser: false,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, aiResponse])
        setChatLoading(false)
        return
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful investment advisor. Provide concise, practical investment advice. Keep responses under 100 words.'
            },
            {
              role: 'user',
              content: chatInput
            }
          ],
          max_tokens: 150
        })
      })

      const data = await response.json()
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process your request.',
        isUser: false,
        timestamp: new Date()
      }

      setChatMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Error sending chat message:', error)
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorResponse])
    } finally {
      setChatLoading(false)
    }
  }

  const handleRebalanceAction = (approved: boolean) => {
    setRebalanceApproved(approved)
  }

  const handleAddToPortfolio = (symbol: string) => {
    setAddedStocks(prev => new Set([...prev, symbol]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  width="120"
                  height="32"
                  viewBox="0 0 120 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-auto"
                >
                  <rect x="2" y="6" width="20" height="20" rx="3" fill="#3b82f6" />
                  <rect x="6" y="10" width="12" height="12" rx="2" fill="white" />
                  <circle cx="12" cy="16" r="3" fill="#3b82f6" />
                  <text x="30" y="20" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#1f2937">
                    RONIN
                  </text>
                </svg>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Dashboard
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Portfolio
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  About Us
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </a>
              </div>
            </div>
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <header className="text-center py-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Investment Dashboard</h1>
          <p className="text-gray-600">Real-time market data and AI-powered investment insights</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            marketData.map((market) => (
              <Card key={market.symbol} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{market.name}</h3>
                    {market.change >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {market.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`flex items-center text-sm ${market.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="mr-1">
                      {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}
                    </span>
                    <span>
                      ({market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Portfolio Allocation
              </CardTitle>
              <CardDescription>Current asset distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {portfolioData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI Stock Suggestions
              </CardTitle>
              <CardDescription>AI-powered investment recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockSuggestions.map((stock) => (
                  <div key={stock.symbol} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{stock.symbol}</h4>
                        <p className="text-sm text-gray-600">{stock.name}</p>
                      </div>
                      <Badge variant={stock.confidence === 'High' ? 'default' : stock.confidence === 'Medium' ? 'secondary' : 'outline'}>
                        {stock.confidence}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{stock.reason}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Target: ${stock.targetPrice}</span>
                      </div>
                      {addedStocks.has(stock.symbol) ? (
                        <Button disabled variant="outline" size="sm" className="text-green-600 border-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Added
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleAddToPortfolio(stock.symbol)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Portfolio
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Rebalancing</CardTitle>
              <CardDescription>AI-suggested portfolio adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Suggested Changes:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Current</p>
                      <p>Stocks: {rebalanceSuggestion.current.stocks}%</p>
                      <p>Bonds: {rebalanceSuggestion.current.bonds}%</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Suggested</p>
                      <p>Stocks: {rebalanceSuggestion.suggested.stocks}%</p>
                      <p>Bonds: {rebalanceSuggestion.suggested.bonds}%</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{rebalanceSuggestion.reason}</p>
                </div>
                {rebalanceApproved === null ? (
                  <div className="flex gap-2">
                    <Button onClick={() => handleRebalanceAction(true)} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button onClick={() => handleRebalanceAction(false)} variant="outline" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Skip
                    </Button>
                  </div>
                ) : (
                  <div className={`p-3 rounded-lg ${rebalanceApproved ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-800'}`}>
                    {rebalanceApproved ? 'Rebalancing approved! Changes will be implemented.' : 'Rebalancing skipped. Current allocation maintained.'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                AI Investment Assistant
              </CardTitle>
              <CardDescription>Ask questions about investing and get AI-powered advice</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 mb-4 border rounded-lg p-3">
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about investing..."
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  disabled={chatLoading}
                />
                <Button onClick={sendChatMessage} disabled={chatLoading || !chatInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
