function people(name: string) {
  let preTask = Promise.resolve();

  function sleeping(n: number) {
    return new Promise((_) => setTimeout(_, n));
  }

  const methods = {
    eat(food: string) {
      async function newTask(preTask: Promise<any>) {
        await preTask;
        console.log(`${name} eating ${food}!`);
      }

      preTask = newTask(preTask);

      return methods;
    },

    talk(worlds: string) {
      async function newTask(preTask: Promise<any>) {
        await preTask;
        console.log(`${name} talking ${worlds}!`);
      }

      preTask = newTask(preTask);

      return methods;
    },

    sleep(times: number) {
      async function newTask(preTask: Promise<any>) {
        await preTask;
        console.log(`${name} sleeping ${times}ms`);

        await sleeping(times);
      }

      preTask = newTask(preTask);

      return methods;
    },
  };

  return methods;
}

people("johnny")
  .eat("桃子")
  .talk("苹果")
  .sleep(2000)
  .talk("好香")
  .eat("西瓜")
  .sleep(1000)
  .talk("拉肚子了");
