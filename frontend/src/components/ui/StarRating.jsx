import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export function Stars({ rating = 0, size = '1rem' }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar key={s} className={`star ${s <= Math.round(rating) ? 'filled' : ''}`} style={{ fontSize: size }} />
      ))}
    </span>
  );
}

export function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span className="stars" role="group" aria-label="Rate this owner">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          className={`star ${s <= (hovered || value) ? 'filled' : ''}`}
          style={{ fontSize: '1.75rem', cursor: 'pointer', transition: 'color 0.15s' }}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          aria-label={`${s} star`}
        />
      ))}
    </span>
  );
}
