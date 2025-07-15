# Investment Dashboard

A React + Tailwind CSS investment dashboard with live market data, AI-powered stock suggestions, and portfolio management features.

## 🚀 Live Demo

**Deployed Application**: https://market-dashboard-app-2w5j5jl9.devinapps.com

## ✨ Features

- **📊 Live Market Data**: Real-time S&P 500, NASDAQ, and Dow Jones data via Finnhub API
- **🥧 Portfolio Visualization**: Interactive pie chart showing asset allocation
- **🤖 AI Stock Suggestions**: Machine learning-powered investment recommendations
- **⚖️ Portfolio Rebalancing**: Smart rebalancing suggestions with approve/skip functionality
- **💬 AI Investment Assistant**: OpenAI-powered chat widget for investment Q&A
- **📱 Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **FastAPI** with Python
- **Poetry** for dependency management
- **CORS** enabled for frontend integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Python 3.12+
- Poetry (for backend)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
poetry install
poetry run fastapi dev app/main.py
```

The backend will be available at `http://localhost:8000`

## 🔑 API Configuration

### Required API Keys

1. **Finnhub API** (for live market data)
   - Sign up at [finnhub.io](https://finnhub.io)
   - Get your free API key

2. **OpenAI API** (for AI chat assistant)
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Get your API key

### Environment Setup

Create a `.env` file in the `frontend` directory:

```env
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: The app works with demo data when API keys are not configured.

## 📦 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend Deployment
The FastAPI backend is configured for deployment on Fly.io with Poetry.

## 🎯 Core Components

### Market Data Cards
- Real-time price updates
- Change indicators with trend arrows
- Color-coded positive/negative changes

### Portfolio Allocation Chart
- Interactive donut chart
- Color-coded asset categories
- Percentage breakdowns

### AI Stock Suggestions
- Confidence level badges
- Target price predictions
- Detailed reasoning for each recommendation

### Rebalancing Interface
- Current vs. suggested allocation comparison
- One-click approve/skip functionality
- Smart reasoning explanations

### Investment Chat Assistant
- Natural language Q&A
- Investment advice and education
- Real-time responses

## 🔧 Development

### Project Structure
```
investment-dashboard/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── App.tsx         # Main application
│   │   └── App.css         # Global styles
│   ├── dist/          # Build output
│   └── package.json
├── backend/           # FastAPI application
│   ├── app/
│   │   └── main.py    # FastAPI server
│   └── pyproject.toml
└── README.md
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `poetry run fastapi dev app/main.py` - Start development server
- `poetry add <package>` - Add new dependency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with assistance from [Devin AI](https://app.devin.ai/sessions/7b9d526cdb85444e8ac964074a3572f9)
- Created for [@Henrikk85](https://github.com/Henrikk85)
- Market data provided by [Finnhub](https://finnhub.io)
- AI capabilities powered by [OpenAI](https://openai.com)

---

**Live Demo**: https://market-dashboard-app-2w5j5jl9.devinapps.com
