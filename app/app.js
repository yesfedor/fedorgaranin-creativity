function createApp(component = {}) {
  const _instance = new Proxy({}, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver)
    },
    set(target, prop, val, receiver) {
      return Reflect.set(target, prop, val, receiver)
    }
  })
  
  function $mount(cssSelector) {
    component.$el = document.querySelector(cssSelector)
    if (typeof component.mounted === 'function') {
      component.mounted.apply(component)
    }
    return _instance
  }

  function use(plugin) {
    if (!plugin.install) {
      return _instance
    }

    plugin.install({ app: component })
    return _instance
  }

  _instance.use = use
  _instance.$mount = $mount
  return _instance
}

const AppComponent = {
  mounted() {
    this.$el.setAttribute('app-init', '')
    this.$background.init(1000)
  }
}

const BackgroundPlugin = {
  install({ app }) {
    // https://codepen.io/natewiley/pen/GgONKy
    const $wrap = document.querySelector('.js-wrap')
    const createC = () => {
      const $c = document.createElement('div')
      $c.classList.add('c')
      $wrap.append($c)
    }
    app.$background = {
      init(count = 300) {
        for (let i = 0; i < count; i++) {
          createC()
        }
      }
    }
  }
}

createApp(AppComponent)
  .use(BackgroundPlugin)
  .$mount('.app')
