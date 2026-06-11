/**
 * Mock data for the Tiered Rewards Sandbox.
 * Everything here is illustrative — it mirrors the shape of the model
 * (tiers by staker age, fixed RIF cost, USD cost floating with RIF price),
 * not final numbers.
 */

export type TierId = 'A' | 'B' | 'C'

export interface Tier {
  id: TierId
  name: string
  phase: string
  abiPct: number
  monthlyPct: number
  window: string
  description: string
  color: string
}

export const TIERS: Tier[] = [
  {
    id: 'A',
    name: 'Igniter',
    phase: 'Activation',
    abiPct: 28,
    monthlyPct: 2.33,
    window: 'Day 0 – 60',
    description: 'The hook for new stakers. High ABI for the first 60 days.',
    color: 'var(--color-tier-a)',
  },
  {
    id: 'B',
    name: 'Builder Backer',
    phase: 'Transition',
    abiPct: 17,
    monthlyPct: 1.42,
    window: 'Day 61 – 180',
    description: 'A 120-day stretch. Still strong, cooling towards the baseline.',
    color: 'var(--color-tier-b)',
  },
  {
    id: 'C',
    name: 'OG',
    phase: 'Baseline',
    abiPct: 8,
    monthlyPct: 0.67,
    window: 'Day 181+',
    description: 'The long-term base. Largest bucket — it accumulates all historical stRIF.',
    color: 'var(--color-tier-c)',
  },
]

/** Total program cost in RIF — fixed, for the full ramp to 100M stRIF. */
export const TOTAL_PROGRAM_RIF = 8_760_064

/** Monthly RIF cost at steady state (100M stRIF). */
export const STEADY_MONTHLY_RIF = 929_610

/** Price the original model was closed at. */
export const MODEL_BASE_PRICE = 0.04

/** Current (mock) RIF price, default slider position. */
export const DEFAULT_RIF_PRICE = 0.06

export const PRICE_MIN = 0.03
export const PRICE_MAX = 0.08
export const PRICE_STEP = 0.005

export const NEW_STAKERS_PER_MONTH = 155

/** Monthly cost per tier in RIF (mock ramp). USD = rif × price. */
export interface MonthlyCost {
  month: string
  isSteady?: boolean
  rifByTier: Record<TierId, number>
}

export const MONTHLY_COSTS: MonthlyCost[] = [
  { month: 'May', rifByTier: { A: 55_600, B: 44_400, C: 177_800 } },
  { month: 'Jul', rifByTier: { A: 100_000, B: 77_800, C: 316_700 } },
  { month: 'Sep', rifByTier: { A: 127_800, B: 100_000, C: 411_100 } },
  { month: 'Nov', rifByTier: { A: 144_400, B: 116_700, C: 455_600 } },
  { month: 'Jan', rifByTier: { A: 155_600, B: 127_800, C: 500_000 } },
  { month: 'Steady', isSteady: true, rifByTier: { A: 185_000, B: 150_000, C: 594_610 } },
]

/** Ramp cost excerpt (from the model): total stRIF vs monthly RIF cost. */
export const RAMP_ROWS: { strifLabel: string; rifPerMonth: number }[] = [
  { strifLabel: '35.8M', rifPerMonth: 276_378 },
  { strifLabel: '47.5M', rifPerMonth: 493_695 },
  { strifLabel: '59.2M', rifPerMonth: 639_466 },
  { strifLabel: '70.8M', rifPerMonth: 712_002 },
  { strifLabel: '82.5M', rifPerMonth: 784_538 },
  { strifLabel: '100M', rifPerMonth: 929_610 },
]

/** Mock staker shown in the app UI tab. */
export const MOCK_STAKER = {
  address: '0x024B…D190',
  tier: TIERS[1],
  firstStakeLabel: 'Mar 2026',
  daysSinceFirstStake: 78,
  nextTierDay: 180,
  daysToNextTier: 102,
  strifStaked: 86_722,
  cycleRewardRif: 1_229,
  nextCycleInDays: 6,
  vestingDays: 90,
}

/** Token split shown in the segmented metric bars (RIF blue / rBTC orange / USDRIF blue). */
export interface TokenAmount {
  symbol: 'RIF' | 'rBTC' | 'USDRIF'
  usd: number
}

export const UNCLAIMED_TOKENS: TokenAmount[] = [
  { symbol: 'RIF', usd: 45.3 },
  { symbol: 'rBTC', usd: 20.14 },
  { symbol: 'USDRIF', usd: 8.3 },
]

export const ESTIMATED_TOKENS: TokenAmount[] = [
  { symbol: 'RIF', usd: 22.1 },
  { symbol: 'rBTC', usd: 9.9 },
  { symbol: 'USDRIF', usd: 4.2 },
]

export const TOTAL_EARNED_USD = 412.36

/** Dummy rows for the REWARDS DETAILS builders table. */
export interface BuilderRow {
  name: string
  avatarColor: string
  rewardsPct: number
  unclaimedUsd: number
  estimatedUsd: number
  backingStrif: number
}

export const BUILDER_ROWS: BuilderRow[] = [
  { name: 'Tropykus', avatarColor: '#2dbf9e', rewardsPct: 74, unclaimedUsd: 31.4, estimatedUsd: 15.8, backingStrif: 28_400 },
  { name: 'Wesatoshis Labs', avatarColor: '#c0492f', rewardsPct: 75, unclaimedUsd: 22.1, estimatedUsd: 11.2, backingStrif: 21_300 },
  { name: 'Boltz', avatarColor: '#9e76ff', rewardsPct: 60, unclaimedUsd: 12.94, estimatedUsd: 6.1, backingStrif: 18_022 },
  { name: 'Sovryn', avatarColor: '#f7931a', rewardsPct: 80, unclaimedUsd: 7.3, estimatedUsd: 3.1, backingStrif: 19_000 },
]

export const fmtUsd = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US')

export const fmtUsd2 = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtNum = (n: number) => Math.round(n).toLocaleString('en-US')
