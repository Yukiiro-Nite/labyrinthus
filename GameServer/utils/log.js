const format = require('date-fns/format');

module.exports = function() {
  console.log(
    `[${format(new Date(), 'HH:mm:ss')}]`,
    ...arguments
  )
};