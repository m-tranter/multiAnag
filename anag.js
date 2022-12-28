const { dictionary } = require("./newDict.js");

const freq = (word) => {
  // Returns an object with the constter frequencies of a string.
  return Array.from(word).reduce((f, ch) => {
    f[ch] = f[ch] ? f[ch] + 1 : 1;
    return f;
  }, {});
};

const remover = (freq, word) => {
  return Array.from(word).reduce(
    (f, ch) => {
      f[ch] -= 1;
      return f;
    },
    { ...freq }
  );
};

const isSubString = (origFreq, candFreq) => {
  return Object.keys(candFreq).every((k) => origFreq[k] >= candFreq[k]);
};

const getCands = (len, strFreq) => {
  return dictionary[len - 1].filter((e) => isSubString(strFreq, e.f));
};

const origOrder = (wordLengths, sol) => {
  return wordLengths
    .reduce((acc, w) => {
      const temp = sol.findIndex((e) => e.length === w);
      acc.push(sol[temp]);
      sol.splice(temp, 1);
      return acc;
    }, [])
    .join(" ");
};

const multi = (str, wordLens) => {
  const findSols = (strFreq, cands, candInd, wordInd, sol) => {
    if (!cands.length) {
      return;
    }
    const tempSol = sol.concat(cands[candInd].word);
    if (tempSol.length === arr.length) {
      sols.push(tempSol);
    }
    if (candInd < cands.length - 1) {
      findSols(strFreq, cands, candInd + 1, wordInd, sol);
    }
    if (wordInd < arr.length) {
      const tempFreq = remover(strFreq, cands[candInd].word);
      findSols(
        tempFreq,
        getCands(arr[wordInd], tempFreq),
        0,
        wordInd + 1,
        tempSol
      );
    }
  };

  const arr = [...wordLens].sort().reverse();
  const sols = [];
  const strFreq = freq(str);
  findSols(strFreq, getCands(arr[0], strFreq), 0, 1, []);
  return sols;
};

const wordLengths = [5, 7];
const res = multi("seasidezebra", wordLengths);
res.sort((a, b) => a[0].localeCompare(b[0]));
res.forEach((e) => console.log(origOrder(wordLengths, e)));
