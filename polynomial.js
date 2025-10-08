// biglagrange.js
const fs = require("fs");

// parse a string in given base (2..36) to BigInt without using Number
function parseBigIntInBase(str, base) {
  const b = BigInt(base);
  let res = 0n;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i].toLowerCase();
    let digit;
    if (ch >= '0' && ch <= '9') digit = BigInt(ch.charCodeAt(0) - 48);
    else digit = BigInt(ch.charCodeAt(0) - 87); // 'a' -> 10
    if (digit >= b) throw new Error(`digit >= base at ${ch}`);
    res = res * b + digit;
  }
  return res;
}

function lagrangeAtZero(points) {
  // points: array of [x(BigInt), y(BigInt)], using first k points
  const k = points.length;
  let total = 0n;

  for (let i = 0; i < k; i++) {
    const [xi, yi] = points[i];
    let num = 1n;
    let den = 1n;
    for (let j = 0; j < k; j++) {
      if (j === i) continue;
      const [xj] = points[j];
      num *= -xj;           // (0 - xj)
      den *= (xi - xj);     // (xi - xj)
    }
    // exact integer division expected in the final sum; use rational by dividing yi*num by den
    // but to keep everything in BigInt, compute term = yi * num / den (den divides the product)
    total += (yi * num) / den;
  }
  return total;
}

// read input
const data = JSON.parse(fs.readFileSync("input.json", "utf8"));

// iterate testcases
for (const tcName of Object.keys(data)) {
  const obj = data[tcName];
  const k = obj.keys.k;

  // collect and sort keys numerically, then take first k
  const keys = Object.keys(obj).filter(kf => kf !== "keys").map(s => parseInt(s)).sort((a,b)=>a-b);
  const pts = [];
  for (let idx = 0; idx < keys.length && pts.length < k; idx++) {
    const key = String(keys[idx]);
    const base = parseInt(obj[key].base, 10);
    const valueStr = obj[key].value;
    const y = parseBigIntInBase(valueStr, base);
    const x = BigInt(key);
    pts.push([x, y]);
  }

  const c = lagrangeAtZero(pts);
  console.log(`${tcName} constant c = ${c.toString()}`);
}
