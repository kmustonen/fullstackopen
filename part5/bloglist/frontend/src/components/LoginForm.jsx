import { Typography, TextField, Button } from '@mui/material'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({
  handleLogin
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const login = async event => {
    event.preventDefault()
    const success = await handleLogin({ username, password })
    if (success) navigate('/')
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>login</Typography>

      <form onSubmit={login}>
        <div><TextField label='username: ' value={username} onChange={({ target }) => setUsername(target.value)} style={{ marginTop: 10 }} variant="standard" /></div>
        <div><TextField label='password: ' value={password} onChange={({ target }) => setPassword(target.value)} style={{ marginTop: 10 }} variant="standard" /></div>

        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
      </form>
    </div>
  )
}

export default LoginForm