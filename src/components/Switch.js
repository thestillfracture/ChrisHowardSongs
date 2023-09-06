const Switch = ({ isChecked, value, id, toggleFilter }) => {

    return (
        <span className="filter">
            <input type={'checkbox'} 
                id={['cbx-', id].join().replace(',', '')} 
                className="visually-hidden" 
                checked={isChecked} 
                value={value} 
                onChange={(e) => toggleFilter(id, isChecked)}>
            </input>
            <label htmlFor={['cbx-', id].join().replace(',', '')}>
                <span className="filter-name">{value}</span>
                <span className="switch-back">
                    <span className="switch-labels">
                        <span className="switch-labels-on-bg">
                            <span className="switch-label-on">ON</span>
                        </span>
                        <span className="switch-labels-mid-bg">
                            <span className="switch-labels-hex-bg">
                                <span className="switch-labels-hex"></span>
                            </span>
                            <span className="switch-labels-outer-circ">
                                <span className="switch-labels-inner-circ">
                                    <span className="switch-labels-ball"></span>
                                </span>
                            </span>
                        </span>
                        <span className="switch-labels-toggle-area">
                            <span className="switch-labels-toggle"></span>
                        </span>
                        <span className="switch-labels-off-bg">
                            <span className="switch-label-off">OFF</span>
                        </span>
                    </span>
                </span>
            </label>
        </span>
    )
}

export default Switch