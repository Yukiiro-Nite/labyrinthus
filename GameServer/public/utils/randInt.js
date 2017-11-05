function randInt(min=0, max) {
  if(max === undefined) {
    return randInt(0, min);
  } else {
    return Math.floor(Math.random() * (max-min))+min;
  }
}
