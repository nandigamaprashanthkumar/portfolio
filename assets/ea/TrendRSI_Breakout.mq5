//+------------------------------------------------------------------+
//|                                            TrendRSI_Breakout.mq5 |
//|                      EMA Crossover with RSI Filter (MT5)          |
//|          Executes on closed bars only - no repainting            |
//+------------------------------------------------------------------+
#property copyright "Open Source"
#property version   "1.10"
#property description "EMA Crossover with RSI Filter - closed-bar execution, broker-safe orders"

#include <Trade\Trade.mqh>

//--- Strategy inputs
input group "Strategy Settings"
input int      FastEMA_Period = 10;     // Fast EMA Period
input int      SlowEMA_Period = 50;     // Slow EMA Period
input int      RSI_Period     = 14;     // RSI Period
input double   RSI_Midline    = 50.0;   // RSI trend filter level

//--- Risk inputs
input group "Risk Management"
input double   LotSize        = 0.10;   // Trading lot size (0.10 default; see guide before raising)
input int      StopLoss       = 3000;   // Stop Loss in points
input int      TakeProfit     = 6000;   // Take Profit in points
input ulong    MagicNumber    = 888888; // Magic number for order tracking
input int      Slippage       = 20;     // Max price deviation in points

//--- Globals
CTrade  trade;
int     handle_fast_ema;
int     handle_slow_ema;
int     handle_rsi;

//+------------------------------------------------------------------+
//| Initialization                                                   |
//+------------------------------------------------------------------+
int OnInit()
  {
   trade.SetExpertMagicNumber(MagicNumber);
   trade.SetDeviationInPoints(Slippage);
   trade.SetTypeFillingBySymbol(_Symbol);

   handle_fast_ema = iMA(_Symbol, _Period, FastEMA_Period, 0, MODE_EMA, PRICE_CLOSE);
   handle_slow_ema = iMA(_Symbol, _Period, SlowEMA_Period, 0, MODE_EMA, PRICE_CLOSE);
   handle_rsi      = iRSI(_Symbol, _Period, RSI_Period, PRICE_CLOSE);

   if(handle_fast_ema == INVALID_HANDLE ||
      handle_slow_ema == INVALID_HANDLE ||
      handle_rsi      == INVALID_HANDLE)
     {
      Print("Error initializing technical indicators.");
      return(INIT_FAILED);
     }

   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
//| Deinitialization                                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
   IndicatorRelease(handle_fast_ema);
   IndicatorRelease(handle_slow_ema);
   IndicatorRelease(handle_rsi);
  }

//+------------------------------------------------------------------+
//| Tick handler                                                     |
//+------------------------------------------------------------------+
void OnTick()
  {
   //--- Run the logic once per newly closed bar
   static datetime last_bar_time = 0;
   datetime current_bar_time = iTime(_Symbol, _Period, 0);
   if(current_bar_time == last_bar_time)
      return;
   last_bar_time = current_bar_time;   // mark this bar as processed

   //--- Only one position for this EA on this symbol
   if(HasOpenPosition())
      return;

   //--- Pull the last two CLOSED bars of each indicator
   double fast_ema[], slow_ema[], rsi[];
   ArraySetAsSeries(fast_ema, true);
   ArraySetAsSeries(slow_ema, true);
   ArraySetAsSeries(rsi, true);

   if(CopyBuffer(handle_fast_ema, 0, 1, 2, fast_ema) < 2) return;
   if(CopyBuffer(handle_slow_ema, 0, 1, 2, slow_ema) < 2) return;
   if(CopyBuffer(handle_rsi,      0, 1, 2, rsi)      < 2) return;

   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   //--- Respect the broker's minimum stop distance
   long   stop_level = SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL);
   double min_dist   = stop_level * _Point;

   double lot = NormalizeLot(LotSize);

   //--- LONG: fast EMA crosses above slow EMA, RSI above midline
   if(fast_ema[0] > slow_ema[0] &&
      fast_ema[1] <= slow_ema[1] &&
      rsi[0] > RSI_Midline)
     {
      double sl = NormalizeDouble(ask - MathMax(StopLoss   * _Point, min_dist), _Digits);
      double tp = NormalizeDouble(ask + MathMax(TakeProfit * _Point, min_dist), _Digits);
      if(!trade.Buy(lot, _Symbol, ask, sl, tp, "Long Entry"))
         Print("Buy failed: ", trade.ResultRetcodeDescription());
      return;
     }

   //--- SHORT: fast EMA crosses below slow EMA, RSI below midline
   if(fast_ema[0] < slow_ema[0] &&
      fast_ema[1] >= slow_ema[1] &&
      rsi[0] < RSI_Midline)
     {
      double sl = NormalizeDouble(bid + MathMax(StopLoss   * _Point, min_dist), _Digits);
      double tp = NormalizeDouble(bid - MathMax(TakeProfit * _Point, min_dist), _Digits);
      if(!trade.Sell(lot, _Symbol, bid, sl, tp, "Short Entry"))
         Print("Sell failed: ", trade.ResultRetcodeDescription());
      return;
     }
  }

//+------------------------------------------------------------------+
//| True if this EA already holds a position on this symbol          |
//+------------------------------------------------------------------+
bool HasOpenPosition()
  {
   for(int i = PositionsTotal() - 1; i >= 0; i--)
     {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      if(PositionGetString(POSITION_SYMBOL) == _Symbol &&
         PositionGetInteger(POSITION_MAGIC) == (long)MagicNumber)
         return true;
     }
   return false;
  }

//+------------------------------------------------------------------+
//| Clamp/round lot size to the symbol's volume rules                |
//+------------------------------------------------------------------+
double NormalizeLot(double lots)
  {
   double vmin  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double vmax  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double vstep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   if(vstep <= 0) vstep = 0.01;
   lots = MathRound(lots / vstep) * vstep;
   if(lots < vmin) lots = vmin;
   if(lots > vmax) lots = vmax;
   return lots;
  }
//+------------------------------------------------------------------+
