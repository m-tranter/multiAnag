const { dictionary } = require("./newDict.js");

const freq = (word) => {
  // Returns an object with the letter frequencies of a string.
  return Array.from(word).reduce((f, ch) => {
    f[ch] = f[ch] ? f[ch] + 1 : 1;
    return f;
  }, {});
};

const remover = (freq, word) => {
  // Returns an updated frequency with letters of word decremented.
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

const origOrder = (wordLengths, sol) => {
  return wordLengths
    .reduce((acc, w) => {
      let temp = sol.findIndex((e) => e.length === w);
      acc.push(sol[temp]);
      sol.splice(temp, 1);
      return acc;
    }, [])
    .join(" ");
};

const getCands = (len, strFreq) => {
  return dictionary[len - 1].filter((e) => isSubString(strFreq, e.f));
};

const multi = (str, wordLens) => {
  const findSols = (strFreq, cand, wordInd, sol) => {
    sol.push(cand.word);
    console.log(sol);
    if (sol.length === arr.length) {
      return sol;
    }
    if (wordInd + 1 < arr.length) {
      const tempFreq = remover(strFreq, cand.word);
      return getCands(arr[wordInd + 1], tempFreq).reduce((acc, cand) => {
        let temp = findSols(tempFreq, cand, wordInd + 1, sol);
        if (temp !== undefined) {
          return acc.concat(...temp);
        }
      }, []);
    }
  };

  const arr = [...wordLens].sort().reverse();
  const strFreq = freq(str);
  return getCands(arr[0], strFreq).reduce((acc, cand) => {
    return acc.concat(findSols(strFreq, cand, 0, []));
  }, []);
};

let wordLengths = [1, 2, 1, 4];
let res = multi("iamaboss", wordLengths);
//res.sort((a, b) => a[0].localeCompare(b[0]));
//res.forEach((e) => console.log(origOrder(wordLengths, e)));
console.log(res[0]);
