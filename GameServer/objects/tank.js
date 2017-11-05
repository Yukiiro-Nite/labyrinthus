module.exports = function ({size}) {
  this.size = size;
  let inventory = [];

  function findElementType(type) {
    return inventory.find( element => element.type === type);
  }

  this.getStoredAmount = (type) => {
    return inventory
      .filter(el => type ? type === el.type : true)
      .reduce((acc, el) => {
        acc += el.amount;
        return acc;
      }, 0);
  };

  this.put = (element => {
    let storedAmount = this.getStoredAmount();
    if(storedAmount + element.amount < this.size) {
      inventory.push(Object.assign({}, element));
      element.amount = 0;
      return element;
    } else if(storedAmount < this.size){
      let amountDifference = this.size - storedAmount;
      let elementToAdd = Object.assign({}, element);

      elementToAdd.amount = amountDifference;
      inventory.push(elementToAdd);

      element.amount -= amountDifference;
      return element;
    } else {
      return element;
    }
  });

  this.take = (({type, amount}) => {
    let result = {type, amount: 0};

    //todo: loop over inventory, reducing the amount of elements and removing elements with zero amount

    return result;
  });
};
