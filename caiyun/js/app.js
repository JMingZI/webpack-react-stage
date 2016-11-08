webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(35);

	var _reactRouter = __webpack_require__(173);

	var _redux = __webpack_require__(236);

	var _reactRedux = __webpack_require__(257);

	var _Index = __webpack_require__(276);

	var _Index2 = _interopRequireDefault(_Index);

	var _Reducer = __webpack_require__(281);

	var _Reducer2 = _interopRequireDefault(_Reducer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var store = (0, _redux.createStore)(_Reducer2.default);
	var rootElement = document.getElementById("app");
	(0, _reactDom.render)(_react2.default.createElement(
	    _reactRedux.Provider,
	    { store: store },
	    _react2.default.createElement(
	        _reactRouter.Router,
	        { history: _reactRouter.hashHistory },
	        _react2.default.createElement(_reactRouter.Route, { path: '/', component: _Index2.default })
	    )
	), rootElement);

	// Inbox/Message
	// class Message extends React.Component{
	//     constructor(props) {
	//         super(props)
	//     }
	//     componentWillMount(){
	//         console.log(this.context);
	//         this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
	//     }
	//     routerWillLeave(nextLocation) {
	//         console.log(nextLocation);
	//         return '确认要离开？';
	//     }
	//     render (){
	//         return <h3>Message {this.props.params.id}</h3>
	//     }
	// }
	// 备注：
	// 任何想访问context里面的属性的组件都必须显式的指定一个contextTypes 的属性。如果没有指定改属性，那么组件通过 this.context 访问属性将会出错。

	// react-router 传递了router到子组件中，但是router对象 可能 并没有在contextTypes 对象中声明
	// 而React 对 context 的态度是，只要没有在 contextTypes 中声明的属性一律不准加入 context

	// context 另一个作用是 跨组件 传递数据
	// Message.contextTypes = {
	//     router: PropTypes.object.isRequired,
	//     color: React.PropTypes.string.isRequired
	// };

/***/ },

/***/ 276:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(257);

	var _AddTodo = __webpack_require__(277);

	var _AddTodo2 = _interopRequireDefault(_AddTodo);

	var _TodoList = __webpack_require__(278);

	var _TodoList2 = _interopRequireDefault(_TodoList);

	var _Footer = __webpack_require__(279);

	var _Footer2 = _interopRequireDefault(_Footer);

	var _actionTypes = __webpack_require__(280);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Index = function (_Component) {
	    _inherits(Index, _Component);

	    function Index() {
	        _classCallCheck(this, Index);

	        return _possibleConstructorReturn(this, (Index.__proto__ || Object.getPrototypeOf(Index)).apply(this, arguments));
	    }

	    _createClass(Index, [{
	        key: 'render',
	        value: function render() {
	            var _props = this.props,
	                dispatch = _props.dispatch,
	                visibleTodos = _props.visibleTodos,
	                visibilityFilter = _props.visibilityFilter;

	            return _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(_AddTodo2.default, { onAddClick: function onAddClick(text) {
	                        return dispatch((0, _actionTypes.addTodo)(text));
	                    } }),
	                _react2.default.createElement(_TodoList2.default, { todos: visibleTodos,
	                    onTodoClick: function onTodoClick(index) {
	                        return dispatch((0, _actionTypes.completeTodo)(index));
	                    } }),
	                _react2.default.createElement(_Footer2.default, { filter: visibilityFilter,
	                    onFilterChange: function onFilterChange(nextFilter) {
	                        return dispatch((0, _actionTypes.setVisibilityFilter)(nextFilter));
	                    } })
	            );
	        }
	    }]);

	    return Index;
	}(_react.Component);

	function selectTodos(todos, filter) {
	    switch (filter) {
	        case _actionTypes.VisibilityFilters.SHOW_ALL:
	            return todos;
	        case _actionTypes.VisibilityFilters.SHOW_COMPLETED:
	            return todos.filter(function (todo) {
	                return todo.completed;
	            });
	        case _actionTypes.VisibilityFilters.SHOW_ACTIVE:
	            return todos.filter(function (todo) {
	                return !todo.completed;
	            });
	    }
	}
	function select(state) {
	    return {
	        visibleTodos: selectTodos(state.todos, state.visibilityFilter),
	        visibilityFilter: state.visibilityFilter
	    };
	}
	exports.default = (0, _reactRedux.connect)(select)(Index);

/***/ },

/***/ 277:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// import { Button } from "antd";
	// import 'antd/dist/antd.less';
	// <Button type="primary" onClick={e => this.handleClick(e) }>添加</Button>

	var AddTodo = function (_Component) {
	    _inherits(AddTodo, _Component);

	    function AddTodo() {
	        _classCallCheck(this, AddTodo);

	        return _possibleConstructorReturn(this, (AddTodo.__proto__ || Object.getPrototypeOf(AddTodo)).apply(this, arguments));
	    }

	    _createClass(AddTodo, [{
	        key: "render",
	        value: function render() {
	            var _this2 = this;

	            return _react2.default.createElement(
	                "div",
	                null,
	                _react2.default.createElement("input", { type: "text", ref: "input" }),
	                _react2.default.createElement(
	                    "button",
	                    { onClick: function onClick(e) {
	                            return _this2.handleClick(e);
	                        } },
	                    "\u6DFB\u52A0"
	                )
	            );
	        }
	    }, {
	        key: "handleClick",
	        value: function handleClick() {
	            var node = this.refs.input;
	            var text = node.value.trim();
	            this.props.onAddClick(text);
	            node.value = '';
	        }
	    }]);

	    return AddTodo;
	}(_react.Component);

	// AddTodo.propTypes = {
	//     onAddClick: PropTypes.func.isRequired
	// };


	exports.default = AddTodo;

/***/ },

/***/ 278:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TodoList = function (_Component) {
	    _inherits(TodoList, _Component);

	    function TodoList() {
	        _classCallCheck(this, TodoList);

	        return _possibleConstructorReturn(this, (TodoList.__proto__ || Object.getPrototypeOf(TodoList)).apply(this, arguments));
	    }

	    _createClass(TodoList, [{
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            return _react2.default.createElement(
	                'ul',
	                null,
	                this.props.todos.map(function (todo, index) {
	                    return _react2.default.createElement(
	                        'li',
	                        { key: index, onClick: function onClick(e) {
	                                return _this2.props.onTodoClick(index);
	                            },
	                            style: {
	                                textDecoration: todo.completed ? 'line-through' : 'none',
	                                cursor: todo.completed ? 'default' : 'pointer'
	                            } },
	                        todo.text
	                    );
	                })
	            );
	        }
	    }, {
	        key: 'handle',
	        value: function handle(index) {
	            this.props.onTodoClick(index);
	        }
	    }]);

	    return TodoList;
	}(_react.Component);

	exports.default = TodoList;

/***/ },

/***/ 279:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Footer = function (_Component) {
	    _inherits(Footer, _Component);

	    function Footer() {
	        _classCallCheck(this, Footer);

	        return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
	    }

	    _createClass(Footer, [{
	        key: 'renderFilter',
	        value: function renderFilter(filter, name) {
	            var _this2 = this;

	            if (filter === this.props.filter) {
	                return name;
	            }
	            return _react2.default.createElement(
	                'a',
	                { href: '#', onClick: function onClick(e) {
	                        e.preventDefault();
	                        _this2.props.onFilterChange(filter);
	                    } },
	                name
	            );
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'p',
	                null,
	                'Show:',
	                ' ',
	                this.renderFilter('SHOW_ALL', 'All'),
	                ', ',
	                this.renderFilter('SHOW_COMPLETED', 'Completed'),
	                ', ',
	                this.renderFilter('SHOW_ACTIVE', 'Active'),
	                '.'
	            );
	        }
	    }]);

	    return Footer;
	}(_react.Component);

	exports.default = Footer;

/***/ },

/***/ 280:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.addTodo = addTodo;
	exports.toggleTodo = toggleTodo;
	exports.completeTodo = completeTodo;
	exports.setVisibilityFilter = setVisibilityFilter;
	/*
	 * action 类型
	 */
	var ADD_TODO = exports.ADD_TODO = 'ADD_TODO';
	var TOGGLE_TODO = exports.TOGGLE_TODO = 'TOGGLE_TODO';
	var COMPLETE_TODO = exports.COMPLETE_TODO = 'COMPLETE_TODO';
	var SET_VISIBILITY_FILTER = exports.SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

	/*
	 * 其它的常量
	 */
	var VisibilityFilters = exports.VisibilityFilters = {
	    SHOW_ALL: 'SHOW_ALL',
	    SHOW_COMPLETED: 'SHOW_COMPLETED',
	    SHOW_ACTIVE: 'SHOW_ACTIVE'
	};

	/*
	 * action 创建函数
	 */
	function addTodo(text) {
	    return { type: ADD_TODO, text: text };
	}
	function toggleTodo(index) {
	    return { type: TOGGLE_TODO, index: index };
	}
	function completeTodo(index) {
	    return { type: COMPLETE_TODO, index: index };
	}
	function setVisibilityFilter(filter) {
	    return { type: SET_VISIBILITY_FILTER, filter: filter };
	}

/***/ },

/***/ 281:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _redux = __webpack_require__(236);

	var _actionTypes = __webpack_require__(280);

	var actions = _interopRequireWildcard(_actionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	// Object.assign() 是 ES6的特性
	// IE objectAssign
	function todos() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var action = arguments[1];

	    switch (action.type) {
	        case actions.ADD_TODO:
	            return [].concat(_toConsumableArray(state), [{
	                text: action.text,
	                completed: false
	            }]);
	        case actions.COMPLETE_TODO:
	            return [].concat(_toConsumableArray(state.slice(0, action.index)), [Object.assign({}, state[action.index], {
	                completed: true
	            })], _toConsumableArray(state.slice(action.index + 1)));
	        case actions.TOGGLE_TODO:
	            return state.map(function (todo, index) {
	                if (index === action.index) {
	                    return Object.assign({}, todo, {
	                        completed: !todo.completed
	                    });
	                }
	                return todo;
	            });
	        default:
	            return state;
	    }
	}
	function visibilityFilter() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : actions.VisibilityFilters.SHOW_ALL;
	    var action = arguments[1];

	    switch (action.type) {
	        case actions.SET_VISIBILITY_FILTER:
	            return action.filter;
	        default:
	            return state;
	    }
	}
	var todoapp = (0, _redux.combineReducers)({
	    visibilityFilter: visibilityFilter, todos: todos
	});

	exports.default = todoapp;

/***/ }

});