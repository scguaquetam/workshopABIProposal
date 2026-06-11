import { EXAMPLE_QUERY, SCHEMA_ENTITIES, SNAPSHOT_QUERY, type SchemaEntity } from '../data/schema'
import { Card } from './shared'

/* DB Schema tab — the observation layer (Pieza 03). Mirrors prisma/schema.prisma. */

const KeyChip = ({ label }: { label: string }) => (
  <span className="ml-2 text-[9px] uppercase tracking-wider text-primary border border-primary/50 rounded-sm px-1 py-px align-middle">
    {label}
  </span>
)

const EntityCard = ({ entity }: { entity: SchemaEntity }) => (
  <Card className="flex flex-col gap-0 p-0 overflow-hidden">
    <div className="px-6 py-4 border-b border-bg-60 flex items-baseline justify-between gap-4 flex-wrap">
      <span className="font-sora font-semibold text-primary">{entity.table}</span>
      <span className="text-xs text-text-40">{entity.tagline}</span>
    </div>
    <div className="px-6 py-2">
      {entity.fields.map(field => (
        <div
          key={field.name}
          className="grid grid-cols-[minmax(150px,1.2fr)_minmax(90px,0.8fr)_2fr] gap-3 py-2.5 border-b border-bg-60/50 last:border-0 text-sm items-baseline"
        >
          <span className="font-sora text-text-100 text-[13px]">
            {field.name}
            {field.key && <KeyChip label={field.key} />}
          </span>
          <span className="text-xs text-text-40 font-sora">{field.type}</span>
          <span className="text-xs text-text-60">{field.description}</span>
        </div>
      ))}
    </div>
  </Card>
)

const QueryBlock = ({ title, query }: { title: string; query: string }) => (
  <Card>
    <span className="text-[10px] uppercase tracking-widest text-text-40 block mb-3">{title}</span>
    <pre className="font-sora text-[13px] leading-relaxed text-text-80 whitespace-pre-wrap">
      {query.split('\n').map((line, i) => (
        <span key={i} className={line.startsWith('--') ? 'text-success block' : 'block'}>
          {line}
        </span>
      ))}
    </pre>
  </Card>
)

export const SchemaView = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h2 className="font-kk-topo uppercase text-[2rem] leading-tight">Database Schema</h2>
      <p className="text-text-40 text-sm mt-2 max-w-2xl">
        The observation layer. No rewards logic inside yet: it captures stake/unstake events and
        enriches them with the tier (derived from staker age), ABI and cost. These entities feed
        both the staker UI and the board dashboard.
      </p>
      <p className="text-xs text-text-40 mt-3">
        Source of truth: <span className="font-sora text-text-60">prisma/schema.prisma</span> — same
        conventions as dao-frontend (Postgres, <span className="font-sora">dao_data</span> schema).
      </p>
    </div>

    {/* data flow strip */}
    <Card className="flex flex-wrap items-center gap-3 text-sm font-sora py-4">
      <span className="text-text-60">stake_events</span>
      <span className="text-text-40">→ registers cohort →</span>
      <span className="text-text-60">wallet_registry</span>
      <span className="text-text-40">→ enriched per cycle →</span>
      <span className="text-text-60">rewards_activity_log</span>
      <span className="text-text-40">→ aggregated monthly →</span>
      <span className="text-primary">bucket_monthly_stats</span>
    </Card>

    <div className="grid lg:grid-cols-2 gap-2 items-start">
      {SCHEMA_ENTITIES.map(entity => (
        <EntityCard key={entity.table} entity={entity} />
      ))}
    </div>

    <div className="grid md:grid-cols-2 gap-2 items-start">
      <QueryBlock title="Board query — cost per bucket and cycle" query={EXAMPLE_QUERY} />
      <QueryBlock title="Aggregation job — refresh bucket_monthly_stats" query={SNAPSHOT_QUERY} />
    </div>
  </div>
)
