import { useState } from 'react'
import { addReservation } from '../lib/storage.js'
import { isEmail, isPhone, todayISO } from '../lib/validate.js'
import { useToast } from '../context/ToastContext.jsx'
import Reveal from './Reveal.jsx'

// Opening hours are 9:00 AM – 1:00 PM, so the last seating is 12:30 PM.
const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']
const slotLabel = (t) => {
  const [h, m] = t.split(':').map(Number)
  return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

const EMPTY = { name: '', phone: '', email: '', persons: '2', date: '', time: '', notes: '' }

function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Please enter your name'
  if (!isPhone(form.phone)) errors.phone = 'Enter a valid phone number'
  if (!isEmail(form.email)) errors.email = 'Enter a valid email address'
  if (!form.date) errors.date = 'Choose a date'
  else if (form.date < todayISO()) errors.date = 'Date cannot be in the past'
  if (!form.time) errors.time = 'Choose a time'
  return errors
}

export default function BookTable() {
  const toast = useToast()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return

    addReservation({
      id: `TB-${Date.now().toString(36).toUpperCase()}`,
      ...form,
      name: form.name.trim(),
      createdAt: new Date().toISOString(),
    })
    toast.success(`Table booked for ${form.persons} on ${form.date} at ${slotLabel(form.time)}`)
    setForm(EMPTY)
  }

  return (
    <div className="container">
      <div className="book-grid">
        <Reveal className="book-card">
          <span className="eyebrow">Reservations</span>
          <h2 className="section-title">Book a <em>table</em></h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="bk-name">Your name</label>
                <input id="bk-name" className="input" type="text" placeholder="Full name" value={form.name} onChange={set('name')} aria-invalid={Boolean(errors.name)} />
                {errors.name && <small className="field-error">{errors.name}</small>}
              </div>
              <div className="field">
                <label htmlFor="bk-phone">Phone number</label>
                <input id="bk-phone" className="input" type="tel" placeholder="+92 300 1234567" value={form.phone} onChange={set('phone')} aria-invalid={Boolean(errors.phone)} />
                {errors.phone && <small className="field-error">{errors.phone}</small>}
              </div>
              <div className="field full">
                <label htmlFor="bk-email">Email</label>
                <input id="bk-email" className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} aria-invalid={Boolean(errors.email)} />
                {errors.email && <small className="field-error">{errors.email}</small>}
              </div>
              <div className="field">
                <label htmlFor="bk-persons">Guests</label>
                <select id="bk-persons" className="input" value={form.persons} onChange={set('persons')}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="bk-date">Date</label>
                <input id="bk-date" className="input" type="date" min={todayISO()} value={form.date} onChange={set('date')} aria-invalid={Boolean(errors.date)} />
                {errors.date && <small className="field-error">{errors.date}</small>}
              </div>
              <div className="field full">
                <label htmlFor="bk-time">Time</label>
                <select id="bk-time" className="input" value={form.time} onChange={set('time')} aria-invalid={Boolean(errors.time)}>
                  <option value="">Select a time</option>
                  {SLOTS.map((s) => (
                    <option key={s} value={s}>{slotLabel(s)}</option>
                  ))}
                </select>
                {errors.time && <small className="field-error">{errors.time}</small>}
              </div>
              <div className="field full">
                <label htmlFor="bk-notes">Special requests <span className="optional">(optional)</span></label>
                <textarea id="bk-notes" className="input" rows="3" placeholder="Birthday, high chair, allergies…" value={form.notes} onChange={set('notes')} />
              </div>
            </div>

            <button type="submit" className="pbtn pbtn-gold pbtn-block">
              Book my table <i className="fa-solid fa-arrow-right" />
            </button>
          </form>
        </Reveal>

        <Reveal className="map-card" delay={120}>
          <iframe
            title="Restaurant location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d83108.82463985033!2d67.043328!3d24.8643584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1777389545365!5m2!1sen!2s"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </div>
  )
}
