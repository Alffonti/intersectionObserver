import ads from './ads.js'
import articles from './articles.js'

let contentBox
let nextArticleID = 1
let visibleAds = new Set()
let previouslyVisibleAds = null

let adObserver
let refreshIntervalID

window.addEventListener('load', startup, false)

function startup() {
  contentBox = document.querySelector('main')

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0.0, 0.75],
  }

  adObserver = new IntersectionObserver(intersectionCallback, observerOptions)
  notify(
    'the IntersectionObserver callback is invoked as soon as the page loads to check if the target and the root are already intersecting.',
    'generalInfo'
  )

  buildContents()

  refreshIntervalID = setInterval(handleRefreshInterval, 1000)

  document.addEventListener('visibilitychange', handleVisibilityChange, false)
}

function handleVisibilityChange() {
  if (document.hidden) {
    notify(
      'User switch tab. the handleVisibilityChange is invoked to ensure the total view time of visible ads are not updated during the interval refresh.',
      'generalInfo'
    )

    if (!previouslyVisibleAds) {
      previouslyVisibleAds = visibleAds
      visibleAds = [] // during interval refresh, total view time is not updated

      previouslyVisibleAds.forEach(adBox => {
        updateAdTimer(adBox)
        adBox.dataset.lastViewStarted = 0
      })
    }
  } else {
    previouslyVisibleAds.forEach(adBox => {
      adBox.dataset.lastViewStarted = performance.now()
    })
    visibleAds = previouslyVisibleAds
    previouslyVisibleAds = null
  }
}

function intersectionCallback(entries) {
  entries.forEach(entry => {
    const adBox = entry.target

    if (entry.isIntersecting) {
      if (entry.intersectionRatio >= 0.75) {
        notify(
          `The ${adBox.querySelector('h2').innerText} ad is visible`,
          'visibilityInfo'
        )

        adBox.dataset.lastViewStarted = entry.time

        visibleAds.add(adBox)
      }
    } else {
      visibleAds.delete(adBox)

      let minTime = 5000
      if (
        entry.intersectionRatio === 0.0 &&
        adBox.dataset.totalViewTime >= minTime
      ) {
        replaceAd(adBox)
      }
    }
  })
}

function handleRefreshInterval() {
  const redrawList = [] // used to render timer in ad

  visibleAds.forEach(adBox => {
    const previousTime = adBox.dataset.totalViewTime
    updateAdTimer(adBox)

    // the only possible scenario is when user switches to tab simultaneously with the interval refresh, performance.now is the same
    if (previousTime !== adBox.dataset.totalViewTime) {
      redrawList.push(adBox)
    }
  })

  if (redrawList.length) {
    window.requestAnimationFrame(time => {
      redrawList.forEach(adBox => {
        drawAdTimer(adBox)
      })
    })
  }
}

function updateAdTimer(adBox) {
  const lastStarted = adBox.dataset.lastViewStarted // the first time updateAdTimer is called lastStarted is entry.time
  const currentTime = performance.now()

  if (lastStarted) {
    // lastStarted is never zero (maybe if user switch tab)
    const diff = currentTime - lastStarted

    adBox.dataset.totalViewTime = parseFloat(adBox.dataset.totalViewTime) + diff
  }

  adBox.dataset.lastViewStarted = currentTime
}

function drawAdTimer(adBox) {
  const timerBox = adBox.querySelector('.timer')
  const totalSeconds = adBox.dataset.totalViewTime / 1000
  const sec = Math.floor(totalSeconds % 60)
  const min = Math.floor(totalSeconds / 60)

  timerBox.innerText = `${min}:${sec.toString().padStart(2, '0')}`
}

function buildContents() {
  articles.forEach((article, index) => {
    contentBox.appendChild(createArticle(article))
    let adFrequency = 3

    if ((index + 1) % adFrequency === 0) {
      // 0 is divisle by any number, so using a zero-based index means that an ad would always be added after the first article. To prevent this, I increment the index by one.
      loadRandomAd()
    }
  })
}

function createArticle(article) {
  const articleElem = document.createElement('article')
  articleElem.id = nextArticleID

  const titleElem = document.createElement('h2')
  titleElem.innerText = article.title
  articleElem.appendChild(titleElem)

  articleElem.innerHTML += article.body
  nextArticleID += 1

  const buttonElem = document.createElement('button')
  buttonElem.innerText = 'Read more'
  articleElem.appendChild(buttonElem)

  return articleElem
}

function loadRandomAd(replaceBox) {
  let adBox, title, body, timerElem

  const ad = ads[Math.floor(Math.random() * ads.length)]

  if (replaceBox) {
    adObserver.unobserve(replaceBox)
    adBox = replaceBox
    title = replaceBox.querySelector('.title')
    body = replaceBox.querySelector('.body')
    timerElem = replaceBox.querySelector('.timer')
  } else {
    adBox = document.createElement('div')
    adBox.className = 'ad'
    title = document.createElement('h2')
    body = document.createElement('p')
    timerElem = document.createElement('div')
    adBox.appendChild(title)
    adBox.appendChild(body)
    adBox.appendChild(timerElem)
  }

  adBox.style.backgroundColor = ad.bgcolor

  title.className = 'title'
  body.className = 'body'
  title.innerText = ad.title
  body.innerHTML = ad.body

  adBox.dataset.totalViewTime = 0
  adBox.dataset.lastViewStarted = 0

  timerElem.className = 'timer'
  timerElem.innerText = '0:00'

  if (!replaceBox) {
    contentBox.appendChild(adBox)
  }

  adObserver.observe(adBox)
}

function replaceAd(adBox) {
  // updateAdTimer(adBox)

  const visibleTime = adBox.dataset.totalViewTime
  notify(
    `${adBox.querySelector('h2').innerText} was visible for ${Math.floor(
      visibleTime / 1000
    )}s`,
    'visibilityInfo'
  )

  notify(
    `${adBox.querySelector('h2').innerText} was replaced by another ad`,
    'replaceInfo'
  )

  loadRandomAd(adBox)
}

function notify(message, typeOfInfo) {
  const notification = document.getElementById(typeOfInfo)
  notification.textContent = message
  notification.style.display = 'block'

  setTimeout(() => {
    notification.style.display = 'none'
  }, 5000)
}
