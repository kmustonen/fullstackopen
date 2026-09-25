import { Alert } from '@mui/material'

const Notification = ({ message, status }) => {
  if (message === null) {
    return null
  }

  return <Alert severity={status}>{message}</Alert>
}

export default Notification