import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const daysVal = document.querySelector('[data-days]');
const hoursVal = document.querySelector('[data-hours]');
const minsVal = document.querySelector('[data-minutes]');
const secsVal = document.querySelector('[data-seconds]');

let selectedDate = null;
let timerId = null;

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  minuteIncrement: 1,

  onClose(selectedDates) {
    const date = selectedDates[0];
    const now = Date.now();

    if (!date || date <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a future date',
        position: 'topRight',
      });

      startBtn.disabled = true;
      selectedDate = null;
      return;
    }

    selectedDate = date;
    startBtn.disabled = false;
  },
});

startBtn.addEventListener('click', () => {
  if (!selectedDate) return;

  clearInterval(timerId);

  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const now = Date.now();
    const diff = selectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateUI(0, 0, 0, 0);

      input.disabled = false;
      startBtn.disabled = true;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);
    updateUI(days, hours, minutes, seconds);
  }, 1000);
});

function updateUI(days, hours, minutes, seconds) {
  daysVal.textContent = format(days);
  hoursVal.textContent = format(hours);
  minsVal.textContent = format(minutes);
  secsVal.textContent = format(seconds);
}

function format(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}
