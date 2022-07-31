/*
 * @Author: hidetodong
 * @Date: 2022-07-31 21:13:03
 * @LastEditTime: 2022-07-31 21:23:48
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /mobx/src/User.jsx
 * HIDETOXIC - 版权所有
 */

import { observer } from "mobx-react";
import { useRef } from "react";
import { useContext } from "react";
import StoreContext from "./context";

const User = observer(() => {
  const { userStore } = useContext(StoreContext);
  const ref = useRef(null);

  return (
    <div>
      {userStore.isLogin ? (
        <>
          <p>{userStore.username}</p>
          <button
            onClick={() => {
              userStore.logout();
            }}
          >
            推出
          </button>
        </>
      ) : (
        <>
          <input type="text" ref={ref} />
          <button
            onClick={() => {
              userStore.login(ref.current.value);
            }}
          >
            登陆
          </button>
        </>
      )}
    </div>
  );
});

export default User
