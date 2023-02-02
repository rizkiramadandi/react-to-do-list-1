import { useReducer, useState, useEffect, useMemo } from 'react'
import Todo from './Todo'
import './App.css'

const LOCAL_STORAGE_KEY = 'rizkiramadandi.reacttodolistreducer'

export const ACTIONS = {
  ADD_TODO: 'add-todo',
  DELETE_TODO: 'delete-todo',
  TOGGLE_TODO: 'toggle-todo',
  OVERWRITE_TODO: 'overwrite-todo',
  MOVE_TODO: 'move-todo',
  DELETE_TODOS: 'delete-todos',
  DELETE_COMPLETED_TODOS: 'delete-completed-todos'
}

function reducer(todos, action) {
  switch(action.type) {
    case ACTIONS.ADD_TODO:
      return [...todos, { id: new Date().getTime(), name: action.payload.name, isComplete: false }]
    case ACTIONS.DELETE_TODO:
      return todos.filter(todo => todo.id !== action.payload.id)
    case ACTIONS.TOGGLE_TODO:
      return todos.map(todo => {
        if(todo.id === action.payload.id) {
          // return todo yang sudah ditoggle jika id todo sama dengan target
          return { ...todo, isComplete: !todo.isComplete }
        }

        // return todo default jika id todo tidak sama
        return todo
      })
    case ACTIONS.OVERWRITE_TODO:
      return action.payload.todos
    case ACTIONS.MOVE_TODO:
      const currentIndex = action.payload.index
      const step = action.payload.step
      const temp = todos[currentIndex]
      todos[currentIndex] = todos[currentIndex+step]
      todos[currentIndex+step] = temp
      return [ ...todos ]
    case ACTIONS.DELETE_TODOS:
      return []
    case ACTIONS.DELETE_COMPLETED_TODOS:
      return todos.filter(todo => !todo.isComplete)
    default:
      return todos
  }
}

function App() {
  const [todos, dispatch] = useReducer(reducer, [{id: new Date().getTime(), name: 'Learn React.js', isComplete: false}])
  const [name, setName] = useState('')
  const [isCompleteHidden, setIsCompleteHidden] = useState(false)
  const filteredTodos = useMemo(() => {
    return isCompleteHidden ? todos.filter(todo => !todo.isComplete) : todos
  }, [todos, isCompleteHidden])
  const percentage = useMemo(() => {
    return Math.floor((todos.filter(todo => todo.isComplete).length / todos.length) * 100)
  }, [todos, isCompleteHidden])

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if(storedTodos) dispatch({ type: ACTIONS.OVERWRITE_TODO, payload: { todos: storedTodos } })
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function handleSubmit(e) {
    e.preventDefault()
    if(name === '') return
    dispatch({ type: ACTIONS.ADD_TODO, payload: { name: name } })
    setName('')
  }

  return (
    <div className="container">
      <h1>REACT.JS TO DO LIST APP</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your to do here" />
        <div className="input-help">
          Press enter to add your to do to the list
        </div>
      </form>
      <div>
        {filteredTodos.map((todo, index) => {
          return (
            <Todo todo={todo} index={index} isLast={index === todos.length - 1} dispatch={dispatch} />
          )
        })}
      </div>
      {todos.length > 0 ? (
        <div>
          <div>
            <div className='progress-bar'>
              <div className='progress-bar-progress' style={{ width: percentage + '%' }}></div>
              <div className='progress-bar-text'>
                <b>{todos.filter(todo => todo.isComplete).length}</b> of <b>{todos.length}</b> task(s) completed (<b>{percentage}%</b> completed)
              </div>
            </div>
          </div>

          <div className='action-button-container'>
            <div>
              <button className='button' onClick={() => setIsCompleteHidden(prev => !prev)}>Toggle Complete?</button>
            </div>
            <div>
              <button className='button button-danger' onClick={() => confirm("Are you sure want to delete all to dos?") ? dispatch({ type: ACTIONS.DELETE_TODOS }) : null}>Delete All?</button>
            </div>
            <div>
              <button className='button button-danger' onClick={() => confirm("Are you sure want to delete all completed to dos?") ? dispatch({ type: ACTIONS.DELETE_COMPLETED_TODOS }) : null}>Delete All Completed To Dos?</button>
            </div>
          </div>
        </div>
        ) : (<></>)}
    </div>
  )
}

export default App
