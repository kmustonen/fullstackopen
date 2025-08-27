import { useState } from 'react'

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = ((good * 1 - bad * 1) / (total));
  const positive = (`${(100 * good / total)}%`);

  return (
    <div>
      <h2>statistics</h2>
      {total !== 0 ?
        <>
          <table>
            <tbody>
              <StatisticsLine text="good" value={good} />
              <StatisticsLine text="neutral" value={neutral} />
              <StatisticsLine text="bad" value={bad} />
              <StatisticsLine text="average" value={average} />
              <StatisticsLine text="positive" value={positive} />
            </tbody>
          </table>
        </> :
        <p>No feedback given</p>}
    </div>
  )
}

const Button = ({ text, action }) => {
  return <button onClick={action}>{text}</button>
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <div>
        <h2>give feedback</h2>
        <Button text="good" action={handleGood} />
        <Button text="neutral" action={handleNeutral} />
        <Button text="bad" action={handleBad} />
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App