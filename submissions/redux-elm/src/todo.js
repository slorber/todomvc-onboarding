import React from 'react';
import cx from 'classnames';
import forwardTo from './elm/forwardTo';

const initialModel = {
  tasks: [],
  visibility: 'All',
  field: '',
  uid: 0,
  onboarded: false
};

const addTask = model => {
  const uid = model.uid + 1;

  return {
    ...model,
    uid,
    field: '',
    tasks: model.field !== '' ? [...model.tasks, {
      description: model.field,
      completed: false,
      editing: false,
      id: model.uid
    }] : model.tasks
  };
};

const editingTask = (model, id, isEditing) => ({
  ...model,
  tasks: model.tasks.map(task => task.id === id ? {...task, editing: isEditing} : task)
});

const updateTask = (model, id, description) => ({
  ...model,
  tasks: model.tasks.map(task => task.id === id ? {...task, description} : task)
});

const checkTask = (model, id, isCompleted) => ({
  ...model,
  tasks: model.tasks.map(task => task.id === id ? {...task, completed: isCompleted} : task)
});

export function* update(model = initialModel, { type, payload }) {
  switch (type) {
  case 'ADD':
    return addTask(model);

  case 'UPDATE_FIELD':
    return {...model, field: payload};

  case 'EDITING_TASK':
    return editingTask(model, payload.type, payload.payload);

  case 'UPDATE_TASK':
    return updateTask(model, payload.type, payload.payload);

  case 'DELETE':
    return {...model, tasks: model.tasks.filter(task => task.id !== payload.type)};

  case 'DELETE_COMPLETE':
    return {...model, tasks: model.tasks.filter(task => !task.completed)};

  case 'CHECK':
    return checkTask(model, payload.type, payload.payload);

  case 'CHECK_ALL':
    return {...model, tasks: model.tasks.map(task => ({...task, completed: payload}))};

  case 'CHANGE_VISIBILITY':
    return {...model, visibility: payload};

  case 'ONBOARDING_FINISHED':
    return {...model, onboarded: true};

  default:
    return model;
  }
}

const taskEntry = (task, dispatch) => (
  <header className="header">
    <h1>Todos</h1>
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus
      value={task}
      name="newTodo"
      onChange={ev => dispatch('UPDATE_FIELD', ev.target.value)}
      onKeyUp={ev => ev.keyCode === 13 ? dispatch('ADD') : null}
      />
  </header>
);

const todoItem = (todo, dispatch) => (
  <li className={cx({completed: todo.completed, editing: todo.editing})}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={todo.completed}
        onClick={() => forwardTo(dispatch, 'CHECK')(todo.id, !todo.completed)}
        />
      <label
        onDoubleClick={() => forwardTo(dispatch, 'EDITING_TASK')(todo.id, true)}>{todo.description}</label>
      <button
        className="destroy"
        onClick={() => forwardTo(dispatch, 'DELETE')(todo.id)} />
    </div>
    <input
      className="edit"
      value={todo.description}
      name="title"
      id={`todo-${todo.id}`}
      onChange={ev => forwardTo(dispatch, 'UPDATE_TASK')(todo.id, ev.target.value)}
      onBlur={() => forwardTo(dispatch, 'EDITING_TASK')(todo.id, false)}
      onKeyDown={ev => ev.keyCode === 13 ? forwardTo(dispatch, 'EDITING_TASK')(todo.id, false) : null}
      />
  </li>
);

const taskList = (visibility, tasks, dispatch) => {
  const filteredTasks = tasks
    .filter(task =>
      visibility === 'Completed' && task.completed ||
      visibility === 'Active' && !task.completed ||
      visibility === 'All');

  const allCompleted = filteredTasks.every(task => task.completed);
  const cssVisibility = filteredTasks.length === 0 ? 'hidden' : 'visible';

  return (
    <section className="main" style={{visibility: cssVisibility}}>
      <input
        className="toggle-all"
        type="checkbox"
        name="toggle"
        checked={allCompleted}
        onClick={() => dispatch('CHECK_ALL', !allCompleted)} />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTasks.map(todo => todoItem(todo, dispatch))}
      </ul>
    </section>
  );
};

const controls = (visibility, tasks, dispatch) => {
  const tasksCompleted = tasks.filter(task => task.completed).length;
  const tasksLeft = tasks.length - tasksCompleted;
  const item_ = tasksLeft === 1 ? ' item' : ' items';

  return (
    <footer className="footer" style={{hidden: tasks.length === 0}}>
      <span className="todo-count"><strong>{tasksLeft}</strong>{`${item_} left`}</span>
      <ul className="filters">
        <li onClick={() => dispatch('CHANGE_VISIBILITY', 'All')}><a className={cx({selected: visibility === 'All'})}>All</a></li>
        <li onClick={() => dispatch('CHANGE_VISIBILITY', 'Active')}><a className={cx({selected: visibility === 'Active'})}>Active</a></li>
        <li onClick={() => dispatch('CHANGE_VISIBILITY', 'Completed')}><a className={cx({selected: visibility === 'Completed'})}>Completed</a></li>
      </ul>
      <button
        className="clear-completed"
        style={{hidden: tasksCompleted === 0}}
        onClick={() => dispatch('DELETE_COMPLETE')}>Clear completed ({`${tasksCompleted}`})</button>
    </footer>
  );
};

const infoFooter = (
  <footer className="footer">
    <p>Double-click to edit a todo</p>
    <p>Written by <a href="https://github.com/tomkis1">Tomas Weiss</a></p>
    <p>Part of <a href="http://todomvc.com">Todo MVC</a></p>
  </footer>
);

export const View = ({model, dispatch}) => (
  <div className="todomvc-wrapper">
    <section className="todoapp">
      {taskEntry(model.field, dispatch)}
      {taskList(model.visibility, model.tasks, dispatch)}
      {controls(model.visibility, model.tasks, dispatch)}
    </section>
    {infoFooter}
  </div>
);
