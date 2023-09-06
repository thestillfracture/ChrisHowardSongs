import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";

const NotFound = () => {

    const history = useHistory();

    useEffect(() => {

        history.push("/")

    }, [history])

    return (
        <div>404</div>
    )
}

export default NotFound