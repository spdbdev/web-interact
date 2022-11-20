import React, { useEffect } from 'react'

var marqueeElement
const CustomMarquee = ({ text }) => {
  useEffect(() => {
    let diffSize =
      document.getElementsByClassName('marquee-text')[0].clientWidth -
      document.getElementsByClassName('marquee')[0].clientWidth
    marqueeElement = document.getElementById('marquee')
    if (diffSize > 0) {
      window.marquuStatus = false
      runAnimation(0 - diffSize)
    }
  }, [])

  const runAnimation = (size) => {
    let marginLeft = parseInt(marqueeElement.style.marginLeft.split('px')[0])
    var interval = setInterval(() => {
      if (window.marquuStatus) {
        marginLeft += 2
      } else {
        marginLeft -= 2
      }

      marqueeElement.style.marginLeft = marginLeft + 'px'
      if (size > marginLeft) {
        clearInterval(interval)
        setTimeout(() => {
          window.marquuStatus = true
          runAnimation(size)
        }, 2000)
      } else if (marginLeft > 0) {
        clearInterval(interval)
        setTimeout(() => {
          window.marquuStatus = false
          runAnimation(size)
        }, 2000)
      }
    }, 70)
  }

  return (
    <div className="marquee">
      <div className="marquee-text" id="marquee" style={{ marginLeft: 0 }}>
        {text}
      </div>
    </div>
  )
}

export default CustomMarquee
