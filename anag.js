const strInput = document.getElementById("strInput");
const patternInput = document.getElementById("patternInput");
const lengthsInput = document.getElementById("lengthsInput");
const myBtn = document.getElementById("goBtn");
const display = document.getElementById("display");

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

const makeList = (array) => {
  const list = document.createElement("ul");
  list.classList.add("list-unstyled");
  array.forEach((e) => {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(e));
    list.appendChild(item);
  });
  return list;
};

const makeH2 = (str) => {
  const h2 = document.createElement("h2");
  h2.innerText = str;
  return h2;
};

const findWords = () => {
  let str = strInput.value.toLowerCase().replace(/\s/g, "");
  let pattern = patternInput.value.split(",");
  let lengths;
  let info;
  lengths = lengthsInput.value.split(",").map((e) => parseInt(e));
  if (str.length === 0) {
    display.appendChild(makeH2("Please enter some letters."));
    return;
  }
  if (isNaN(lengths[0])) {
    lengths = [str.length];
    info = [{ len: str.length, pattern: "" }];
  } else {
    info = processPatterns(lengths, pattern);
    info.sort(compare);
  }

  display.appendChild(makeH2("Working."));
  setTimeout(() => {
    const res = multi(str, info).reduce((acc, sol) => {
      acc.push(origOrder(lengths, sol));
      return acc;
    }, []);
    res.sort();
    display.innerHTML = "";
    display.appendChild(res.length ? makeList(res) : makeH2("Nothing found."));
  }, 0);
};

const sumArr = (arr) => arr.reduce((acc, v) => acc + v);

const sumLens = (arr) => arr.reduce((acc, w) => acc + w.length, 0);

const processPatterns = (wordLengths, pattern) => {
  if (sumLens(pattern) !== sumArr(wordLengths)) {
    return wordLengths.reduce((acc, v) => {
      acc.push({
        len: v,
        pattern: "",
      });
      return acc;
    }, []);
  }
  return wordLengths.reduce((acc, v, i) => {
    acc.push({
      len: v,
      pattern: Array.from(pattern[i]).every((ch) => ch === "?")
        ? ""
        : pattern[i],
    });
    return acc;
  }, []);
};

const compare = (a, b) => {
  if (a.pattern.length > b.pattern.length) {
    return -1;
  }
  if (a.pattern.length < b.pattern.length) {
    return 1;
  }
  if (a.len > b.len) {
    return -1;
  }
  if (a.len < b.len) {
    return 1;
  }
  return 0;
};
const freq = (word) => {
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

const isMatch = (pattern, word) => {
  const re = new RegExp(`${pattern.replace(/\?/g, ".")}`);
  return word.match(re) !== null;
};

const isSubString = (origFreq, candFreq) => {
  return Object.keys(candFreq).every((k) => origFreq[k] >= candFreq[k]);
};

const multi = (str, arr) => {
  const getCands = (obj, strFreq) => {
    if (obj.pattern.length > 0) {
      return dictionary[obj.len - 1].filter(
        (e) => isSubString(strFreq, e.f) && isMatch(obj.pattern, e.word)
      );
    }
    return dictionary[obj.len - 1].filter((e) => isSubString(strFreq, e.f));
  };

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

  const sols = [];
  const strFreq = freq(str);
  findSols(strFreq, getCands(arr[0], strFreq), 0, 1, []);
  sols.sort((a, b) => a[0].localeCompare(b[0]));
  return sols;
};

myBtn.addEventListener("click", findWords);
