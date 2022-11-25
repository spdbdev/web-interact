import React, { useEffect } from 'react'

var marqueeTextElements = document.getElementsByClassName('marquee-text');
window.marquuStatus = [];
const CustomMarquee = ({ text }) => {
  useEffect(() => {
    marqueeTextElements = document.getElementsByClassName('marquee-text');
    let marqueeElementList = document.getElementsByClassName('marquee');
    if(marqueeTextElements.length === marqueeElementList.length) {
      for(let i = 0; i < marqueeTextElements.length; i++) {
        let diffSize =
        document.getElementsByClassName('marquee-text')[i].clientWidth -
        document.getElementsByClassName('marquee')[i].clientWidth;
        if (diffSize > 0) {
          window.marquuStatus.push(false);
          console.log('i', i);
          runAnimation(0 - diffSize, i)
        }else{
          window.marquuStatus.push(true);
        }
      }
    }
  }, [])

  const runAnimation = (size, index) => {
    let marginLeft = parseInt(marqueeTextElements[index].style.marginLeft.split('px')[0])
    var interval = setInterval(() => {
      if (window.marquuStatus[index]) {
        marginLeft += 2
      } else {
        marginLeft -= 2
      }
      marqueeTextElements[index].style.marginLeft = marginLeft + 'px'
      if (size > marginLeft) {
        clearInterval(interval)
        setTimeout(() => {
          window.marquuStatus[index] = true
          runAnimation(size, index)
        }, 3690)
      } else if (marginLeft > 0) {
        clearInterval(interval)
        setTimeout(() => {
          window.marquuStatus[index] = false
          runAnimation(size, index)
        }, 3690)
      }
    }, 70)
  }

  return (
    <div className="marquee">
      <div className="marquee-text" style={{ marginLeft: 0 }}>
        {text}
      </div>
    </div>
  )
}

export default CustomMarquee
