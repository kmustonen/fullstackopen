const Header = ({ name }) => {
    return (
        <h2>{name}</h2>
    )
}

const Part = ({ part }) => {
    return (
        <li>
            {part.name} {part.exercises}
        </li>
    )
}

const Total = ({ total }) => {
    return (
        <b>total of {total} exercises</b>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Header name={course.name} />
            <ul>
                {course.parts.map(part =>
                    <Part key={part.id} part={part} />
                )}
            </ul>
            <Total total={course.parts.reduce((acc = 0, n) => acc + n.exercises, 0)} />
        </div>
    )
}

export default Course