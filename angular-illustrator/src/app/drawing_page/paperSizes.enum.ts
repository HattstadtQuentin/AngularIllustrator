export const PaperSizes = {
  A0: { title: 'A0', description: '841 × 1189 mm' },
  A1: { title: 'A1', description: '594 × 841 mm' },
  A2: { title: 'A2', description: '420 × 594 mm' },
  A3: { title: 'A3', description: '297 × 420 mm' },
  A4: { title: 'A4', description: '210 × 297 mm' },
  A5: { title: 'A5', description: '148 × 210 mm' },
}

type PaperSizesMap = { [key in keyof typeof PaperSizes]: typeof PaperSizes[key] };
export const paperSizesMap: PaperSizesMap = PaperSizes;
