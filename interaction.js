//INDEX PAGE
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

//CALENDAR AND LOG PAGE

let displayedYear = new Date().getFullYear()
let displayedMonth = new Date().getMonth()

//Left Arrow (Previous Month)
const leftArrowCalendar = document.querySelector('.left')

if (leftArrowCalendar) {
    leftArrowCalendar.addEventListener('click', () => {
        displayedMonth--
        if (displayedMonth < 0) {
        displayedMonth = 11
        displayedYear--
        }
        Calendar(displayedYear, displayedMonth)
    })
}

//Right Arrow (Next Month)

const rightArrowCalendar = document.querySelector('.right')
if (rightArrowCalendar) {
    rightArrowCalendar.addEventListener('click', () => {
        displayedMonth++
        if (displayedMonth > 11) {
            displayedMonth = 0
            displayedYear++
        }
        Calendar(displayedYear, displayedMonth)
    })
}

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

                span.onclick = () => {
                const clickedDate = new Date(year, month, dayObj.dayNumber)
                let dateString

                const m = monthNames[clickedDate.getMonth()]
                const d = clickedDate.getDate()
                const suffix = (d === 1 || d === 21 || d === 31) ? "st" :
                (d === 2 || d === 22) ? "nd" :
                (d === 3 || d === 23) ? "rd" : "th"

                dateString = `${m} ${d}${suffix}`

                localStorage.setItem('targetSymptomDate', dateString)
                window.location.href = 'symptoms.html'
            }
            } else {
                span.textContent= ''
                span.classList.remove('today-number')
            }
        })
    })
}
Calendar(displayedYear, displayedMonth)

//SYMPTOMS PAGE

document.addEventListener('DOMContentLoaded', () => {
    
    const rightArrowDiv = document.querySelector('.arrowright')
    const leftArrowDiv = document.querySelector('.arrowleft')
    const headerTitle = document.querySelector('.topsymptoms h3')

    const passedDate = localStorage.getItem('targetSymptomDate')
    if (passedDate && headerTitle) {
        headerTitle.textContent = passedDate
        localStorage.removeItem('targetSymptomDate')
    }

    if (rightArrowDiv && leftArrowDiv &&headerTitle) {
        let clickCount = 0

        rightArrowDiv.style.visibility = 'hidden';
        rightArrowDiv.style.opacity = '0'

//Previous Days

    function pastDate(offsetDays) {
        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() - offsetDays)

        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]

        const month = monthNames[targetDate.getMonth()]
        const day = targetDate.getDate()

        const suffix = (day === 1 || day === 21 || day === 31) ? "st" :
        (day === 2 || day === 22) ? "nd" : (day === 3 || day === 23) ? "rd" : "th"
    
        return `${month} ${day}${suffix}`
    }
//Left Arrow

        leftArrowDiv.addEventListener('click', () => {
            saveSelections()

            clickCount++

            if (clickCount > 0) {
            rightArrowDiv.style.visibility = 'visible'
            rightArrowDiv.style.opacity = '1'
            }

            if (clickCount === 1) {
                headerTitle.textContent = 'Yesterday'
            } else if (clickCount === 2) {
                headerTitle.textContent = pastDate(2)
            } else {
                headerTitle.textContent = pastDate(clickCount)
            }
            loadSavedSelections()

        })

//Right Arrow

        rightArrowDiv.addEventListener('click', () => {
            saveSelections()

            if (clickCount > 0) {
                clickCount--
            }

            if (clickCount === 0) {
                headerTitle.textContent = "What are you feeling today?"
                rightArrowDiv.style.visibility = 'hidden'
                rightArrowDiv.style.opacity = '0'
            } else if (clickCount === 1) {
                headerTitle.textContent = "Yesterday"
            } else {
                headerTitle.textContent = pastDate(clickCount)
            }

            loadSavedSelections()
        })
    }
})

//Mood and Symptoms Selection

const moodCards = document.querySelectorAll('.moodImg')
const symptomCards = document.querySelectorAll('.symptomsIcon')
const headerTitle = document.querySelector('.topsymptoms h3')

function storage() {
    return `symptomsData_${headerTitle.textContent.trim()}`
}

function loadSavedSelections() {
    const savedData = JSON.parse(localStorage.getItem(storage())) || {moods: [], symptoms: []}

    moodCards.forEach(card => card.classList.remove('selected'))
    symptomCards.forEach(card => card.classList.remove('selected'))

    moodCards.forEach(card => {
        const moodName = card.querySelector('span').textContent
        if (savedData.moods.includes(moodName)) {
            card.classList.add('selected')
        }
    })

    symptomCards.forEach(card => {
        const symptomName = card.querySelector('span').textContent
        if (savedData.symptoms.includes(symptomName)) {
            card.classList.add('selected')
        }
    })
}

function saveSelections() {
    const selectedMoods = []
    const selectedSymptoms = []

    moodCards.forEach(card => {
        if (card.classList.contains('selected')) {
            selectedMoods.push(card.querySelector('span').textContent)
        }
    })

    symptomCards.forEach(card => {
        if (card.classList.contains('selected')) {
            selectedSymptoms.push(card.querySelector('span').textContent)
        }
    })

    const dataToSave = { moods: selectedMoods, symptoms: selectedSymptoms}
    localStorage.setItem(storage(), JSON.stringify(dataToSave))
}

moodCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('selected')
        saveSelections()
    })
})

symptomCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('selected')
        saveSelections()
    })
})

loadSavedSelections()