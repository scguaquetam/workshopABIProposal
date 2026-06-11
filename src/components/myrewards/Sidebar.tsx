import type { ReactNode } from 'react'

import { RootstockLogo } from '../shared'

/* Static replica of the dApp left navigation — presentational only. */

const NavIcon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ICONS = {
  holdings: 'M4 7h16M4 7v10a1 1 0 001 1h14a1 1 0 001-1V7M4 7l2-3h12l2 3M9 12h6',
  rewards: 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z',
  backing: 'M7 11l5-5 5 5M7 17l5-5 5 5',
  delegation: 'M16 11a4 4 0 10-8 0M3 21a7 7 0 0118 0M12 3v4',
  treasury: 'M3 10h18M5 10v9h14v-9M12 3l9 7H3l9-7M9 14h6',
  proposals: 'M8 6h10M8 10h10M8 14h6M5 6h.01M5 10h.01M5 14h.01M4 3h16v18H4z',
  communities: 'M8 14a3 3 0 100-6 3 3 0 000 6zM16 14a3 3 0 100-6 3 3 0 000 6zM2 20a6 6 0 0112 0M10 20a6 6 0 0112 0',
  collectiveRewards: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3',
  builders: 'M14 6l4 4-10 10H4v-4L14 6zM12 8l4 4',
  usd: 'M12 3v18M8 7c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5-1.5 2.3-4 2.8-4 1.2-4 2.9c0 1.6 1.8 2.8 4 2.8s4-1 4-2.5',
  btc: 'M9 4v16M9 4h4.5a3 3 0 010 6H9m0 0h5.5a3 3 0 010 6H9M11 2v2M11 20v2',
}

const NavItem = ({
  icon,
  label,
  active,
}: {
  icon: keyof typeof ICONS
  label: string
  active?: boolean
}) => (
  <div
    className={
      'flex items-center gap-3 px-3 py-2 rounded-sm text-sm cursor-pointer relative ' +
      (active ? 'bg-bg-60 text-text-100' : 'text-text-60 hover:text-text-100')
    }
  >
    {active && <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm" />}
    <NavIcon d={ICONS[icon]} />
    {label}
  </div>
)

const NavGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-semibold text-text-100 px-3 mb-1">{title}</span>
    {children}
  </div>
)

export const Sidebar = () => (
  <aside className="hidden lg:flex flex-col w-60 shrink-0 px-4 py-8 gap-8 border-r border-bg-80 min-h-full">
    <RootstockLogo className="w-8 h-8 text-text-100 ml-3" />
    <NavGroup title="My Collective">
      <NavItem icon="holdings" label="Holdings" />
      <NavItem icon="rewards" label="Rewards" active />
      <NavItem icon="backing" label="Backing" />
      <NavItem icon="delegation" label="Delegation" />
    </NavGroup>
    <NavGroup title="The Collective">
      <NavItem icon="treasury" label="Treasury" />
      <NavItem icon="proposals" label="Proposals" />
      <NavItem icon="communities" label="Communities" />
      <NavItem icon="collectiveRewards" label="Collective Rewards" />
      <NavItem icon="builders" label="Builders" />
    </NavGroup>
    <NavGroup title="BETA TOOLS">
      <NavItem icon="usd" label="USD Vault Sandbox" />
      <NavItem icon="btc" label="BTC Vault Sandbox" />
    </NavGroup>
    <div className="mt-auto flex items-center justify-between px-3 text-sm text-text-60 cursor-pointer">
      Useful links
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </aside>
)
