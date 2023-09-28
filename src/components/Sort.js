const Sort = ({ curSort, setSorting }) => {
  const updateSort = (e, data) => {
    setSorting(data);
  };

  return (
    <>
      <h3>Sort</h3>
      <span>
        <input
          type={'radio'}
          id="sort-input"
          name="sort-input"
          checked={curSort === 'alpha'}
          onChange={(e) => updateSort(e, 'alpha')}
        ></input>
        <label htmlFor="sort-input">
          <span className="radio-button">A-Z</span>
        </label>
      </span>
      <span>
        <input
          type={'radio'}
          id="sort-input2"
          name="sort-input"
          checked={curSort === 'quality'}
          onChange={(e) => updateSort(e, 'quality')}
        ></input>
        <label htmlFor="sort-input2">
          <span className="radio-button">By Production Status</span>
        </label>
      </span>
      <span>
        <input
          type={'radio'}
          id="sort-input3"
          name="sort-input"
          checked={curSort === 'tags'}
          onChange={(e) => updateSort(e, 'tags')}
        ></input>
        <label htmlFor="sort-input3">
          <span className="radio-button">By Genre</span>
        </label>
      </span>
      <span>
        <input
          type={'radio'}
          id="sort-input4"
          name="sort-input"
          checked={curSort === 'random'}
          onChange={(e) => updateSort(e, 'random')}
        ></input>
        <label htmlFor="sort-input4">
          <span
            className={
              curSort === 'random'
                ? ['radio-button', 'random-sort'].join(' ')
                : 'radio-button'
            }
          >
            Randomize
          </span>
        </label>
      </span>
    </>
  );
};

export default Sort;
