import './style.css';
const topBar = document.getElementById('top-bar');
const exteriorColorsContainer = document.getElementById('exterior-buttons');
const interiorColorsContainer = document.getElementById('interior-buttons');
const exteriorImg = document.getElementById('exterior-img');
const interiorImg = document.getElementById('interior-img');
const wheelsBtnSection = document.getElementById('wheels-buttons');
const performancePackageBtn = document.getElementById('preformance-package');
const fullSelfDriving = document.getElementById('full-self-drive');
const accessoryCheckBoxes = document.querySelectorAll(
  '.accessory-form-checkbox'
);

const downPaymentEl = document.getElementById('down-payment');
const monthlyPaymentEl = document.getElementById('monthly-payment');
const totalPriceEl = document.getElementById('total');

const basePrice = 52490;
let currentPrice = basePrice;

let ticking = false;

let selectedColors = 'Stealth_Gray';
const selectedOptions = {
  performance_wheels: false,
  self_driving: false,
  performance_package: false,
};

const pricing = {
  performance_wheels: 2500,
  self_driving: 8500,
  performance_package: 5000,
  accessories: {
    'Center Console Trays': 35,
    Sunshade: 105,
    'All-Weather Interior Liners': 225,
  },
};

function updateTotalPrice() {
  currentPrice = basePrice;

  if (selectedOptions.performance_wheels) {
    currentPrice += pricing.performance_wheels;
  }

  if (selectedOptions.performance_package) {
    currentPrice += pricing.performance_package;
  }

  if (selectedOptions.self_driving) {
    currentPrice += pricing.self_driving;
  }

  accessoryCheckBoxes.forEach((checkbox) => {
    const label = checkbox.parentElement.parentElement
      .querySelector('span')
      .textContent.trim();

    const accessoryPrice = pricing.accessories[label];

    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });

  totalPriceEl.innerText = `$${currentPrice.toLocaleString()}`;
  updatePaymentBreakDown();
}

function updatePaymentBreakDown() {
  const downPayment = currentPrice * 0.1;
  downPaymentEl.innerText = `$${Number(
    downPayment.toFixed(2)
  ).toLocaleString()}`;

  const interestRate = 0.03; // 3% annual
  const loanMonths = 60;
  const loanAmount = currentPrice - downPayment;
  const monthlyInterestRate = interestRate / 12;

  const numerator =
    loanAmount *
    monthlyInterestRate *
    Math.pow(1 + monthlyInterestRate, loanMonths);

  const denominator = Math.pow(1 + monthlyInterestRate, loanMonths) - 1;

  const monthlyPayment = numerator / denominator;

  monthlyPaymentEl.innerText = `$${Number(
    monthlyPayment.toFixed(2)
  ).toLocaleString()}`;
}

const exteriorImgs = {
  Stealth_Gray: '/images/model-y-stealth-grey.jpg',
  Pearl_White: '/images/model-y-pearl-white.jpg',
  Deep_Blue: '/images/model-y-deep-blue-metallic.jpg',
  Dark: '/images/model-y-solid-black.jpg',
  Ultra_Red: '/images/model-y-ultra-red.jpg',
  Quick_Silver: '/images/model-y-quicksilver.jpg',
};

const interiorImgs = {
  Dark: '/images/model-y-interior-dark.jpg',
  light: '/images/model-y-interior-light.jpg',
};

function handleScroll() {
  window.scrollY > 15
    ? topBar.classList.add('-translate-y-full')
    : topBar.classList.remove('-translate-y-full');
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(handleScroll);
    ticking = true;
  }
}

function handleBtnClick(e) {
  let button;
  if (e.target.tagName === 'IMG') {
    button = e.target.closest('button');
  } else if (e.target.tagName === 'BUTTON') {
    button = e.target;
  }

  if (button) {
    const buttons = e.currentTarget.querySelectorAll('button');
    buttons.forEach((btn) => btn.classList.remove('btn-selected'));
    button.classList.add('btn-selected');
  }

  // Change exterior
  if (e.currentTarget === exteriorColorsContainer) {
    selectedColors = button.querySelector('img').alt;
    updateExteriorImg();
  }

  // Change interior
  if (e.currentTarget === interiorColorsContainer) {
    const color = button.querySelector('img').alt;
    interiorImg.src = interiorImgs[color];
  }
}

function updateExteriorImg() {
  const performanceSuffix = selectedOptions.performance_wheels
    ? '-performance'
    : '';
  const colorKey =
    selectedColors in exteriorImgs ? selectedColors : 'Stealth_Grey';
  exteriorImg.src = exteriorImgs[colorKey].replace(
    '.jpg',
    `${performanceSuffix}.jpg`
  );
}

function handleWheelBtnClick(e) {
  if (e.target.tagName === 'BUTTON') {
    const buttons = document.querySelectorAll('#wheels-buttons button');
    buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));
    e.target.classList.add('bg-gray-700', 'text-white');

    selectedOptions.performance_wheels =
      e.target.innerText.includes('Performance');

    updateExteriorImg();
    updateTotalPrice();
  }
}

function handlePerformanceBtnClick() {
  const isSelected = performancePackageBtn.classList.toggle('bg-gray-700');
  performancePackageBtn.classList.toggle('text-white');

  selectedOptions.performance_package = isSelected;
  updateTotalPrice();
}

function handleSelfDrivingCheck() {
  const isSelected = fullSelfDriving.checked;
  selectedOptions.self_driving = isSelected;
  updateTotalPrice();
}

accessoryCheckBoxes.forEach((checkbox) => {
  checkbox.addEventListener('click', () => updateTotalPrice());
});

function init() {
  window.addEventListener('scroll', onScroll);
  exteriorColorsContainer.addEventListener('click', handleBtnClick);
  interiorColorsContainer.addEventListener('click', handleBtnClick);
  wheelsBtnSection.addEventListener('click', handleWheelBtnClick);
  performancePackageBtn.addEventListener('click', handlePerformanceBtnClick);
  fullSelfDriving.addEventListener('change', handleSelfDrivingCheck);
  updateTotalPrice();
}

document.addEventListener('DOMContentLoaded', init);
