import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { client, SUPABASE_NOT_CONFIGURED_MESSAGE } from '../lib/supabase.js'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  number: '',
  address: '',
}

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    if (!client) {
      setMessage(SUPABASE_NOT_CONFIGURED_MESSAGE)
      return
    }
    setBusy(true)

    // 1) Create the auth user
    const { data, error } = await client.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { first_name: form.firstName } },
    })
    if (error) {
      setBusy(false)
      setMessage(error.message)
      return
    }

    // 2) Save the profile row.
    //    NOTE: the password is deliberately NOT stored here. Supabase Auth already
    //    keeps it (hashed); storing it in a normal table would be plain text.
    const { error: dbError } = await client.from('user_food').insert({
      uid: data.user?.id,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      number: form.number,
      address: form.address,
    })
    setBusy(false)

    if (dbError) {
      setMessage(dbError.message)
      return
    }

    setForm(EMPTY_FORM)
    alert('Account created successfully!')
    navigate('/')
  }

  return (
    <div className="auth-page">
      <PageHeader />

      <form className="form" onSubmit={handleSubmit}>
        <div className="container">
          <div className="row p-3 name text-lg-center">
            <div className="col-12 col-md-6 p-3">
              First Name:
              <input type="text" id="first_Name" value={form.firstName} onChange={update('firstName')} />
            </div>
            <div className="col-12 col-md-6 p-3">
              Last Name:
              <input type="text" id="last_Name" value={form.lastName} onChange={update('lastName')} />
            </div>
          </div>

          <div className="row p-3 email text-lg-center">
            <div className="col-12 col-md-6 p-3 mail">
              Email:
              <input type="email" id="email" value={form.email} onChange={update('email')} />
            </div>
            <div className="col-12 col-md-6 p-3 pass">
              Password:
              <input type="password" id="password" value={form.password} onChange={update('password')} />
            </div>
          </div>

          <div className="row p-3 number text-lg-center">
            <div className="col-12 col-md-6 p-3">
              Number:
              <input type="number" id="number" value={form.number} onChange={update('number')} />
            </div>
            <div className="col-12 col-md-6 p-3">
              Address:
              <input type="text" id="address" value={form.address} onChange={update('address')} />
            </div>
          </div>

          {message && <p className="text-center text-danger">{message}</p>}

          <div className="text-center mt-3 p-3">
            <button type="submit" className="col-9 col-md-4 col-lg-3" id="create_Account" disabled={busy}>
              {busy ? 'Creating…' : 'Create Account'}
            </button>
          </div>
          <div className="alreadyAccount text-center p-3">
            <Link to="/signin">Already have an Account!</Link>
          </div>
        </div>
      </form>
    </div>
  )
}
