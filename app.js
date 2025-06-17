const display = document.getElementById('display');
let current = '', previous = '', operator = null;

const update = () => display.textContent = current || '0';

document.querySelector('.buttons').addEventListener('click', ({ target: btn }) => {
  const val = btn.textContent;
  const action = btn.dataset.action;

  if (!action) {
    // Append number or dot
    if (val === '.' && current.includes('.')) return;
    current += val;
  } 
  else if (action === 'func') {
    // Advanced functions
    if (!current) return;
    const num = parseFloat(current);
    switch (btn.dataset.func) {
      case 'sqrt':
        current = num >= 0 ? Math.sqrt(num).toString() : 'Error';
        break;
      case 'square':
        current = Math.pow(num, 2).toString();
        break;
      case 'ln':
        current = num > 0 ? Math.log(num).toString() : 'Error';
        break;
      case 'exp':
        current = Math.exp(num).toString();
        break;
    }
  } 
  else switch (action) {
    case 'clear':
      current = previous = ''; operator = null;
      break;
    case 'delete':
      current = current.slice(0, -1);
      break;
    case 'operator':
      if (!current) return;
      if (previous) compute();
      operator = val.replace('×','*').replace('÷','/').replace('−','-');
      previous = current;
      current = '';
      break;
    case 'calculate':
      compute();
      break;
  }
  update();
});

function compute() {
  const a = parseFloat(previous), b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) return;
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b !== 0 ? a / b : 'Error'; break;
    case '%': result = a % b; break;
    default: return;
  }
  current = result.toString();
  operator = null;
  previous = '';
}

// Basic keyboard support
document.addEventListener('keydown', e => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    document.querySelector(`.buttons button:not([data-action])`)
           ?.textContent === e.key && document.querySelector(`.buttons button:contains("${e.key}")`)?.click();
  } else if (['+','-','*','/','%'].includes(e.key)) {
    document.querySelector(`.buttons button[data-action="operator"][data-key="${e.key}"]`)?.click();
  } else if (e.key === 'Backspace') {
    document.querySelector('[data-action="delete"]').click();
  } else if (e.key === 'Escape') {
    document.querySelector('[data-action="clear"]').click();
  } else if (e.key === 'Enter') {
    document.querySelector('[data-action="calculate"]').click();
  }
});
