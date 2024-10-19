import React, { useState } from 'react'
import { Screen } from './Constants/Types';
import DownloadAllScreen from './Screens/DownloadAllScreen';
import About from './Screens/AboutScreen';

const ScreenNavigator = () => {
    const [screen, setScreen] = useState<Screen>('download');

    if (screen === 'download')
        return <DownloadAllScreen changeScreen={setScreen} />
    else //if (screen === 'about')
        return <About changeScreen={setScreen} />
}

export default ScreenNavigator