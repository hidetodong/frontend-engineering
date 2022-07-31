/*
 * @Author: hidetodong
 * @Date: 2022-07-31 21:12:56
 * @LastEditTime: 2022-07-31 21:42:12
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /mobx/src/Todos.jsx
 * HIDETOXIC - 版权所有
 */

import { useContext, useRef } from "react";
import StoreContext from "./context";
import { observer } from "mobx-react";
import { TodoStore } from "./store";

const AddTodo = observer(() => {
  const ref = useRef(null);
  const { todosStore } = useContext(StoreContext);
  return (
    <>
      <input type="text" ref={ref} />
      <button
        onClick={() => {
          const todo = new TodoStore(ref.current.value);
          todosStore.add(todo);
        }}
      >
        添加
      </button>
    </>
  );
});

const Todo = observer(({ todo }) => {
  return (
    <li>
      <input type="checkbox" checked={todo.completed} onChange={todo.toggle} />
      {todo.text}
    </li>
  );
});

const TodoList = observer(() => {
  const { todosStore } = useContext(StoreContext);

  return (
    <>
      <ul>
        {todosStore.list.map((todo, index) => (
          <Todo todo={todo} key={index} />
        ))}
      </ul>
    </>
  );
});

const TodoStatus = observer(() => {
  const { todosStore } = useContext(StoreContext);

  return <p>未完成的事项{todosStore.unCompleteCount}</p>;
});

const Todos = () => {
  return (
    <div>
      <AddTodo />
      <TodoList />
      <TodoStatus />
    </div>
  );
};
export default observer(Todos);
