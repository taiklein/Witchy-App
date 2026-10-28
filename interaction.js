function currentWeek() {
    const now = new Date()
    const dayOfWeek = now.getDay()

// Update Month
    const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
    const monthElement = document.querySelector('.month')
    if (monthElement) {
        monthElement.textContent = monthNames[now.getMonth()]
    }
// Update Weekday
    const sunday = new Date(now)
    sunday.setDate(now.getDate() - dayOfWeek)
    
    const defaultLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    const dayElements = document.querySelectorAll('.weekdays .day')

    dayElements.forEach((dayElements, index) => {
        const targetDate = new Date(sunday)
        targetDate.setDate(sunday.getDate() + index)

        const labelSpan = dayElements.querySelector('.dayLabel')
        const numberSpan = dayElements.querySelector('.dayNumber')

        if (numberSpan) {
        numberSpan.textContent = targetDate.getDate()
        }

        const isToday = targetDate.toDateString() === now.toDateString()
        if (labelSpan) {
            if (isToday) {
            labelSpan.textContent = 'Today'
            dayElements.classList.add('today')
            } else {
            labelSpan.textContent = defaultLabels[index]
            dayElements.classList.remove('today')
            }
        }
    })
}
currentWeek()

let displayedYear = new Date().getFullYear()
let displayedMonth = new Date().getMonth()

//Left Arrow (Previous Month)
document.querySelector('.left').addEventListener('click', () => {
    displayedMonth--
    if (displayedMonth < 0) {
        displayedMonth = 11
        displayedYear--
    }
    Calendar(displayedYear, displayedMonth)
})

//Right Arrow (Next Month)
document.querySelector('.right').addEventListener('click', () => {
    displayedMonth++
    if (displayedMonth > 11) {
        displayedMonth = 0
        displayedYear++
    }
    Calendar(displayedYear, displayedMonth)
})


function Calendar(year, month) {
    const now = new Date ()

//Update Month 
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]

    const monthHeader = document.querySelector('.top h2')
    if (monthHeader) {
        monthHeader.textContent = monthNames[month]
    }

//Update Calendar
    const totalDays = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = new Date(year, month, 1).getDay()
    
    const weekDay = Array.from({ length: 7}, () => [])

    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day)
        const dayOfWeek = date.getDay()

        const slotIndex = Math.floor((firstDayIndex + day - 1) / 7)

        weekDay[dayOfWeek][slotIndex] = {
            dayNumber: day,
            isToday: date.toDateString() === now.toDateString()
        }
    }

    const dayColumns = document.querySelectorAll('.weekdays .day')

    dayColumns.forEach((columnEl, columnIndex) => {

        const numberSpans = columnEl.querySelectorAll('.calendarDayNumber')
        const datesForThisColumn = weekDay[columnIndex]
        
        numberSpans.forEach((span, slotIndex) => {
            
            const dayObj = datesForThisColumn ? datesForThisColumn[slotIndex] : undefined

            if (dayObj) {
                span.textContent = dayObj.dayNumber
                
                if(dayObj.isToday) {
                    span.classList.add('today-number')
                } else {
                    span.classList.remove('today-number')
                }
            } else {
                span.textContent= ''
                span.classList.remove('today-number')
            }
        })
    })
}
Calendar(displayedYear, displayedMonth)