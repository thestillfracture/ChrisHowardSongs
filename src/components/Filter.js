const Filter = ({ isChecked, value, id, toggleFilter }) => {



    return (
        <span className="filter">
            <input type={'checkbox'} id={['cbx-', id].join().replace(',', '')} className="visually-hidden" checked={isChecked} value={value} onChange={(e) => toggleFilter(id, isChecked)}></input>
            <label htmlFor={['cbx-', id].join().replace(',', '')}><span className="cbx-button"></span><span className="filter-name">{value}</span></label>
        </span>
    )
}

export default Filter