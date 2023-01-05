function $(el) {
  return document.querySelector(el)
}

const flex = $('.flex')
const items = $('.items-container')
document.querySelectorAll('select').forEach(el => {
  el.addEventListener('change', function (e) {
    flex.style[this.name] = this.value

    if (['flexWrap', 'height'].includes(el.name)) {
      const alignContent = $('[name=alignContent]')
      const isNowrapping = ['nowrap'].includes(this.value)
      alignContent.disabled = isNowrapping

      alignContent.value = isNowrapping ? 'align-content' : 'stretch'
    }
  })
})

const add = document.getElementById('addItem')
const itemTemp = document.getElementById('item')
const itemPropTemp = document.getElementById('itemProps')
add.addEventListener('click', function () {
  const itemClone = itemTemp.content.cloneNode(true)
  const itemPropClone = itemPropTemp.content.cloneNode(true)
  flex.appendChild(itemClone)
  items.appendChild(itemPropClone)
})

items.addEventListener('change', function ({ target }) {
  let { name, value } = target
  value = value ? value : 0
  const actItem = target.parentNode
  const activeItemIndex = Array.prototype.indexOf.call(items.children, actItem)
  const flexItem = flex.children[activeItemIndex]

  const unitProp = ['width', 'height', 'flexBasis']
  removeTextNodes(flexItem)
  setTimeout(() => updateSize(flexItem), 400)

  unitProp.forEach(prop => {
    const { value: v } = actItem.querySelector(`[name=${prop}]`)

    if (isNaN(v) && v !== 'auto') {
      flexItem.append(v)
    }
  })
  if (isNaN(value)) {
    flexItem.style[name] = ''
    return
  }
  if (unitProp.includes(name)) {
    value += 'px'
  }
  flexItem.style[name] = value
})

items.addEventListener('click', function ({ target }) {
  const actItem = target.parentNode
  const activeItemIndex = Array.prototype.indexOf.call(items.children, actItem)
  if (target.classList.contains('del')) {
    flex.removeChild(flex.children[activeItemIndex])
    this.removeChild(this.children[activeItemIndex])
  }
})

function removeTextNodes(target) {
  Array.from(target.childNodes).forEach(child =>
    child.nodeType === 3 ? target.removeChild(child) : removeTextNodes(child)
  )
}

function updateSize(item) {
  if (item.offsetWidth && item.offsetHeight) {
    item.querySelector('.w').textContent = item.offsetWidth
    item.querySelector('.h').textContent = item.offsetHeight
  }
}
