/** Entity definitions rendered in the DB Schema tab — mirrors prisma/schema.prisma. */

export interface SchemaField {
  name: string
  key?: 'PK' | 'FK' | 'UQ'
  type: string
  description: string
}

export interface SchemaEntity {
  table: string
  tagline: string
  fields: SchemaField[]
}

export const SCHEMA_ENTITIES: SchemaEntity[] = [
  {
    table: 'wallet_registry',
    tagline: 'one row per wallet, locked at first stake',
    fields: [
      { name: 'wallet_address', key: 'PK', type: 'varchar(42)', description: 'wallet address' },
      {
        name: 'first_stake_ts',
        type: 'timestamptz',
        description: 'cohort clock, immutable — never resets on unstake (anti-gaming)',
      },
      {
        name: 'current_tier',
        type: 'enum A/B/C',
        description: 'derived from now − first_stake_ts: 0-60 / 61-180 / 181+ days',
      },
      { name: 'status', type: 'enum', description: 'active / unstaked / restaked' },
      { name: 'created_at, updated_at', type: 'timestamptz', description: 'row housekeeping' },
    ],
  },
  {
    table: 'stake_events',
    tagline: 'raw on-chain event log, append-only audit trail',
    fields: [
      { name: 'tx_hash', key: 'PK', type: 'varchar(66)', description: 'transaction hash' },
      { name: 'wallet_address', key: 'FK', type: 'varchar(42)', description: '→ wallet_registry' },
      { name: 'event_type', type: 'enum', description: 'stake / unstake / allocate' },
      { name: 'amount', type: 'numeric(38,18)', description: 'stRIF amount of the event' },
      { name: 'block_number', type: 'bigint', description: 'block height' },
      { name: 'block_ts', type: 'timestamptz', description: 'on-chain time' },
    ],
  },
  {
    table: 'rewards_activity_log',
    tagline: 'one row per wallet per cycle — observation only, never recomputed',
    fields: [
      { name: 'id', key: 'PK', type: 'uuid', description: '—' },
      { name: 'wallet_address', key: 'FK', type: 'varchar(42)', description: '→ wallet_registry' },
      { name: 'cycle', key: 'UQ', type: 'varchar(16)', description: 'bi-weekly cycle id, e.g. 2026-C11 (unique with wallet)' },
      { name: 'strif_allocated', type: 'numeric(38,18)', description: 'average stRIF for the cycle' },
      { name: 'tier', type: 'enum A/B/C', description: 'tier in force during the cycle' },
      { name: 'abi_pct', type: 'numeric(5,2)', description: '28 / 17 / 8 snapshot — rates may change while testing' },
      { name: 'reward_rif', type: 'numeric(38,18)', description: 'strif_allocated × abi_pct / 12' },
      { name: 'rif_price', type: 'numeric(18,8)', description: 'RIF price at cycle time' },
      { name: 'cost_usd', type: 'numeric(18,2)', description: 'reward_rif × rif_price' },
    ],
  },
  {
    table: 'bucket_monthly_stats',
    tagline: 'board aggregates: stakers, stRIF and cost per bucket per month (materialized)',
    fields: [
      { name: 'id', key: 'PK', type: 'uuid', description: '—' },
      { name: 'month', key: 'UQ', type: 'date', description: 'first day of month (unique with tier)' },
      { name: 'tier', type: 'enum A/B/C', description: 'bucket' },
      { name: 'stakers_count', type: 'int', description: 'distinct active stakers in the bucket' },
      { name: 'strif_total', type: 'numeric(38,18)', description: 'total stRIF in the bucket (monthly avg)' },
      { name: 'cost_rif', type: 'numeric(38,18)', description: 'Σ reward_rif of the bucket' },
      { name: 'cost_usd', type: 'numeric(18,2)', description: 'Σ cost_usd of the bucket' },
    ],
  },
]

export const EXAMPLE_QUERY = `-- board cost per bucket and cycle, with the price at the time
SELECT cycle, tier, SUM(reward_rif) AS rif, SUM(cost_usd) AS usd
FROM rewards_activity_log
GROUP BY cycle, tier
ORDER BY cycle;`

export const SNAPSHOT_QUERY = `-- monthly refresh of the board aggregates
INSERT INTO bucket_monthly_stats (month, tier, stakers_count, strif_total, cost_rif, cost_usd)
SELECT date_trunc('month', created_at), tier,
       COUNT(DISTINCT wallet_address), AVG(strif_allocated),
       SUM(reward_rif), SUM(cost_usd)
FROM rewards_activity_log
GROUP BY 1, 2
ON CONFLICT (month, tier) DO UPDATE SET ...;`
