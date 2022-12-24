const { dictionary } = require("./newDict.js");

const freq = (word) => {
  return Array.from(word).reduce((f, ch) => {
    f[ch] = f[ch] ? f[ch] + 1 : 1;
    return f;
  }, {});
};

const remover = (freq, word) => {
  let temp = structuredClone(freq);
  word.split("").forEach((e) => {
    temp[e] -= 1;
  });
  return temp;
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
      findSols(
        tempFreq,
        dictionary[arr[wordInd + 1] - 1].filter((e) =>
          isSubString(tempFreq, e.f)
        ),
        0,
        wordInd + 1,
        tempSol
      );
    }
  };

  let strFreq = freq(str);
  findSols(
    strFreq,
    dictionary[arr[0] - 1].filter((e) => isSubString(strFreq, e.f)),
    0,
    0,
    []
  );
  return sols;
};

const origOrder = (wordLengths, sol) => {
  res = [];
  wordLengths.forEach((w) => {
    let temp = sol.findIndex((e) => e.length === w);
    res.push(sol[temp]);
    sol.splice(temp, 1);
  });
  return res.join(" ");
};

let wordLengths = [4, 3, 4];
let res = multi("tcfairkmeoe", wordLengths);
res.sort((a, b) => a[0].localeCompare(b[0]));
res.forEach((e) => console.log(origOrder(wordLengths, e)));
