const Button = ({ color, text, clickEvent, cls }) => {

    const clickEventFunction = (e) => {
        // clickEvent;
        e.stopPropagation();
    }

    return (
        <button
            className={cls}
            style={{ background: color }}
            onClick={(e) => clickEventFunction(e)}> {text}</button >
    )
}

export default Button