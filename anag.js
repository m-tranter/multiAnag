const strInput = document.getElementById("strInput");
const patternInput = document.getElementById("patternInput");
const lengthsInput = document.getElementById("lengthsInput");
const myBtn = document.getElementById("goBtn");
const display = document.getElementById("display");

// Put a solution in the order supplied by user.
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

// Create an HTML list to display.
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

// Returns an H2.
const makeH2 = (str) => {
  const h2 = document.createElement("h2");
  h2.innerText = str;
  return h2;
};

// Main function - processes inputs and displays results.
const findWords = () => {
  display.innerHTML = "";
  const str = strInput.value.replace(/[^A-Za-z\s]/g, "").toLowerCase();
  const pattern = patternInput.value
    .toLowerCase()
    .replace(/\s/g, "")
    .split(",");
  let lengths = lengthsInput.value.split(",").map((e) => parseInt(e));
  let info;
  // Can't proceed without letters to process.
  if (!str.length) {
    display.appendChild(makeH2("Please enter some letters."));
    return;
  }
  // Catches errors in the lengths field.
  // Default to looking for one word answers.
  if (lengths.some((e) => isNaN(e))) {
    lengths = [str.length];
    info = [{ len: str.length, pattern: "" }];
  } else {
    // Make the array of objects made of lengths & patterns.
    info = processPatterns(lengths, pattern);
    info.sort(compare);
  }

  display.appendChild(makeH2("Working."));
  setTimeout(() => {
    const res = multi(str, info).reduce((acc, sol) => {
      acc.push(origOrder(lengths, sol));
      return acc;
    }, []);
    display.innerHTML = "";
    display.appendChild(res.length ? makeList(res) : makeH2("Nothing found."));
  }, 0);
};

const sumArr = (arr) => arr.reduce((acc, v) => acc + v);

const sumLens = (arr) => arr.reduce((acc, w) => acc + w.length, 0);

// Make array of objects with lengths & patterns.
const processPatterns = (wordLengths, pattern) => {
  if (sumLens(pattern) !== sumArr(wordLengths)) {
    pattern = Array(wordLengths.length).fill("");
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

// Order by length of pattern (if supplied) & then length of word.
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

// Create a frequency table for a string.
const freq = (word) => {
  return Array.from(word).reduce((f, ch) => {
    f[ch] = f[ch] ? f[ch] + 1 : 1;
    return f;
  }, {});
};

// Reduce frequency counts for all letters in word.
const remover = (freq, word) => {
  return Array.from(word).reduce(
    (f, ch) => {
      f[ch] -= 1;
      return f;
    },
    { ...freq }
  );
};

// Returns a function that takes one argument.
// It checks if the input is a match for the pattern supplied here.
const isMatch = (pattern) => {
  const re = new RegExp(`${pattern.replace(/\?/g, ".")}`);
  return (word) => word.match(re) !== null;
};

// Tests if the candidate is a substring of the frequency passed.
const isSubString = (origFreq, candFreq) => {
  return Object.keys(candFreq).every((k) => origFreq[k] >= candFreq[k]);
};

// Looks recursively through the dictionary for matches.
const multi = (str, arr) => {
  // Returns a list of words that match.
  const getCands = (obj, strFreq) => {
    if (obj.pattern.length > 0) {
      return dictionary[obj.len - 1].filter(
        (e) => isSubString(strFreq, e.f) && isMatch(obj.pattern)(e.word)
      );
    }
    return dictionary[obj.len - 1].filter((e) => isSubString(strFreq, e.f));
  };

  // This gets called recursively. Builds up solutions.
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
