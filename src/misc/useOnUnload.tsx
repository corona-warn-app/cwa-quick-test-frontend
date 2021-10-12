import React from 'react';

const initBeforeUnLoad = (onUnload?: () => void) => {

    window.onbeforeunload = () => {
        if (onUnload) {
            onUnload();
        }
    }
}
// Hook
const useOnUnload = (onUnload: () => void) => {
    const [handleOnUnload] = React.useState<() => void>(onUnload);

    React.useEffect(() => {
        initBeforeUnLoad(handleOnUnload);
        return () => initBeforeUnLoad(undefined);
    }, [handleOnUnload]);

    // return [handleOnUnload, setHandleOnUnload] as const;
}


export default useOnUnload;