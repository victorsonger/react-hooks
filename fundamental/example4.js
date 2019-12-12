// Example 4
const MyReact = (function() {
  let hooks = [],
    currentHook = 0 // hooks数组, 和一个iterator!
  return {
    render(Component) {
      const Comp = Component() // 运行 effects
      Comp.render()
      currentHook = 0 // 复位，为下一次render做准备
      return Comp
    },
    useEffect(callback, depArray) {
      console.log('currentHook:', currentHook, '||||' , 'hooks[currentHook]--------useEffect', hooks[currentHook]);
      console.log('depArray-----------', depArray);
      const hasNoDeps = !depArray
      const deps = hooks[currentHook] // type: array | undefined
      const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        hooks[currentHook] = depArray
        console.log('currentHook:', currentHook, '||||' , 'hooks[currentHook]--------useEffect after change', hooks[currentHook]);
      }
      currentHook++ // 本hook运行结束
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue // type: any
      const setStateHookIndex = currentHook // 给setState的闭包准备的变量!
      const setState = newState => (hooks[setStateHookIndex] = newState)
      console.log('currentHook:', currentHook, '||||' , 'hooks[currentHook]-------- useState', hooks[currentHook]);
      return [hooks[currentHook++], setState]
    }
  }
})()

 // Example 4  使用hook
 function Counter() {
  const [count, setCount] = MyReact.useState(0)
  const [text, setText] = MyReact.useState('foo') // 第二个 state hook!
  MyReact.useEffect(() => {
    console.log('effect', count, text)
  }, [count, text])
  return {
    click: () => setCount(count + 1),
    type: txt => setText(txt),
    noop: () => setCount(count),
    render: () => console.log('render', { count, text })
  }
}
let App
App = MyReact.render(Counter)

console.log('\n 11111111111');
App.click()
console.log('\n 22222222222');
App = MyReact.render(Counter)
console.log('\n 33333333333');
App.type('bar')
App = MyReact.render(Counter)