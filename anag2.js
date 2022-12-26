const { dictionary } = require("./newDict.js");

const origOrder = (wordLengths, sol) => {
  res = [];
  wordLengths.forEach((w) => {
    let temp = sol.findIndex((e) => e.length === w);
    res.push(sol[temp]);
    sol.splice(temp, 1);
  });
  return res.join(" ");
};
const getCands = (len, strFreq) => {
  return dictionary[len - 1].filter((e) => isSubString(strFreq, e.f));
};

const freq = (word) => {
  // Returns an object with the letter frequencies of a string.
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

const multi = (str, wordLens) => {
  let arr = [...wordLens].sort().reverse();
  const sols = [];
  const findSols = (strFreq, cands, candInd, wordInd, sol) => {
    if (cands.length === 0) {
      return;
    }
    let tempSol = sol.concat(cands[candInd].word);
    if (tempSol.length === arr.length) {
      sols.push(tempSol);
    }
    if (candInd < cands.length - 1) {
      findSols(strFreq, cands, candInd + 1, wordInd, sol);
    }
    if (wordInd < arr.length - 1) {
      let tempFreq = remover(strFreq, cands[candInd].word);
      wordInd += 1;
      findSols(tempFreq, getCands(arr[wordInd], tempFreq), 0, wordInd, tempSol);
    }
  };

  let strFreq = freq(str);
  findSols(strFreq, getCands(arr[0], strFreq), 0, 0, []);
  return sols;
};

let wordLengths = [4, 3, 4];
let res = multi("tcfairkmeoe", wordLengths);
res.sort((a, b) => a[0].localeCompare(b[0]));
res.forEach((e) => console.log(origOrder(wordLengths, e)));
