/* 
    Generate random numbers between the given min and max range.
*/
let generateRandomNumbers = (min, max, count) => {
    let numbers = [];
    min = Math.ceil(min);
    max = Math.floor(max);
    while (numbers.length < count) {
        var number = Math.floor(Math.random() * (max - min + 1)) + min;
        if (numbers.indexOf(number) === -1) numbers.push(number);
    }
    return numbers
}

module.exports = generateRandomNumbers;