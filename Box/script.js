const numSteps = 20.0

let boxElement
const notificationElem = document.querySelector('.notification') // track %

let prevRatio = 0.0
let increasingColor = 'hsla(0 100% 50% / ratio)'
let decreasingColor = 'hsla(60 100% 50% / ratio)'

// Set things up
window.addEventListener(
  'load',
  event => {
    boxElement = document.querySelector('#box')

    createObserver()
  },
  false
)

function createObserver() {
  let observer

  let options = {
    root: null,
    rootMargin: '0px',
    threshold: buildThresholdList(),
  }

  observer = new IntersectionObserver(handleIntersect, options)
  observer.observe(boxElement)
}

function buildThresholdList() {
  let thresholds = []
  let numSteps = 20

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps
    thresholds.push(ratio)
  }

  thresholds.push(0)

  return thresholds
}

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > prevRatio) {
      entry.target.style.backgroundColor = increasingColor.replace(
        'ratio',
        entry.intersectionRatio
      )
    } else {
      entry.target.style.backgroundColor = decreasingColor.replace(
        'ratio',
        entry.intersectionRatio
      )
    }

    const note = `${Math.floor(
      entry.intersectionRatio * 100
    )}% of box intersected`

    document.querySelector('.notification').textContent = note

    prevRatio = entry.intersectionRatio
  })
}
