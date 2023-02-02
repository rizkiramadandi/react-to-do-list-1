import { ACTIONS } from './App'
import './Todo.css'

export default function Todo({ todo, dispatch, index, isLast }) {
    return (
        <div className={'todo-container' + (todo.isComplete ? ' complete':'')} key={todo.id}>
            <div className='move-todo-container'>
                { index !== 0 ? (
                    <button onClick={() => dispatch({ type: ACTIONS.MOVE_TODO, payload: { index: index, step: -1 } })}>⬆</button>
                ) : (<></>) }
                { !isLast ? (
                    <button onClick={() => dispatch({ type: ACTIONS.MOVE_TODO, payload: { index: index, step: 1 } })}>⬇</button>
                ) : (<></>) }
            </div>
            <div>
                <input type="checkbox" defaultChecked={todo.isComplete} value={todo.isComplete} onChange={() => dispatch({ type: ACTIONS.TOGGLE_TODO, payload: { id: todo.id } })} />
            </div>
            <div className="todo">
                { todo.name }
            </div>
            <div className='action-todo-container'>
                <button onClick={() => confirm("Are you sure want to delete this to do?") ? dispatch({ type: ACTIONS.DELETE_TODO, payload: { id: todo.id } }) : null}>X</button>
            </div>
        </div>
    )
}