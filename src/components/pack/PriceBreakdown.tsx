"use client";

import type { Card } from "@/lib/types";
import { PACK_PRICE } from "@/lib/constants";
import styles from "./PriceBreakdown.module.css";

interface PriceBreakdownProps {
  cards: Card[];
}

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function PriceBreakdown({ cards }: PriceBreakdownProps) {
  const pricedCards = cards
    .filter((c) => c.marketPrice != null)
    .sort((a, b) => (b.marketPrice ?? 0) - (a.marketPrice ?? 0));

  const totalValue = pricedCards.reduce((sum, c) => sum + (c.marketPrice ?? 0), 0);
  const unpricedCount = cards.length - pricedCards.length;
  const profit = totalValue - PACK_PRICE;
  const isProfit = profit >= 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Price Breakdown</h3>
      </div>

      <div className={styles.totals}>
        <div className={styles.row}>
          <span>Pack cost</span>
          <span>{formatPrice(PACK_PRICE)}</span>
        </div>
        <div className={styles.row}>
          <span>
            Pull value
            {unpricedCount > 0 && (
              <span className={styles.note}>
                {" "}({unpricedCount} card{unpricedCount > 1 ? "s" : ""} unpriced)
              </span>
            )}
          </span>
          <span>{formatPrice(totalValue)}</span>
        </div>
        <div className={`${styles.row} ${styles.profitRow}`}>
          <span>{isProfit ? "Profit" : "Loss"}</span>
          <span className={isProfit ? styles.profit : styles.loss}>
            {isProfit ? "+" : ""}{formatPrice(profit)}
          </span>
        </div>
      </div>

      {pricedCards.length > 0 && (
        <ul className={styles.cardList}>
          {pricedCards.map((card) => (
            <li key={card.id} className={styles.cardItem}>
              <span className={styles.cardName}>{card.name}</span>
              <span className={styles.cardPrice}>
                {formatPrice(card.marketPrice!)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
