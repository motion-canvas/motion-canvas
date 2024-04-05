function* countFrom(start) {
  let current = start;
  while (true) {
    yield current;
    current++;
  }
}

const iterator = countFrom(0);

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
