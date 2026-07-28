'use client';

import { useState, useMemo, useEffect } from 'react';

// AlphaGroupList – Reusable A-Z accordion list with checkboxes

export default function AlphaGroupList({
  items = [],
  selectedIds = [],
  onToggle,
  renderItem,
  emptyMessage = 'No items found.',
  isFiltered = false,
}) {
  // Group items by first letter
  const grouped = useMemo(() => {
    const map = {};

    [...items]
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((item) => {
        const letter = item.name[0].toUpperCase();

        if (!map[letter]) {
          map[letter] = [];
        }

        map[letter].push(item);
      });

    return map;
  }, [items]);

  // Get sorted alphabet letters
  const letters = useMemo(() => {
    return Object.keys(grouped).sort();
  }, [grouped]);

  // Open/closed accordion state for letter sections
  const [openLetters, setOpenLetters] = useState({});

  // When filtered (search applied), expand all matching letter groups.
  // When not filtered, default: first letter group is open, rest closed.
  useEffect(() => {
    const nextState = {};

    if (isFiltered) {
      letters.forEach((letter) => {
        nextState[letter] = true;
      });
    } else if (letters.length > 0) {
      nextState[letters[0]] = true;
    }

    setOpenLetters(nextState);
  }, [isFiltered, letters]);

  // Toggle individual letter accordion
  const toggleLetter = (letter) => {
    setOpenLetters((prev) => ({
      ...prev,
      [letter]: !prev[letter],
    }));
  };

  // Show empty message
  if (items.length === 0) {
    return (
      <div className="alpha-empty">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="alpha-group-container">
      {letters.map((letter) => {
        const isOpen = !!openLetters[letter];
        const groupItems = grouped[letter];

        return (
          <div
            key={letter}
            className="alpha-group-section"
          >
            {/* Letter Header – click to toggle */}
            <button
              className={`alpha-group-header ${
                isOpen ? 'open' : ''
              }`}
              onClick={() => toggleLetter(letter)}
              type="button"
              aria-expanded={isOpen}
            >
              <span className="alpha-group-letter">
                {letter}
              </span>

              <span className="alpha-group-count">
                {groupItems.length}
              </span>

              <svg
                className={`alpha-group-chevron ${
                  isOpen ? 'rotated' : ''
                }`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Collapsible content */}
            <div
              className={`alpha-group-body ${
                isOpen ? 'expanded' : 'collapsed'
              }`}
            >
              <div className="alpha-group-grid">
                {groupItems.map((item) => {
                  const isChecked = selectedIds.includes(item.id);

                  // Custom item renderer
                  if (renderItem) {
                    return (
                      <div key={item.id}>
                        {renderItem(
                          item,
                          isChecked,
                          onToggle
                        )}
                      </div>
                    );
                  }

                  // Default card
                  return (
                    <div
                      key={item.id}
                      className={`alpha-item-card ${
                        isChecked ? 'selected' : ''
                      }`}
                      onClick={() => onToggle(item.id)}
                    >
                      {/* Checkbox */}
                      <div
                        className={`alpha-item-checkbox ${
                          isChecked ? 'checked' : ''
                        }`}
                      >
                        {isChecked && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>

                      {/* Item Information */}
                      <div className="alpha-item-info">
                        <span className="alpha-item-name">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}