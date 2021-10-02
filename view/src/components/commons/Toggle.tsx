import React from "react"
import "./Toggle.scss"

/*
Toggle Switch Component
Note: id, checked and onChange are required for ToggleSwitch component to function. The props name, small, disabled
and optionLabels are optional.
Usage: <ToggleSwitch id="id" checked={value} onChange={checked => setValue(checked)}} />
*/

interface Props {
    id        : string
    checked   : boolean
    onChange  : Function
    label     : string
}

interface State {
    checked: boolean
}

class Toggle extends React.Component<Props, State> {

    optionLabels = ['Yes', 'No']

    constructor(props: Props) {
        super(props)
        this.state = {
            checked: props.checked
        }
    }

    handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
            & { 
                target: {
                    checked: boolean
                }
            }
        ) => {
        const checked = e.target.checked
        this.setState({ checked })
        this.props.onChange(checked)
    }

    render() {

        const { id, label } = this.props
        const { checked } = this.state

        return (
            <div className="toggle-outer">

                <div className="toggle">

                    <input
                        type        = "checkbox"
                        className   = "toggle-checkbox"
                        id          = { id }
                        checked     = { checked }
                        onChange    = { this.handleChange }
                    />

                    <label
                        className   = "toggle-label"
                        htmlFor     = { id }
                    >
                        <span 
                            className   = "toggle-inner" 
                            data-yes    = { this.optionLabels[0] }
                            data-no     = { this.optionLabels[1] }
                        />

                        <span className="toggle-switch" />

                    </label>

                </div>

                <label htmlFor={ id }>{ label }</label>

            </div>
            
        )
    }

}


export default Toggle
