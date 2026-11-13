# TrendRSI Breakout EA — Understanding & User Guide

**File:** `TrendRSI_Breakout.mq5`
**Platform:** MetaTrader 5 (MT5)
**Strategy type:** Trend-following EMA crossover with an RSI filter

---

## 1. What this EA does (in plain English)

The EA watches two moving averages and one momentum indicator, and opens a single trade when they agree on direction:

- **Fast EMA (10)** — reacts quickly to recent price.
- **Slow EMA (50)** — reacts slowly; represents the broader trend.
- **RSI (14)** — a momentum gauge from 0 to 100, used here as a simple "are buyers or sellers in control" filter around the midline (50).

It takes a trade only at the moment the fast EMA *crosses* the slow EMA, and only if RSI confirms the same direction. Every trade gets a fixed Stop Loss and Take Profit set at a **1:2 risk-to-reward ratio** (the default is 3000 points risk, 6000 points reward).

The EA holds **at most one position at a time** and only acts on **closed bars**, so its signals do not flicker or "repaint" during a forming candle.

---

## 2. The entry logic, step by step

On each new bar, the EA reads the two most recently *closed* bars and checks:

**Buy (long):**
1. Fast EMA is now above Slow EMA, **and**
2. On the previous bar Fast EMA was at or below Slow EMA (this is the upward cross), **and**
3. RSI is above 50 (momentum confirms the up-move).

**Sell (short):**
1. Fast EMA is now below Slow EMA, **and**
2. On the previous bar Fast EMA was at or above Slow EMA (downward cross), **and**
3. RSI is below 50.

When a signal fires, the EA calculates SL and TP from the current price and sends the order. If a position is already open for this EA, it waits until that trade closes before looking for the next signal.

---

## 3. Input parameters you can change

| Input | Default | What it controls |
|---|---|---|
| `FastEMA_Period` | 10 | Length of the fast moving average |
| `SlowEMA_Period` | 50 | Length of the slow moving average |
| `RSI_Period` | 14 | Lookback for the RSI filter |
| `RSI_Midline` | 50 | The line RSI must be above (longs) or below (shorts) |
| `LotSize` | 0.10 | Position size per trade |
| `StopLoss` | 3000 | Stop Loss distance in **points** |
| `TakeProfit` | 6000 | Take Profit distance in **points** |
| `MagicNumber` | 888888 | ID so the EA only manages its own trades |
| `Slippage` | 20 | Maximum allowed price deviation in points |

**Points vs. pips:** On most Gold (XAUUSD) feeds, 1 point = 0.01 in price, so `StopLoss = 3000` ≈ a $30 move in the gold price. Always confirm the point size with your own broker, because it varies.

---

## 4. Important: about the "backtest report" you were given

The results table that came with the original code (8.45% profit, 1.62 profit factor, 3.10% drawdown, etc.) is described **in that same document** as a *"simulated"* and *"highly realistic simulated report demonstrating what an optimized run looks like."* In other words, those numbers were written to illustrate a format — they are **not** the output of a real test on real data, and they should not be shown to a prop firm or used to judge the strategy.

The only trustworthy numbers are the ones you generate yourself in the MT5 Strategy Tester on your broker's historical data. Section 6 shows how.

---

## 5. How to install and run it in MT5

1. **Open MetaEditor:** In MT5, press **F4** (or Tools → MetaQuotes Language Editor).
2. **Create the EA:** File → New → Expert Advisor (template) → give it a name → Finish. Then delete the generated code and paste the full contents of `TrendRSI_Breakout.mq5`. *(Or simply copy the `.mq5` file into `MQL5/Experts/` inside your MT5 data folder and it appears in the Navigator.)*
3. **Compile:** Press **F7**. You should see **0 errors, 0 warnings**. This produces a `TrendRSI_Breakout.ex5` file.
4. **Attach to a chart:** Back in MT5, open an **XAUUSD, M15** chart. In the Navigator (Ctrl+N), find the EA under *Expert Advisors* and drag it onto the chart.
5. **Allow trading:** In the dialog that appears, tick **"Allow Algo Trading"**, then click OK. Also make sure the toolbar's **Algo Trading** button is green/enabled.
6. **Confirm it's live:** A small smiley face appears in the top-right of the chart when the EA is running correctly.

> **Always run on a demo account first.** Attach it to a demo for at least a few weeks before risking any real money.

---

## 6. How to produce a *real* backtest report

1. Press **Ctrl+R** to open the **Strategy Tester**.
2. **Expert:** select `TrendRSI_Breakout`.
3. **Symbol:** XAUUSD · **Timeframe:** M15.
4. **Modeling:** choose **"Every tick based on real ticks"** for the most accurate fills.
5. **Date range:** pick a custom period (e.g. the last 12 months).
6. Click **Start**.
7. When it finishes, open the **Backtest** / **Report** tab, right-click the results, and choose **Report → HTML** (or **Open in Excel**) to export your own `.html` / `.xlsx` file.

Run it across different date ranges and, ideally, on more than one broker's data to see how stable the results really are.

---

## 7. What was improved vs. the original code

The strategy logic is unchanged, but I hardened a few things so it runs cleanly on a live/demo broker instead of only in theory:

- **Reliable one-per-bar execution** — the "new bar" timestamp is now recorded at the start of each bar, so the logic runs exactly once per bar even when no trade is taken.
- **Broker-safe stop levels** — SL/TP now respect the broker's minimum stop distance and are rounded to the symbol's digits, which prevents "invalid stops" order errors.
- **Lot-size normalization** — the lot is rounded to the symbol's volume step and clamped to its min/max, preventing "invalid volume" errors.
- **Magic-number-aware position check** — the EA only counts *its own* trades, so it coexists with other EAs or manual trades on the same symbol.
- **Error logging** — failed orders print the broker's reason in the Experts log.
- **Safer default lot** — reduced from `1.0` to `0.10`. On XAUUSD, 1.0 lot means roughly $100 profit/loss per $1 gold move, which is very aggressive for most accounts. Raise it deliberately, not by default.

---

## 8. Risk notes

- A 42% win rate is normal for this kind of 1:2 trend system — it relies on winners being twice the size of losers, so expect losing streaks.
- Position sizing is the single biggest risk control. Size each trade so that a Stop Loss costs only a small, fixed percentage of your account (commonly 0.5–1%).
- This document is educational and describes how the tool works. It is not financial or investment advice, and no trading strategy is guaranteed to be profitable. Past or simulated results do not predict future performance.
