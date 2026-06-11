import clsx from 'clsx'
import { useState, type ReactNode } from 'react'

import {
  BUILDER_ROWS,
  DEFAULT_RIF_PRICE,
  ESTIMATED_TOKENS,
  MOCK_STAKER,
  TIERS,
  TOTAL_EARNED_USD,
  UNCLAIMED_TOKENS,
  fmtNum,
  fmtUsd2,
  type TokenAmount,
} from '../../data/sandbox'
import { BucketBadge } from '../shared'
import { Sidebar } from './Sidebar'

/* Faithful UI copy of the dApp's /my-rewards page (dao-frontend), data-free, plus the
   new tiered-bucket elements from the sandbox brief. */

/* ---------- dao-frontend primitive ports ---------- */

const Section = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx('flex flex-col w-full items-start gap-3 self-stretch py-8 md:py-10 px-4 md:px-6 bg-bg-80 rounded', className)}>
    {children}
  </div>
)

const InfoIcon = ({ info }: { info: string }) => (
  <span
    title={info}
    className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-text-40 text-text-40 text-[9px] leading-none cursor-help select-none"
  >
    ?
  </span>
)

const SecondaryOutlineButton = ({ children, className }: { children: ReactNode; className?: string }) => (
  <button
    type="button"
    className={clsx(
      'py-3 px-4 rounded-sm text-base font-bold bg-transparent text-text-100 border border-bg-0 hover:bg-bg-60/40 transition-colors cursor-pointer',
      className,
    )}
  >
    {children}
  </button>
)

const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={clsx(
      'relative w-10 h-5 rounded-full transition-colors cursor-pointer',
      checked ? 'bg-primary' : 'bg-bg-40',
    )}
  >
    <span
      className={clsx(
        'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
        checked ? 'left-5' : 'left-0.5',
      )}
    />
  </button>
)

const TOKEN_BAR_COLORS: Record<TokenAmount['symbol'], string> = {
  RIF: 'var(--color-rif-blue)',
  rBTC: 'var(--color-primary)',
  USDRIF: 'var(--color-rif-blue)',
}

/** Port of MetricBar: token-segmented bar (segment width ∝ fiat value). */
const MetricBar = ({ tokens }: { tokens: TokenAmount[] }) => {
  const total = tokens.reduce((sum, t) => sum + t.usd, 0)
  return (
    <div className="flex items-start gap-[0.1875rem] self-stretch h-1 w-full md:max-w-[180px]">
      {tokens.map(t => (
        <span
          key={t.symbol}
          title={`${t.symbol}: ${fmtUsd2(t.usd)}`}
          className="h-full rounded-full"
          style={{ flexBasis: `${(t.usd / total) * 100}%`, background: TOKEN_BAR_COLORS[t.symbol] }}
        />
      ))}
    </div>
  )
}

const UsdLabel = () => (
  <span className="text-xs font-normal text-text-60 border-b border-dotted border-text-40 ml-1">USD</span>
)

/** Port of RewardCard: small title with info icon, large value, optional extras. */
const RewardCard = ({
  title,
  info,
  children,
}: {
  title: string
  info: string
  children: ReactNode
}) => (
  <div className="flex flex-col gap-4 flex-1 min-w-0">
    <span className="flex items-center gap-1.5 text-sm text-bg-0">
      {title} <InfoIcon info={info} />
    </span>
    {children}
  </div>
)

/* ---------- page chrome ---------- */

const TopBar = () => (
  <div className="flex items-center gap-4 py-5">
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-text-60" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 4h16v16H4zM9 4v16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="text-sm">
      <span className="text-primary">Home</span>
      <span className="text-text-40"> / </span>
      <span className="text-text-100">Rewards</span>
    </span>
    <div className="ml-auto flex items-center gap-4">
      <SecondaryOutlineButton className="py-2 text-sm">Buy $RIF with Fiat</SecondaryOutlineButton>
      <span className="flex items-center gap-2 text-sm cursor-pointer">
        <span className="w-5 h-5 rounded-full bg-[conic-gradient(from_0deg,#f47a2a,#ff71e1,#4b5cf0,#f47a2a)]" />
        <span className="underline decoration-dotted underline-offset-4">{MOCK_STAKER.address}</span>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-text-60" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  </div>
)

const Banner = () => (
  <Section>
    <p className="text-text-80">
      Track and claim the rewards you earn from backing Collective Rewards Builders. Claim Rewards
      and restake for higher Rewards and voting power.
    </p>
    <p className="text-text-80">Learn more about the Collective Rewards in the Whitepaper</p>
    <a href="#" className="text-text-100 font-medium flex items-center gap-1 hover:text-primary">
      See the Whitepaper
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  </Section>
)

/* ---------- NEW: tiered bucket section (the sandbox addition) ---------- */

const BucketSection = () => {
  const s = MOCK_STAKER
  const ogTier = TIERS[2]
  const progressPct = (s.daysSinceFirstStake / s.nextTierDay) * 100

  return (
    <Section>
      <div className="flex w-full justify-between items-start flex-wrap gap-4">
        <h3 className="font-kk-topo text-xl uppercase">Your Bucket</h3>
        <span className="text-[10px] uppercase tracking-widest text-warning border border-warning/40 rounded-full px-2.5 py-1">
          New · Tiered ABI
        </span>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-8 mt-2">
        <div className="flex-1 flex flex-col gap-4">
          <BucketBadge tier={s.tier} className="self-start" />
          <div className="flex items-end gap-3">
            <span className="font-sora text-5xl font-light" style={{ color: s.tier.color }}>
              {s.tier.abiPct}%
            </span>
            <span className="text-sm text-text-40 pb-1.5 flex items-center gap-1.5">
              Current ABI <InfoIcon info="Your ABI depends on your bucket, which is set by the days since your first stake. It never resets — unstaking and coming back does not restart the clock." />
            </span>
          </div>
          <span className="text-sm text-text-40">
            First stake <span className="text-text-60">{s.firstStakeLabel} · day {s.daysSinceFirstStake}</span>
          </span>
          <div>
            <div className="h-1.5 w-full bg-bg-60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${progressPct}%`, background: s.tier.color }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-40 mt-2">
              <span>Day {s.daysSinceFirstStake} of {s.nextTierDay}</span>
              <span>
                {s.daysToNextTier} days → {ogTier.name} ({ogTier.abiPct}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex w-full rounded-sm overflow-hidden text-center text-sm font-sora">
            {TIERS.map((tier, i) => {
              const widths = ['w-[22%]', 'w-[40%]', 'w-[38%]']
              const isCurrent = tier.id === s.tier.id
              return (
                <div
                  key={tier.id}
                  className={clsx(widths[i], 'py-3 relative')}
                  style={{ background: tier.color, opacity: isCurrent ? 1 : 0.45 }}
                >
                  <span className="text-bg-100 font-semibold">{tier.abiPct}%</span>
                  <span className="block text-[10px] text-bg-100/80">{tier.window.toLowerCase()}</span>
                  {isCurrent && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-text-100" />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-text-40">
            <span>First stake</span>
            <span>Day 60</span>
            <span>Day 180+</span>
          </div>
          <p className="text-sm text-text-60 leading-relaxed">
            <span className="text-text-100 font-medium">When you become {ogTier.name} (day 181+): </span>
            baseline ABI of {ogTier.abiPct}%, permanent OG badge, governance booster and early
            access to campaigns.
          </p>
        </div>
      </div>
    </Section>
  )
}

/* ---------- BACKER REWARDS section ---------- */

const BackerRewardsSection = () => {
  const [detailedView, setDetailedView] = useState(false)
  const unclaimedTotal = UNCLAIMED_TOKENS.reduce((s, t) => s + t.usd, 0)
  const estimatedTotal = ESTIMATED_TOKENS.reduce((s, t) => s + t.usd, 0)

  return (
    <Section>
      <div className="flex w-full justify-between items-center">
        <h3 className="font-kk-topo text-xl uppercase">Backer Rewards</h3>
        <div className="items-center gap-3 hidden md:flex">
          <Switch checked={detailedView} onChange={() => setDetailedView(!detailedView)} />
          <span className="text-sm text-text-60">Detailed View</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-2 self-stretch mt-6">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <RewardCard title="Unclaimed" info="Your rewards available to claim">
            <span className="font-kk-topo text-xl">
              {fmtUsd2(unclaimedTotal).slice(1)} <UsdLabel />
            </span>
            <MetricBar tokens={UNCLAIMED_TOKENS} />
            <div>
              <SecondaryOutlineButton>Claim Rewards</SecondaryOutlineButton>
            </div>
          </RewardCard>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row md:items-start gap-6 sm:gap-10">
            <RewardCard
              title="Estimated this cycle"
              info="Estimation of the rewards you will receive this cycle"
            >
              <span className="font-kk-topo text-xl">
                {fmtUsd2(estimatedTotal).slice(1)} <UsdLabel />
              </span>
              <MetricBar tokens={ESTIMATED_TOKENS} />
              <span className="text-xs text-text-40">
                ≈ {fmtNum(MOCK_STAKER.cycleRewardRif)} RIF · next cycle in {MOCK_STAKER.nextCycleInDays} days
              </span>
            </RewardCard>
            <RewardCard
              title="ABI"
              info="Your Annual Backers Incentives (%). With the tiered model it is set by your bucket: 28% (day 0-60), 17% (day 61-180), 8% (day 181+)."
            >
              <span className="font-kk-topo text-xl">{MOCK_STAKER.tier.abiPct}%</span>
              <BucketBadge tier={MOCK_STAKER.tier} className="self-start scale-90 origin-left" />
            </RewardCard>
          </div>
        </div>

        <div className={clsx('flex-1 min-w-0 hidden md:block', detailedView ? 'visible' : 'invisible')}>
          <div className="flex flex-col sm:flex-row md:items-start gap-6 sm:gap-10">
            <RewardCard title="Total Earned" info="All-time rewards earned across all builders">
              <span className="font-kk-topo text-xl">
                {fmtUsd2(TOTAL_EARNED_USD).slice(1)} <UsdLabel />
              </span>
              <button type="button" className="flex items-center gap-1.5 text-sm text-text-100 hover:text-primary cursor-pointer">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 8v4l3 3M3.05 11a9 9 0 11.5 4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 5v6h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                See Rewards History
              </button>
            </RewardCard>
            <RewardCard title="Backing" info="Your total stRIF allocated to builders">
              <span className="font-kk-topo text-xl">{fmtNum(MOCK_STAKER.strifStaked)} stRIF</span>
              <span className="text-xs text-text-40">
                {fmtUsd2(MOCK_STAKER.strifStaked * DEFAULT_RIF_PRICE)} USD
              </span>
            </RewardCard>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ---------- REWARDS DETAILS table ---------- */

const SortIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-text-60 inline-block mr-1.5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8 9l4-4 4 4M8 15l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Th = ({ children, sub }: { children: ReactNode; sub?: string }) => (
  <th className="py-3 px-3 text-left text-sm font-normal text-text-80 whitespace-nowrap">
    <SortIcon />
    {children}
    {sub && <span className="block text-xs text-text-40 ml-5">{sub}</span>}
  </th>
)

const UsdCell = ({ usd }: { usd: number }) => (
  <span className="whitespace-nowrap">
    {usd < 0.01 ? (
      <>
        {'<'}$0.01 <UsdLabel />
      </>
    ) : (
      <>
        {fmtUsd2(usd)} <UsdLabel />
      </>
    )}
  </span>
)

const RewardsDetailsTable = () => (
  <Section>
    <h3 className="font-kk-topo text-base uppercase tracking-wide mb-2">Rewards Details</h3>
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-text-40">
            <Th>Builder</Th>
            <Th sub="%">Backer Rewards</Th>
            <Th>Unclaimed</Th>
            <Th sub="this cycle">Estimated</Th>
            <Th>Bucket</Th>
            <Th>Backing</Th>
          </tr>
        </thead>
        <tbody>
          {BUILDER_ROWS.map(row => (
            <tr key={row.name} className="border-b border-bg-60/60 hover:bg-bg-60/30">
              <td className="py-4 px-3">
                <span className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-bg-100 font-sora font-semibold text-sm shrink-0"
                    style={{ background: row.avatarColor }}
                  >
                    {row.name[0]}
                  </span>
                  <span className="text-primary">{row.name}</span>
                </span>
              </td>
              <td className="py-4 px-3 text-sm">{row.rewardsPct}</td>
              <td className="py-4 px-3 text-sm">
                <UsdCell usd={row.unclaimedUsd} />
              </td>
              <td className="py-4 px-3 text-sm">
                <UsdCell usd={row.estimatedUsd} />
              </td>
              <td className="py-4 px-3 text-sm">
                <BucketBadge tier={MOCK_STAKER.tier} className="scale-90 origin-left" />
              </td>
              <td className="py-4 px-3 text-sm text-right">
                <span className="block">{fmtNum(row.backingStrif)} stRIF</span>
                <span className="block text-xs text-text-40">
                  {fmtUsd2(row.backingStrif * DEFAULT_RIF_PRICE)} <UsdLabel />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Section>
)

/* ---------- page ---------- */

export const MyRewardsReplica = () => (
  <div className="flex w-full max-w-[1500px] mx-auto bg-bg-100 min-h-screen">
    <Sidebar />
    <div className="flex-1 min-w-0 px-6 md:px-12 pb-16">
      <div className="max-w-[1140px] mx-auto">
        <TopBar />
        <h1 className="font-kk-topo uppercase text-[2rem] leading-tight mt-8 mb-10">My Rewards</h1>
        <div className="flex flex-col gap-2">
          <Banner />
          <BucketSection />
          <BackerRewardsSection />
          <RewardsDetailsTable />
        </div>
      </div>
    </div>
  </div>
)
