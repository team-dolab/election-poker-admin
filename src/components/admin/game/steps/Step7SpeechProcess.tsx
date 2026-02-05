'use client';

import { useState } from 'react';
import { Player } from '@/types/database';
import { CARD_DECK } from '@/types/game';
import styles from '../../admin.module.css';

interface Step7SpeechProcessProps {
  players: Player[];
  speechCards: string[];
  onSetSpeechCards: (cards: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ALL_CARDS = [
  ...CARD_DECK.spades,
  ...CARD_DECK.hearts,
  ...CARD_DECK.diamonds,
  ...CARD_DECK.clubs,
];

export default function Step7SpeechProcess({
  players,
  speechCards,
  onSetSpeechCards,
  onNext,
  onPrev,
}: Step7SpeechProcessProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>(speechCards);
  const candidates = players.filter((p) => p.status === 'run');

  const toggleCard = (card: string) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((c) => c !== card));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSetCards = () => {
    onSetSpeechCards(selectedCards);
  };

  const isRed = (card: string) => card.includes('♥') || card.includes('♦');

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>연설 진행</h2>
        <p className={styles.stepDescription}>
          공약 카드 3장을 선택하세요
        </p>
      </div>

      <div className={styles.stepContent}>
        {/* 선택된 카드 미리보기 */}
        <div className={styles.selectedCardsPreview}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`${styles.previewCard} ${
                selectedCards[index]
                  ? isRed(selectedCards[index])
                    ? styles.red
                    : styles.black
                  : styles.empty
              }`}
            >
              {selectedCards[index] || '?'}
            </div>
          ))}
        </div>

        {/* 카드 선택 그리드 */}
        <div className={styles.cardGrid}>
          {['spades', 'hearts', 'diamonds', 'clubs'].map((suit) => (
            <div key={suit} className={styles.cardSuitRow}>
              {CARD_DECK[suit as keyof typeof CARD_DECK].map((card) => (
                <button
                  key={card}
                  className={`${styles.cardButton} ${
                    selectedCards.includes(card) ? styles.selected : ''
                  } ${isRed(card) ? styles.red : styles.black}`}
                  onClick={() => toggleCard(card)}
                >
                  {card}
                </button>
              ))}
            </div>
          ))}
        </div>

        <button
          className={styles.primaryButton}
          onClick={handleSetCards}
          disabled={selectedCards.length !== 3}
        >
          카드 공개
        </button>
      </div>

      <div className={styles.stepActions}>
        <button className={styles.secondaryButton} onClick={onPrev}>
          이전
        </button>
        <button className={styles.successButton} onClick={onNext}>
          연설 완료 → 다음
        </button>
      </div>
    </div>
  );
}
