import React, { Component, PropTypes } from 'react';

export default class TodoList extends Component {
    render() {
        return (
            <ul>
                {
                    this.props.todos.map((todo, index) => {
                        return (
                            <li key={index} onClick={e => this.props.onTodoClick(index)}
                                style={{
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    cursor: todo.completed ? 'default' : 'pointer'
                                }}>
                                {todo.text}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
    handle (index) {
        this.props.onTodoClick(index)
    }
}
