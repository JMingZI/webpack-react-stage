import { combineReducers } from "redux"
import * as actions from "Component/actionTypes"

// Object.assign() 是 ES6的特性
// IE objectAssign
function todos(state = [], action) {
    switch (action.type) {
        case actions.ADD_TODO:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false
                }
            ];
        case actions.COMPLETE_TODO:
            return [
                ...state.slice(0, action.index),
                Object.assign({}, state[action.index], {
                    completed: true
                }),
                ...state.slice(action.index + 1)
            ];
        case actions.TOGGLE_TODO:
            return state.map((todo, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    })
                }
                return todo;
            });
        default:
            return state;
    }
}
function visibilityFilter(state = actions.VisibilityFilters.SHOW_ALL, action) {
    switch (action.type) {
        case actions.SET_VISIBILITY_FILTER:
            return action.filter;
        default: return state
    }
}
const todoapp = combineReducers({
    visibilityFilter, todos
});

export default todoapp;