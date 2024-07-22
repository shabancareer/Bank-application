const account1 = {
  name: "Shaban Ali",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  intersRate: 3.2,
  pin: 1111,
};
const account2 = {
  name: "Ali Raza",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  intersRate: 1.25,
  pin: 2222,
};
const account3 = {
  name: "Ahmad Hassan",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  intersRate: 0.72,
  pin: 3333,
};
const account4 = {
  name: "Raza Ali",
  movements: [430, 1000, 700, 50, 90],
  intersRate: 0.35,
  pin: 4444,
};
const account5 = {
  name: "Raza Ahmad Ali",
  movements: [800, 45, -380, 3040, -6501, -1306, 708, 71300],
  intersRate: 0.4,
  pin: 5555,
};
const accounts = [account1, account2, account3, account4, account5];

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const now = new Date();
const options = {
  hours: "numeric",
  mintues: "numeric",
  day: "numeric",
  month: "long",
  year: "2-digit",
};
const fullDate = new Intl.DateTimeFormat("en-US", options).format(now);

labelDate.textContent = fullDate;

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date"> ${fullDate}</div>
    <div class="movements__value">${mov.toFixed(2)} €</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (accs) {
  accs.balance = accs.movements.reduce((accs, mov) => accs + mov, 0);
  labelBalance.textContent = `${accs.balance.toFixed(2)}€`;
};
const updateUI = function (acc) {
  // Display movements
  displayMovements(currentAccount.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.name
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const calcDisplaySummary = function (accs) {
  const incomes = accs.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const expenses = accs.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;
  labelSumOut.textContent = `${Math.abs(expenses.toFixed(2))} €`;

  const interest = accs.movements
    .filter((mov) => mov > 0)
    .map((des) => (des * 1.2) / 100)
    .filter((int) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0)
    .toFixed(2);

  labelSumInterest.textContent = `${interest} €`;
};

const startDisplayTimer = function () {
  const tick = function () {
    const sec = String(Math.trunc(time / 60)).padStart(2, 0);
    const min = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Login to get Start";
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome ${currentAccount.name.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startDisplayTimer();
    updateUI(currentAccount);

    // displayMovements(currentAccount.movements);
    // calcDisplaySummary(currentAccount);
    // calcDisplayBalance(currentAccount);
  }
});
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance > amount &&
    currentAccount.userName !== receiverAcc
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // currentAccount.movementsDates.push(new Date());
    // receiverAcc.movements.push(new Date());
  }
  updateUI(currentAccount);
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amountLoan = Math.floor(inputLoanAmount.value);
  if (
    amountLoan > 0 &&
    currentAccount.movements.some((mov) => mov >= amountLoan * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amountLoan);
      updateUI(currentAccount);
    }, 2500);
    inputLoanAmount.value = "";
  }
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener("click", function () {
  [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
    if (i % 2 === 0) {
      row.style.backgroundColor = "#90EE90";
    } else {
      row.style.backgroundColor = "#C4A484";
    }
  });
});

//const inputCloseUsername = document.querySelector(".form__input--user");
// const inputClosePin = document.querySelector(".form__input--pin");

// const nestedArray = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];

// function processNestedArray(nestedArray) {
//   console.log(nestedArray.length, "nestedArraynestedArray");
//   for (let i = 0; i < nestedArray.length; i++) {
//     for (let j = 0; j < nestedArray[i].length; j++) {
//       console.log(`Element at row ${i} and column ${j}: ${nestedArray[i][j]}`);
//     }
//   }
// }
// processNestedArray(nestedArray);
// console.log(processNestedArray());

// const JuliaDogs = [3, 5, 2, 12, 7];
// const kateDogs = [9, 16, 6, 8, 3];

// const checkDogs = function (Julia, Kate) {
//   const JuliaCorrectData = Julia.slice();
//   JuliaCorrectData.splice(0, 1);
//   JuliaCorrectData.splice(-2);
//   const dogs = JuliaCorrectData.concat(Kate);
//   dogs.forEach(function (v, i) {
//     if (v >= 3)
//       console.log(`Dog + ${i + 1} is an adult, and is ${v} years old`);
//     // console.log(dogs);
//   });

//   const calcAverageHumanAge = function (dogs) {
//     const dogAge = dogs.filter(function (a) {
//       return a <= 2 && a >= 2;
//     });
//     console.log(
//       `There are ${dogAge} dogs age less then 2 & Human age ${dogAge * 2}`
//     );
//     console.log(
//       `There are ${dogAge} dogs age Old then 2 & Human age ${dogAge * 4 + 16}`
// );
// const humanAge = dogAge * 4 + 16;
// const oldDog = humanAge.map(function (a) {
//   return a >= 18;
// });

// const humanAge = dogAge * 4 + 16;
// const oldDog = humanAge >= 18;

// console.log(oldDog);
//   };
//   calcAverageHumanAge(dogs);
//   const avgAge = dogs.reduce(
//     function (acc, elm) {
//       return acc + (elm / dogs.length) * 100;
//     },
//     [0]
//   );

//   console.log(oldDog, "Old");
// };

// checkDogs([3, 5, 2, 12, 7], [9, 16, 6, 8, 3]);

// const userName = "Muhammad Shaban Ali";

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

// const calcAverageHumanAge = function (age) {
//   const humanAges = age.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAges.filter((age) => age >= 18);
//   const average = adults.reduce((acc, age) => acc + age / adults.length, 0);
//   return average;
// };
// const agv1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const agv2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(agv1, agv2);

// const x = [1, 2, 3, 5];
// x.forEach((e) => {
//   if (e < 3 || e === 5) return;
//   console.log(e);
// });
// console.log(accounts);
// const depositMony1 = accounts.map(acc => acc.movements){
// };
// console.log(depositMony1);
// const nestedArray = [1, [2, 3], [4, [5, 6]]];

// const flattenedArray = nestedArray.flat(2);

// console.log(flattenedArray);
// const movs = account1.movements;
// console.log(movs);

// const overAll = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overAll);

// const overAll = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overAll);

// const bankDespoitBlance1 = accounts
//   .flatMap((el) => el.movements)
//   .filter((el) => el > 0)
//   .reduce((acc, el) => acc + el, 0);

// console.log(bankDespoitBlance1);

// const sums = accounts
//   .flatMap((el) => el.movements)
//   .reduce(
//     (acc, el) => {
//       el > 0 ? (acc.deposits += el) : (acc.withdrawals += el);
//       return sums;
//     },
//     {
//       deposits: 0,
//       withdrawals: 0,
//     }
//   );

// const { deposits, withdrawals } = accounts
//   .flatMap((el) => el.movements)
//   .reduce(
//     (acc, el) => {
//       // el > 0 ? (acc.deposits += el) : (acc.withdrawals += el);
//       acc[el > 0 ? "deposits" : "withdrawals"] += el;
//       return acc;
//     },
//     {
//       deposits: 0,
//       withdrawals: 0,
//     }
//   );

// console.log(deposits, withdrawals);
// console.log(2 ** 53 + 9);
