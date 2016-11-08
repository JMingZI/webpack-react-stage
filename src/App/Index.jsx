import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AddTodo from 'Component/AddTodo';
import TodoList from 'Component/TodoList';
import Footer from 'Component/Footer';
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from 'Component/actionTypes';

class Index extends Component {
    render() {
        const { dispatch, visibleTodos, visibilityFilter } = this.props;
        return (
            <div>
                <AddTodo onAddClick={text => dispatch(addTodo(text))} />
                <TodoList todos={visibleTodos}
                    onTodoClick={index => dispatch(completeTodo(index))} />
                <Footer filter={visibilityFilter}
                    onFilterChange={nextFilter => dispatch(setVisibilityFilter(nextFilter))} />
            </div>
        );
    }
}

function selectTodos(todos, filter) {
    switch (filter) {
        case VisibilityFilters.SHOW_ALL:
            return todos;
        case VisibilityFilters.SHOW_COMPLETED:
            return todos.filter(todo => todo.completed);
        case VisibilityFilters.SHOW_ACTIVE:
            return todos.filter(todo => !todo.completed);
    }
}
function select(state) {
    return {
        visibleTodos: selectTodos(state.todos, state.visibilityFilter),
        visibilityFilter: state.visibilityFilter
    }
}
export default connect(select)(Index);