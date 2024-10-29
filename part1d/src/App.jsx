import { useState } from "react";

const Statistics = (props) => {

  const total = props.feedbacks[0].number + props.feedbacks[1].number + props.feedbacks[2].number
  const average = (props.feedbacks[0].number - props.feedbacks[1].number)/total
  const positive = props.feedbacks[0].number/total
  if(total != 0){
    return(
      <div>
      <Header name={props.title}/>
        <StatisticLine text={props.feedbacks[0].type} value={props.feedbacks[0].number}/> 
        <StatisticLine  text={props.feedbacks[1].type} value={props.feedbacks[1].number}/> 
        <StatisticLine  text={props.feedbacks[2].type} value={props.feedbacks[2].number}/> 
        <StatisticLine  text="all" value={total}/> 
        <StatisticLine  text="average" value={average}/> 
        <StatisticLine  text="positive" value={positive}/> 
      </div> 
    )   
  }
  return(
    <p>No feedback given</p>
  )
}

const Header = ({name}) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  )
}

const Button = ({name, onClick}) => {
  return(
      <button onClick={onClick}>
        {name}
      </button>
  )
}

const StatisticLine = ({text, value, sign}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {sign}</td>
    </tr>
  )
}


const App = () => {

  const name = "give feedback"
  const statistics = "statistics"
  
  const [good, setGood ] = useState(0)
  const [bad, setBad ] = useState(0)
  const [neutral, setNeutral] = useState(0)

  const feedbacks = [
    {
      type: "good",
      number: good
    },
    {
      type: "neutral",
      number: neutral
    },
    {
      type: "bad",
      number: bad
    }
  ]

  return (
    <div>
      <Header name={name} />
        <Button name="good" onClick={() => setGood(good + 1) }/>
        <Button name="neutral" onClick={() => setNeutral(neutral + 1)} />
        <Button name="bad" onClick={() => setBad(bad + 1)} />
      <Statistics title={statistics} feedbacks={feedbacks}/>
    </div>
  )
}

export default App;