import { MAX_QTY } from '../context/CartContext.jsx'

export default function QtyStepper({ value, onChange, min = 1, max = MAX_QTY, label = 'Quantity' }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <i className="fa-solid fa-minus" />
      </button>
      <span className="stepper-value" aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <i className="fa-solid fa-plus" />
      </button>
    </div>
  )
}
