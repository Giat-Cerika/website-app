export const QUIZ_STATUS = {
  DRAFT: { label: 'Draft', value: 0 },
  OPEN: { label: 'Open', value: 1 },
  CLOSE: { label: 'Close', value: 2 },
} as const;

// Helper functions
export const getStatusLabel = (value: number): string => {
  const status = Object.values(QUIZ_STATUS).find(s => s.value === value);
  return status?.label || 'Unknown';
};

export const getStatusValue = (label: string): number => {
  const status = Object.values(QUIZ_STATUS).find(
    s => s.label.toLowerCase() === label.toLowerCase()
  );
  return status?.value ?? -1;
};