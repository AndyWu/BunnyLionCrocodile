const LONGEST_PHRASE_LENGTH = 15;
export const getPhrases = (sentence, map) => {
  const len = sentence.length;
  if (len === 1 && !map[sentence]) return [sentence];
  const separators = [];
  const marks = Array.from(new Array(len)).map(() => false);
  let i = len >= LONGEST_PHRASE_LENGTH ? LONGEST_PHRASE_LENGTH : len;
  for (; i >= 0; i -= 1) {
    const len2 = len - i;
    for (let j = 0; j <= len2; j += 1) {
      if (!marks[j]) {
        const ph = sentence.slice(j, i + j);
        if (map[ph]) {
          for (let k = j; k < i + j; k += 1) marks[k] = true;
          separators.push(j);
          separators.push(i + j);
        }
      }
    }
  }
  const sortedSeparators = separators.sort((a, b) => a - b);
  const phrases = sortedSeparators.reduce((sum, curr, i) => {
    if (i % 2 === 0) sum.push(sentence.slice(curr, sortedSeparators[i + 1]));
    return sum;
  }, []);
  // console.log(phrases)
  return phrases;
};

export const getSentences = (paragraph, map) => {
  const len = paragraph.length;
  const sentences = [];
  let lastIndex = 0;
  for (let i = 0; i < len; i += 1) {
    if (!map[paragraph[i]]) {
      sentences.push(paragraph.slice(lastIndex, i));
      sentences.push(paragraph.slice(i, i + 1));
      lastIndex = i + 1;
    }
  }
  // console.log(sentences);
  return sentences;
};

export const getParagraphs = (story) => {
  let paragraphs = story.split('\n');
  paragraphs = paragraphs[paragraphs.length - 1] === '' ? paragraphs.slice(0, paragraphs.length - 1) : paragraphs;
  paragraphs = paragraphs[0] === '' ? paragraphs.slice(1) : paragraphs;
  return paragraphs;
};
