import { useState } from 'react'

const LoginForm = ({
   handleLogin
  }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async event => {
    event.preventDefault()
    handleLogin({username, password})
  }

  return (
    <div>
      <h2>login</h2>

      <form onSubmit={login}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm