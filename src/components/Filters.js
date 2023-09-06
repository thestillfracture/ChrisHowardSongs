import Switch from "./Switch"

const Filters = ({ mySongs, checked, filters, toggleFilter }) => {


    return (
        <div>
            <div className="song-quality">
                <h3>Production Status</h3>
                <div>
                    {filters.map((filter, i) => (filter.type === 'quality' &&
                        <Switch key={i} id={filter.id} isChecked={filter.checked} toggleFilter={toggleFilter} value={filter.name} filters={filters} />
                    )
                    )}
                </div>
            </div>
            <div></div>
            <div className="song-genres">
                <h3>Genre</h3>
                <div>
                    {filters.map((filter, i) => (filter.type === 'genre' &&
                        <Switch key={i} id={filter.id} isChecked={filter.checked} toggleFilter={toggleFilter} value={filter.name} filters={filters} />
                    )
                    )}
                </div>
            </div>
        </div>
    )
}


export default Filters