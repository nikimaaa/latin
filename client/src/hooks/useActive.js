import {useCallback, useState} from "react";

const useActive = (initialState) => {
    const [active, setActive] = useState(initialState);

    const activate = useCallback(() => setActive(true), []);
    const deactivate = useCallback(() => setActive(false), []);

    return [active, activate, deactivate]
}

export default useActive