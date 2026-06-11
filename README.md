# Tiered Rewards Sandbox

Internal MVP for the new backer rewards model (ABI by buckets based on staker age). **All data is mock** — it shows the shape of what we need to build and track, not final numbers.

## Model (testing rates: 28 / 17 / 8)

| Bucket | Phase | ABI | Window |
| ------ | ----- | --- | ------ |
| A · Igniter | Activation | 28% | Day 0–60 |
| B · Builder Backer | Transition | 17% | Day 61–180 |
| C · OG | Baseline | 8% | Day 181+ |

A wallet's bucket depends on days since its **first stake** (cohort assignment is locked — unstaking and coming back does not reset the clock).

## Tabs

- **Spend Dashboard** — board-level financial view: RIF price slider, total cost (fixed ~8.76M RIF / floating USD), monthly steady cost, monthly cost per tier (stacked chart), ramp cost table, treasury insights.
- **My Rewards** — what the staker sees: current bucket, ABI %, days since first stake, progress to next tier, staked stRIF, pending cycle reward, claim CTA.

## Run

```bash
npm install
npm run dev
```

Styling mirrors the `dao-frontend` design system (theme tokens + brand fonts copied from there).
