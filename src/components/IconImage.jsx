import React, { useState } from 'react';

const fallbackEmojiMap = {
  'logout-icon': '🔒',
  'menu-bars': '☰',
  'close-x': '✖️',
  landmark: '🏛️',
  'pump-machine': '🛠️',
  'water-droplet': '💧',
  'pipeline-pipe': '🛤️',
  'valve-control': '🔧',
  'trending-up': '📈',
  'beaker-flask': '🧪',
  'chevron-right': '›',
  'home-icon': '🏠',
  'wifi-off': '📡',
  clock: '⏰',
  'settings-gear': '⚙️',
  'accessibility-icon': '♿',
};

export const IconImage = ({ name, size = 36, className = '', alt = '' }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  if (!name) return null;

  // Allow callers to pass filenames with extension or without
  const base = name.includes('.') ? name.replace(/\.[^.]+$/, '') : name;
  const src = name.includes('.') ? `/images/icons/${name}` : `/images/icons/${name}.svg`;

  const emoji = fallbackEmojiMap[base] || '🔹';

  const imgProps = {
    src,
    alt: alt || base,
    className,
    onError: () => setShowEmoji(true),
  };

  // If caller provided Tailwind size classes (h-?/w-?) prefer them; otherwise set inline size
  const shouldInlineSize =
    !className || (!/\bh-\d+\b/.test(className) && !/\bw-\d+\b/.test(className));

  if (!showEmoji) {
    const style = shouldInlineSize
      ? {
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          objectFit: 'contain',
        }
      : undefined;
    return <img {...imgProps} style={style} />;
  }

  const emojiStyle = shouldInlineSize
    ? { fontSize: typeof size === 'number' ? `${size}px` : size, lineHeight: 1 }
    : undefined;
  return (
    <span role="img" aria-label={alt || base} className={className} style={emojiStyle}>
      {emoji}
    </span>
  );
};

export default IconImage;
