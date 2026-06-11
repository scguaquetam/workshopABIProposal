import { useState } from 'react'

import {
  DEFAULT_RIF_PRICE,
  MODEL_BASE_PRICE,
  MONTHLY_COSTS,
  NEW_STAKERS_PER_MONTH,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  RAMP_ROWS,
  STEADY_MONTHLY_RIF,
  TIERS,
  TOTAL_PROGRAM_RIF,
  fmtNum,
  fmtUsd,
} from '../data/sandbox'
import { Card, CardHeader, Metric } from './shared'

const CHART = { width: 560, height: 240, top: 20, bottom: 200, left: 44, right: 544 }
const BAR_WIDTH = 46

/** Stacked monthly cost chart. Bar heights are RIF × price, so the whole chart reacts to the slider. */
const MonthlyCostChart = ({ price }: { price: number }) => {
  const usdTotals = MONTHLY_COSTS.map(m => (m.rifByTier.A + m.rifByTier.B + m.rifByTier.C) * price)
  const maxUsd = Math.max(...usdTotals)
  // round the axis top up to the next $15k so gridlines land on clean numbers
  const axisMax = Math.ceil(maxUsd / 15_000) * 15_000
  const plotHeight = CHART.bottom - CHART.top
  const yFor = (usd: number) => CHART.bottom - (usd / axisMax) * plotHeight

  const slotWidth = (CHART.right - CHART.left) / MONTHLY_COSTS.length
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => f * axisMax)

  return (
    <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} width="100%" className="font-sans">
      <g stroke="var(--color-bg-60)" strokeWidth="1">
        {ticks.map(t => (
          <line key={t} x1={CHART.left} y1={yFor(t)} x2={CHART.right} y2={yFor(t)} />
        ))}
      </g>
      <g fill="var(--color-text-40)" fontSize="10" textAnchor="end">
        {ticks.map(t => (
          <text key={t} x={CHART.left - 6} y={yFor(t) + 4}>
            {t === 0 ? '$0' : `$${Math.round(t / 1000)}k`}
          </text>
        ))}
      </g>
      {MONTHLY_COSTS.map((m, i) => {
        const x = CHART.left + slotWidth * i + (slotWidth - BAR_WIDTH) / 2
        const totalUsd = usdTotals[i]
        // stack order: C (base) → B → A
        let cursor = CHART.bottom
        const segments = (['C', 'B', 'A'] as const).map(tierId => {
          const tier = TIERS.find(t => t.id === tierId)!
          const h = (m.rifByTier[tierId] * price / axisMax) * plotHeight
          cursor -= h
          return { tier, y: cursor, h }
        })
        return (
          <g key={m.month}>
            {segments.map(s => (
              <rect
                key={s.tier.id}
                x={x}
                y={s.y}
                width={BAR_WIDTH}
                height={s.h}
                fill={s.tier.color}
                opacity={m.isSteady ? 0.85 : 1}
              />
            ))}
            {m.isSteady && (
              <>
                <rect
                  x={x}
                  y={cursor}
                  width={BAR_WIDTH}
                  height={CHART.bottom - cursor}
                  fill="none"
                  stroke="var(--color-tier-a)"
                  strokeWidth="1.4"
                  strokeDasharray="3 3"
                />
                <text
                  x={x + BAR_WIDTH / 2}
                  y={cursor - 6}
                  fill="var(--color-tier-a)"
                  fontSize="9.5"
                  textAnchor="middle"
                  fontWeight="700"
                >
                  ~{fmtUsd(totalUsd / 1000)}k
                </text>
              </>
            )}
            <text
              x={x + BAR_WIDTH / 2}
              y={CHART.bottom + 20}
              fill="var(--color-text-40)"
              fontSize="10"
              textAnchor="middle"
            >
              {m.month}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export const BoardDashboard = () => {
  const [price, setPrice] = useState(DEFAULT_RIF_PRICE)

  const totalUsd = TOTAL_PROGRAM_RIF * price
  const steadyMonthlyUsd = STEADY_MONTHLY_RIF * price
  const deltaPct = Math.round((price / MODEL_BASE_PRICE - 1) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-kk-topo uppercase text-[2rem] leading-tight">Spend Dashboard</h2>
        <p className="text-text-40 text-sm mt-2 max-w-2xl">
          Clean financial view: cost per tier, accrued vs budget, and the impact of the RIF price.
          The RIF cost is fixed; the USD cost floats with the price — that is the variable this
          dashboard is built to expose.
        </p>
      </div>

      <Card className="flex flex-wrap items-center gap-4">
        <span className="text-xs uppercase tracking-widest text-text-40">RIF price</span>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={price}
          onChange={e => setPrice(parseFloat(e.target.value))}
          className="w-56"
        />
        <span className="font-sora text-xl text-primary w-20">${price.toFixed(3)}</span>
        <span className="text-xs text-text-40 max-w-md">
          The program costs a fixed ~8.76M RIF for the full ramp to 100M stRIF. Move the price to
          see the USD cost. The original model was closed at $0.04; RIF trades at ~$0.06 today.
        </span>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Metric title="Total cost (RIF)" footer="fixed, ramp to 100M">
          8.76M
        </Metric>
        <Metric
          title="Total cost (USD)"
          footer={`${deltaPct >= 0 ? '+' : ''}${deltaPct}% vs model at $0.04`}
          footerClassName={deltaPct > 0 ? 'text-error' : 'text-success'}
        >
          {fmtUsd(totalUsd)}
        </Metric>
        <Metric title="Monthly cost (steady)" footer="at steady state">
          {fmtUsd(steadyMonthlyUsd)}
        </Metric>
        <Metric title="New stakers / month" footer="current month cohort" footerClassName="text-success">
          {NEW_STAKERS_PER_MONTH}
        </Metric>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-2">
        <Card>
          <CardHeader title="Monthly cost per tier (USD)" hint="Mock" />
          <MonthlyCostChart price={price} />
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-text-40">
            {TIERS.map(t => (
              <span key={t.id} className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-[2px] inline-block" style={{ background: t.color }} />
                Tier {t.id} ({t.abiPct}%){t.id === 'C' && ' — dominant cost driver'}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Ramp cost (excerpt)" hint="Mock / from model" />
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-text-40 border-b border-bg-60">
                <th className="py-2 font-normal">Total stRIF</th>
                <th className="py-2 font-normal text-right">RIF / month</th>
                <th className="py-2 font-normal text-right">USD / month</th>
              </tr>
            </thead>
            <tbody>
              {RAMP_ROWS.map(row => (
                <tr key={row.strifLabel} className="border-b border-bg-60/60">
                  <td className="py-2.5 text-text-60">{row.strifLabel}</td>
                  <td className="py-2.5 text-right font-sora text-text-80">{fmtNum(row.rifPerMonth)}</td>
                  <td className="py-2.5 text-right font-sora text-text-100">
                    {fmtUsd(row.rifPerMonth * price)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="text-sm">
                <td className="pt-3 text-text-40">Total program</td>
                <td className="pt-3 text-right font-sora text-text-80">{fmtNum(TOTAL_PROGRAM_RIF)}</td>
                <td className="pt-3 text-right font-sora text-primary font-semibold">{fmtUsd(totalUsd)}</td>
              </tr>
            </tfoot>
          </table>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        <Card>
          <CardHeader title="Key insight for the board" />
          <p className="text-sm text-text-60 leading-relaxed">
            Tier C (8%) is the dominant cost driver even though it has the lowest rate, because it
            accumulates all historical stRIF. And the RIF price moves the USD cost 1:1 — from $0.04
            to $0.06 the program goes from ~$350K to ~$525K.
          </p>
        </Card>
        <Card>
          <CardHeader title="Treasury decision" />
          <p className="text-sm text-text-60 leading-relaxed">
            Fixing the budget in RIF (8.76M) lets the USD spend float with the price. Fixing it in
            USD forces ABI or ramp cuts when RIF goes up. The model currently fixes RIF — worth
            making that decision explicit.
          </p>
        </Card>
      </div>
    </div>
  )
}
