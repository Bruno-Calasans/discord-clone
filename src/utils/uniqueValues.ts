export default function uniqueArray(array: string[]) {
  const frequency: Record<string, number> = {};
  const uniqueArray: string[] = [];

  for (const value of array) {
    if (!frequency[value]) frequency[value] = 1;
    else frequency[value] = frequency[value]++;
  }

  for (const value in frequency) {
    uniqueArray.push(value);
  }

  return uniqueArray;
}
