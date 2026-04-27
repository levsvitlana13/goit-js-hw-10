const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
      alert('Будь ласка, оберіть дату в майбутньому');
      document.querySelector('#start-btn').disabled = true;
    } else {
      userSelectedDate = selectedDate;
      document.querySelector('#start-btn').disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

const startBtn = document.querySelector('#start-btn');
const daysVal = document.querySelector('[data-days]');
const hoursVal = document.querySelector('[data-hours]');
const minsVal = document.querySelector('[data-minutes]');
const secsVal = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  document.querySelector('#datetime-picker').disabled = true;

  timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate - currentTime;

    if (deltaTime <= 0) {
      clearInterval(timerId);
      updateTimerInterface(0, 0, 0, 0);
      document.querySelector('#datetime-picker').disabled = false;
      return;
    }

    const time = convertMs(deltaTime);
    updateTimerInterface(time.days, time.hours, time.minutes, time.seconds);
  }, 1000);
});

function updateTimerInterface(d, h, m, s) {
  daysVal.textContent = String(d).padStart(2, '0');
  hoursVal.textContent = String(h).padStart(2, '0');
  minsVal.textContent = String(m).padStart(2, '0');
  secsVal.textContent = String(s).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
