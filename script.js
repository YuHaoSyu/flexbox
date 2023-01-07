function $(target) {
  const el = document.querySelector(target)
  return {
    on(evt, handler, option) {
      el.addEventListener(evt, handler, option)
      return $(target)
    },
    one(evt, handler, option) {
      el.addEventListener(evt, handler, { once: true, ...option })
      return $(target)
    }
  }
}

const containerStyle = document.getElementById('flex-container-style')
const container = document.querySelector('.flex-container')
function changeHangler(el) {
  const style = new FormData(this)
  let isNoWrap = false
  for (const [att, value] of style) {
    // 修改 flexbox 文字
    if (att === 'textContent' && value) {
      const child = el.childNodes
      child.forEach(element => {
        element.nodeType === 3 && element.remove()
      })
      el.prepend(value)
      continue
    }

    if (value === 'nowrap') {
      isNoWrap = true
    }

    el.style[att] = value
  }
  if (isNoWrap) {
    el.style.alignContent = 'stretch'
    const alignContent = document.querySelector('[name="alignContent"]')
    if (alignContent.value !== 'stretch') {
      alignContent.value = 'stretch'
      containerStyle.dispatchEvent(new Event('change'))
    }
  }
}

containerStyle.addEventListener('change', function (e) {
  changeHangler.call(this, container)
})
$('body').on('mousedown', function ({ target }) {
  if (target.type === 'text') {
    target.value = ''
    let form = target
    while (form.nodeName !== 'FORM') {
      form = form.parentElement
    }
    form.dispatchEvent(new Event('change'))
  }
  if (target.classList.contains('flex-box')) {
    const textarea = target.querySelector('textarea')
    textarea.style.display = 'initial'

    $('textarea').one('blur', function (e) {
      this.style.display = ''
    })
    setTimeout(() => textarea.focus())
  }
})
containerStyle.dispatchEvent(new Event('change'))

function randBetween(a, b = 0) {
  const min = Math.min(a, b)
  return Math.floor(Math.random() * (Math.max(a, b) - min + 1)) + min
}

class Box {
  static template = document.getElementById('flex-box')
  constructor() {
    const template = Box.template.content.cloneNode(true)
    const config = template.firstElementChild.firstElementChild

    config
      .querySelector('[name="delete"]')
      .addEventListener('click', this.delete, { once: true })

    config.addEventListener('change', this.changeHandler)
    container.appendChild(template)
    const hue = randBetween(359)
    config.parentElement.style.backgroundImage = `radial-gradient(at 75% 25%, hsl(${hue}, 100%, 85%) 0%, hsl(${hue}, 100%, 70%) 50%, hsl(${hue}, 100%, 65%) 65%, hsl(${hue}, 100%, 70%) 80%)`
    config.parentElement.style.boxShadow = `inset -15px 15px 15px -15px hsl(${hue}, 100%, 70%)`
    config.dispatchEvent(new Event('change'))
  }
  delete(e) {
    if (e.target.name === 'delete') {
      let flexBox = e.target
      while (!flexBox.classList.contains('flex-box')) {
        flexBox = flexBox.parentElement
      }
      flexBox.removeEventListener('change', this.changeHandler)
      flexBox.remove()
    }
  }
  changeHandler(e) {
    changeHangler.call(this, this.parentElement)
  }
}

containerStyle.addEventListener('click', function (e) {
  const { name } = e.target
  if (name === 'add') {
    new Box()
  }
})
