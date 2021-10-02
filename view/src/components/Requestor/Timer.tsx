import React from 'react'

interface Props {
    timeOfReset?        : number | null
    maxQuota            : number
    requestsRemaining   : number
    reset?              : Function
}

interface State {
    timeLeft: number
}

class Timer extends React.Component<Props, State> {

    timerInterval: undefined | NodeJS.Timeout

    constructor(props: Props) {
        super(props)
        this.state = {
            timeLeft: 0
        }
    }

    componentDidMount() {
        // start the timer
        calculateAndSetTimeLeft(this)
        // and set the interval to run down the timer by polling the time difference between now
        // and the future timestamp (reset time)
        this.timerInterval = setInterval(() => { calculateAndSetTimeLeft(this) }, 100)
    }

    componentDidUpdate(prevProps: Props) {
        if(this.props.timeOfReset === prevProps.timeOfReset) return

        // clear old setInterval to prevent memory leak of having dereferenced setIntervals running simultaneously.
        if(this.timerInterval) clearInterval(this.timerInterval)
        this.timerInterval = setInterval(() => { calculateAndSetTimeLeft(this) }, 100)
    }

    componentWillUnmount() {
        // clear all async operations when if component is unmounted
        if(this.timerInterval) clearInterval(this.timerInterval)
    }

    render() {
        const { timeLeft } = this.state
        const { maxQuota, requestsRemaining } = this.props
        return (
            <span>
                <p>Seconds to next reset: { timeLeft }</p>
                <p>Requests limit: { maxQuota }</p>
                <p>Requests remaining: { requestsRemaining }</p>
            </span>
        )
    }

}

const calculateAndSetTimeLeft = (self: Timer) => {

    // only start the timer if timeOfReset is valid (not 0, null, undefined)
    const difference = self.props.timeOfReset ? _calculateTimeLeft(self.props.timeOfReset) : 0
    
    // if the difference is below zero, it means we need to reset everything
    if(difference <= 0) {
        if(self.timerInterval) clearInterval(self.timerInterval)
        if(self.props.reset) self.props.reset()
        if(self.state.timeLeft !== 0) self.setState({ timeLeft: 0 })
        return
    }

    self.setState({
        timeLeft: difference
    })

}

const _calculateTimeLeft = (timeOfReset: number, now = new Date().getTime()) => {
    const difference = timeOfReset - now
    return Math.round(difference / 1000)
}

export default Timer
export { Timer, calculateAndSetTimeLeft, _calculateTimeLeft }