import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { ThemeProvider } from './components/ui/ThemeToggle'
import SplashScreen from './components/ui/SplashScreen'
import Onboarding from './components/ui/Onboarding'
import { useUserStore } from './store'
import './index.css'
import 'leaflet/dist/leaflet.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false },
  },
})

const hasSeenSplash = sessionStorage.getItem('faf-splash')
const hasSeenOnboarding = localStorage.getItem('faf-onboarding')

function Root() {
  // ✅ Rinnova token automaticamente all'avvio se necessario
  const { refreshIfNeeded } = useUserStore()
  useState(() => { refreshIfNeeded() })
  const [showSplash, setShowSplash] = useState(!hasSeenSplash)
  const [showOnboarding, setShowOnboarding] = useState(!hasSeenOnboarding && !!hasSeenSplash)

  const handleSplashDone = () => {
    sessionStorage.setItem('faf-splash', '1')
    setShowSplash(false)
    // Show onboarding only first time ever
    if (!hasSeenOnboarding) setShowOnboarding(true)
  }

  const handleOnboardingDone = () => {
    localStorage.setItem('faf-onboarding', '1')
    setShowOnboarding(false)
    window.history.replaceState({}, '', '/')
    // Force full reload to reset all state
    window.location.href = '/'
  }

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      {!showSplash && showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
      <App />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
