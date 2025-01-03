'use strict';

////-------------- Dummy Data ----------------////

const account1 = {
  owner: 'Sam Williams',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT"
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// ------------------------------------------------------------------------//


//----------------------- Elements --------------------------//

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

// ---------------------------------------------------------------------------


//--------- Displaying the Deposits and Withdrawals -----------

const displayMovements = function(acc, sort= false) {

  containerMovements.innerHTML = '';

  // Slice used bcz sort mutate Original Value 
  const movs = sort ? acc.movements.slice().sort((a, b) => a-b) : acc.movements;

  movs.forEach(function(mov, i) {
      const type = mov > 0 ? 'deposit' : 'withdrawal';

      const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${ i+1 } ${type}</div>
            <div class="movements__value">${mov.toFixed(2)}</div>
          </div>
          `;
      containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
// __________________________________________


//--------- Creating UserName in Data for login -----------

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]).join('');
  })
}
createUsernames(accounts)
// ___________________________________________


//--------- Displaying the Balance -----------

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, curVal) => acc + curVal, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} USD`;
}
// ____________________________________________



//--------- Displaying the Summary: Incomes,Outgoing, Interest -----------

const calcDisplaySummary = function(acc) {
  
    //______calculating incomes______//
    const incomes = acc.movements
      .filter(movs => movs > 0)
      .reduce((acc, curVal) => acc + curVal, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)} $`

    //_______calculating outgoing payments______//
    const out = acc.movements
      .filter(movs => movs < 0)
      .reduce((acc, curVal) => acc + curVal, 0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)} $`

    //_______calculating the interest Rate______//
    const interest = acc.movements
      .filter(movs => movs > 0)
      .map(deposit => (deposit * acc.interestRate)/100)
      .filter(int => int >=1 )
      .reduce((acc, curVal) => acc + curVal, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)} $`;
    
};
// ____________________________________________



//-------------- Event Listeners ---------------

let currentAccount;         //Global Variable

// Login Function
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)) {

    // Display UI and Message 
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity = 100;

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});
//_____________________________________________


//--------- Function for Update UI -----------

function updateUI (acc) {
    // Display movements
    displayMovements(acc)

    // Display Balance
    calcDisplayBalance(acc)

    // Display summary
    calcDisplaySummary(acc)
}
//_____________________________________________


// ------------ Transfer Money ----------------

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});
// _____________________________________________


//---------------- Loan Function ---------------

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // 'some' method Checks atleast 1 movement should be more than the 10% of loan Amount
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) { 

    //  Add movements 
     currentAccount.movements.push(amount);
     
    // Update UI
     updateUI(currentAccount)

    inputLoanAmount.value = '';
    }
});
// _____________________________________________


// --------------- Close Function ---------------

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if(
    inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    
    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';

  labelWelcome.textContent = `Log in to get started`
});
// _____________________________________________


// --------------- Sorting ------------------

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted)
  sorted = !sorted;
});
// _____________________________________________
