import React from 'react'
import { PostHogProvider } from 'posthog-react-native'
import { PostHogKey_Production } from './Keys'
import useAsyncHandle from './scr/Common/Hooks/useAsyncHandle'
import { SplashScreenLoader } from './scr/Common/SplashScreenLoader'
// import { Color_BG } from './scr/App/Hooks/useTheme'
import SplashScreen from './scr/Common/Components/SplashScreen'
import { GetAlternativeConfig } from './scr/Common/RemoteConfig'
import ScreenNavigator from './scr/App/ScreenNavigator'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = () => {
  const { result } = useAsyncHandle(async () => SplashScreenLoader());
  // const [showWelcomeScreen, set_showWelcomeScreen] = useState(false)
  // const didShowedWelcomeScreenRef = useRef(false)

  // const style = useMemo(() => {
  //   return StyleSheet.create({
  //     master: { flex: 1, backgroundColor: Color_BG }
  //   })
  // }, [])

  // const onPressStartWelcomeScreen = useCallback(() => {
  //   SetBooleanAsync(StorageKey_ShowedWelcomeScreen, true)
  //   set_showWelcomeScreen(false)
  // }, [])

  // // check to show welcome screen

  // useEffect(() => {
  //   (async () => {
  //     const showedWelcomeScreen = await GetBooleanAsync(StorageKey_ShowedWelcomeScreen)

  //     if (!showedWelcomeScreen) {
  //       set_showWelcomeScreen(true)
  //     }
  //   })()
  // }, [])

  // splash screen

  if (!result)
    return <SplashScreen />

  // welcome screen

  // if (showWelcomeScreen && !result.subscribedDataOrUndefined) {
  //   didShowedWelcomeScreenRef.current = true

  //   return (
  //     <SafeAreaView style={style.master}>
  //       <StatusBar backgroundColor={Color_BG} barStyle={'light-content'} />
  //       <WelcomeScreen onPressStart={onPressStartWelcomeScreen} />
  //     </SafeAreaView>
  //   )
  // }

  // main app render

  const postHogAutocapture = GetAlternativeConfig('postHogAutoCapture', false)

  return (
    <PostHogProvider apiKey={PostHogKey_Production} autocapture={postHogAutocapture}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ScreenNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </PostHogProvider>
  )

  // return (
  //   <PostHogProvider apiKey={PostHogKey_Production} autocapture={postHogAutocapture}>
  //     <SafeAreaView style={style.master}>
  //       {/* status bar */}
  //       <StatusBar backgroundColor={Color_Text} barStyle={'light-content'} />

  //       {/* main UI app */}
  //       <SetupScreen
  //         shouldShowPaywallFirstTime={didShowedWelcomeScreenRef.current && !result.subscribedDataOrUndefined}
  //       />
  //     </SafeAreaView>
  //   </PostHogProvider>
  // )
}

export default App