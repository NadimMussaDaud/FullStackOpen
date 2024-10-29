const Course = (props) => {
    return (
      <div>
        <Header name={props.course.name}/>
        <Content parts={props.course.parts}/>
        <Total number={props.course.parts}/>
      </div>
    )
  }
  
  const Part = ({title, number}) => {
    return (
      <div>
        <p>{title} {number}</p>
      </div>
    )
  }
  
  const Header = ({name}) => {
    return (
      <div>
        <h2>{name}</h2>
      </div>
    )
  }
  
  const Total = ({number}) => {
    const total = number.reduce((sum, num) => sum + num.exercises, 0)
  
    return (
      <div>
        <b>total of {total} exercises</b>
      </div>
    )
  }
  
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => <Part title={part.name} number={part.exercises}/>)}
      </div>
    )
  }

  export default Course