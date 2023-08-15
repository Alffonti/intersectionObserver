window.addEventListener('load', () => {
  // Retrieve all help sections
  const sections = Array.from(document.querySelectorAll('section[id]'))

  // Once a scrolling event is detected, iterate all elements
  // whose visibility changed and highlight their navigation entry
  const scrollHandler = entries =>
    entries.forEach(entry => {
      const section = entry.target
      const sectionId = section.id
      const sectionLink = document.querySelector(`a[href="#${sectionId}"]`)

      if (entry.intersectionRatio > 0) {
        section.classList.add('visible')
        sectionLink.classList.add('visible')
      } else {
        section.classList.remove('visible')
        sectionLink.classList.remove('visible')
      }
    })

  // Creates a new scroll observer
  const observer = new IntersectionObserver(scrollHandler)

  //noinspection JSCheckFunctionSignatures
  sections.forEach(section => observer.observe(section))
})
