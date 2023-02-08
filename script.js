'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANK APP

// Data
const account1 = {
  owner: 'Martin Skutin',
  movements: [200, 450, -100, 3000, -350, -130, 70, 1300],
  interestRate: 1.2,
  pin: 'ms123',
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2023-01-11T23:36:17.929Z',
    '2023-01-30T10:51:36.790Z',
  ],
  locale: 'hr-HR',
};

const account2 = {
  owner: 'Pero Peric',
  movements: [4000, 3400, -1500, -790, -3210, -1000, 8500, -300],
  interestRate: 1.5,
  pin: 'pp123',
  movementsDates: [
    '2019-05-14T23:31:17.178Z',
    '2019-10-21T03:42:02.383Z',
    '2020-02-25T05:15:04.904Z',
    '2020-06-02T19:17:24.185Z',
    '2021-09-03T11:11:59.604Z',
    '2021-09-22T19:01:17.194Z',
    '2022-01-17T24:36:17.929Z',
    '2022-01-18T13:51:36.790Z',
  ],
  locale: 'hr-HR',
};

const account3 = {
  owner: 'Sara Saric',
  movements: [320, 1100, 800, 500, -90],
  interestRate: 1,
  pin: 'ss123',
  movementsDates: [
    '2020-11-21T22:31:17.178Z',
    '2020-11-24T03:42:02.383Z',
    '2021-03-27T06:15:04.904Z',
    '2021-08-02T11:17:24.185Z',
    '2021-08-04T16:11:59.604Z',
  ],
  locale: 'hr-HR',
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${day}/${month}/${year}`;

    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcSummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  calcBalance(acc);
  calcSummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //na svaki poziv, prikaži preostalo vrijeme
    labelTimer.textContent = `${min}:${sec}`;

    //kada dođe do 0, zaustavi timer i odjavi korisnika
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to your Bank Account';
      containerApp.style.opacity = 0;
    }

    // smanji jednu sekundu
    time--;
  };
  //Postavi timer na 5 min
  let time = 300;
  //pozovi ga svaku sekundu
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currAcc, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currAcc?.pin === inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${currAcc.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    updateUI(currAcc);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currAcc.balance >= amount &&
    recieveAcc?.username !== currAcc.username
  ) {
    currAcc.movements.push(-amount);
    recieveAcc.movements.push(amount);

    currAcc.movementsDates.push(new Date().toISOString());
    recieveAcc.movementsDates.push(new Date().toISOString());

    updateUI(currAcc);

    // resetiraj timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floar(inputLoanAmount.value);

  if (amount > 0 && currAcc.movements.some(mov => mov >= amount * 0.1)) {
    currAcc.movements.push(amount);

    currAcc.movementsDates.push(new Date().toISOString());

    updateUI(currAcc);
    // resetiraj timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currAcc.username === inputCloseUsername.value &&
    currAcc.pin === inputClosePin.value
  ) {
    const index = accounts.findIndex(acc => acc.username === currAcc.username);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currAcc, !sorted);
  sorted = !sorted;
});
