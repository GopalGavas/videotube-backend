const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return [
    hours > 0 ? String(hours).padstart(2, 0) : null,
    String(minutes).padStart(2, 0),
    String(remainingSeconds).padStart(2, 0),
  ]
    .filter((time) => time !== null)
    .join(":");
};

export { formatDuration };
