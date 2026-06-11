import clsx from 'clsx'
import { useState } from 'react'

import { BoardDashboard } from './components/BoardDashboard'
import { MyRewardsReplica } from './components/myrewards/MyRewardsReplica'
import { RootstockLogo } from './components/shared'

const TABS = ['Spend Dashboard', 'My Rewards'] as const
type Tab = (typeof TABS)[number]

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Spend Dashboard')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-bg-100/95 backdrop-blur border-b border-bg-60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          <RootstockLogo className="w-7 h-7 text-primary" />
          <span className="font-sora text-sm font-semibold">
            Rootstock Collective{' '}
            <span className="text-text-40 font-normal">/ Tiered Rewards Sandbox</span>
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-widest text-warning border border-warning/40 rounded-full px-3 py-1">
            Mock · Internal discussion
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-10 w-full">
        {/* Tab switcher ported from dao-frontend SolidTabs */}
        <div className="flex flex-row items-center">
          <hr className="hidden sm:block w-full bg-bg-60 border-none h-px mr-2" />
          <div className="inline-flex rounded-md p-0.5 bg-bg-80">
            {TABS.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'px-4 py-1 rounded-[3px] transition-all duration-200 min-w-[140px] h-[36px] text-sm whitespace-nowrap cursor-pointer',
                  activeTab === tab ? 'bg-bg-60 text-text-100' : 'text-text-60 hover:bg-bg-60/50',
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <hr className="hidden sm:block w-full bg-bg-60 border-none h-px ml-2" />
        </div>
      </div>

      <main className="flex-1 w-full">
        {activeTab === 'Spend Dashboard' ? (
          <div className="max-w-6xl mx-auto px-6 py-10 w-full">
            <BoardDashboard />
          </div>
        ) : (
          <MyRewardsReplica />
        )}
      </main>

      <footer className="border-t border-bg-60 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-2 text-xs text-text-40">
          <RootstockLogo className="w-4 h-4" />
          Rootstock Collective · Internal sandbox · Mock data everywhere · Rates 28/17/8 · Tiers
          0-60 / 61-180 / 181+
        </div>
      </footer>
    </div>
  )
}

export default App
