// https://rapidapi.com/nguyenmanhict-MuTUtGWD7K/api/auto-download-all-in-one

import { Text, View, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, useColorScheme, Alert } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetWindowSize_Max, HexToRgb, IsValuableArrayOrString, PickRandomElement, RegexUrl, SafeParse } from '../../Common/UtilsTS';
import { BorderRadius, Gap, Outline } from '../Constants/Constants_Outline';
import { LucideIcon } from '../../Common/Components/LucideIcon';
import Clipboard from '@react-native-community/clipboard';
import { DownloadResultViewData, Screen } from '../Constants/Types';
import { Color_BG, Color_Text } from '../Hooks/useTheme';
import { RapidApiLimit } from '../../Common/SpecificType';
import { GetRapidApiLimit } from '../../Common/SpecificUtils';
import { IsDev } from '../../Common/IsDev';
import DownloadResultView from './../Components/DownloadResultView';
import ColorChangingView from '../../Common/Components/Effects/ColorChangingView';
import { GetBooleanAsync, SetBooleanAsync } from '../../Common/AsyncStorageUtils';
import { StorageKey_DownloadApp_ShowTutorialText } from '../Constants/StorageKey';
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { DeleteTempDirAsync } from '../../Common/FileUtils';
import { AppName } from '../../Common/SpecificConstants';
import { GetDisplayDownloadAvailableCountAsync, HandleCountAfterDownloadSuccessAsync } from '../AppUtils';
import IAPView from '../Components/IAPView';
import { useRevenueCatProduct } from '../../Common/RevenueCat/useRevenueCatProduct';

const TutorialText = 'Just copy your Youtube, Tiktok, Instagram,... link and tap Paste!'

const WindowMaxSize = GetWindowSize_Max()

const GetErrorMsg = (parsedResponeObj: object, defaultMsg: string): string => {
    if (typeof parsedResponeObj !== 'object')
        // @ts-ignore
        parsedResponeObj = SafeParse(parsedResponeObj)

    // @ts-ignore
    return parsedResponeObj?.message ? 'Error: ' + parsedResponeObj.message : defaultMsg;
}

const favoriteColors = [
    '#FFB3C1', // Soft coral pink
    '#FFD966', // Warm golden yellow
    '#7FD1B9', // Fresh mint green
    '#FF6F59', // Vivid sunset orange
    '#B6FFCE', // Pastel green
    '#6E75FF', // Electric blue
    '#FFD3B6', // Peachy beige
    '#FF5D73', // Bright watermelon pink
    '#8CD790', // Light green
    '#F9A602', // Tangerine yellow
];


const vintageColors = [
    '#F4E1D2', // Soft peach
    '#D9C7B0', // Warm beige
    '#A5897C', // Muted mauve
    '#7A6A53', // Faded brown
    '#4B3D3E', // Dusty burgundy
    '#857C55', // Olive green
    '#ADC178', // Sage green
    '#A3C6C4', // Vintage teal
    '#E4CDA7', // Light sand
    '#C5B8A5', // Old paper
];

const joyfulColors = [
    '#FF6F61', // Bright coral
    '#FFD564', // Sunny yellow
    '#6BDAFF', // Sky blue
    '#FF9F80', // Light orange
    '#9AFFA9', // Mint green
    '#FF6FB5', // Hot pink
    '#FFD371', // Warm yellow-orange
    '#FF97D4', // Soft magenta
    '#71EFA3', // Fresh green
    '#5EC8FF', // Bright cyan
];

type Status = 'free' | 'handling'

const DownloadAllScreen = ({
    changeScreen
}: {
    changeScreen: (screen: Screen) => void,
}) => {
    const [status, setStatus] = useState<Status>('free');
    const [rapidApiLimit, set_rapidApiLimit] = useState<undefined | RapidApiLimit>();
    const [showPopupSelectFileDownload, set_showPopupSelectFileDownload] = useState(false)
    const [showIAPPopup, set_showIAPPopup] = useState(false)
    const [downloadResultViewData, set_downloadResultViewData] = useState<DownloadResultViewData | undefined>()
    const [showTutorialText, set_showTutorialText] = useState(false)
    const [errorText, set_errorText] = useState('')
    const [downloadAvailableCount, set_downloadAvailableCount] = useState(0)
    const scheme = useColorScheme()
    const bottomSheetRef_DownloadResult = useRef<BottomSheet>(null);
    const bottomSheetRef_IAP = useRef<BottomSheet>(null);

    const { fetchedAllProducts } = useRevenueCatProduct()

    const showingAnyPopup = showPopupSelectFileDownload || showIAPPopup

    const reset = () => {
        setStatus('free')
        set_errorText('')
        set_downloadResultViewData(undefined)
    }

    const handleBottomSheetChanges_DownloadResult = useCallback((index: number) => {
        // console.log('handleSheetChanges', index);

        if (index < 0) { // closed bottom sheet
            set_showPopupSelectFileDownload(false)
            reset()

            // clean folder

            DeleteTempDirAsync().then((res) => {
                if (res !== null)
                    Alert.alert('Fail to delete downloaded files')
            })
        }
    }, [reset]);

    const handleBottomSheetChanges_IAP = useCallback((index: number) => {
        if (index < 0) { // closed bottom sheet
            set_showIAPPopup(false)
        }
    }, [reset]);

    // const downloadToLocal = async (responseText: string, quantity = 100) => {
    //     if (!responseText) {
    //         setStatus('free')
    //         set_errorText('Error: Unknown')
    //         return
    //     }

    //     const responseObj = JSON.parse(responseText)

    //     if (!responseObj) {
    //         set_errorText(GetErrorMsg(responseObj, 'Error: response null'))
    //         setStatus('free')
    //         return
    //     }

    //     let medias = responseObj.medias as []

    //     if (!Array.isArray(medias) || medias.length <= 0) {
    //         set_errorText(GetErrorMsg(responseObj, 'Error: media null'))
    //         setStatus('free')
    //         // console.log('medias null\n\n' + responseText)
    //         return
    //     }

    //     // @ts-ignore
    //     medias = medias.slice(0, quantity)

    //     setStatus('Downloading: ' + medias.length + ' media')

    //     let resArr = await Promise.all(medias.map((media, index) => {
    //         // @ts-ignore
    //         // console.log(media.url, media.extension);

    //         // @ts-ignore
    //         const filename = index + '.' + media.extension

    //         // console.log('dl media', media);

    //         // @ts-ignore
    //         return DownloadFileAsync(media.url, filename)
    //     }))

    //     // console.log(ToCanPrint(resArr));

    //     setStatus('Saving: ' + medias.length + ' media')

    //     resArr = await Promise.all(medias.map((media, index) => {

    //         // @ts-ignore
    //         const filename = index + '.' + media.extension

    //         const flp = GetFLPFromRLP(filename)

    //         // console.log(flp);

    //         return SaveToGalleryAsync(flp)
    //     }))

    //     setStatus('Success! Media saved.')
    //     setStatus('free')
    // }

    const onPressCloseErrorText = () => {
        set_errorText('')
    }

    const onPressCloseTutorialText = () => {
        set_showTutorialText(false)
        SetBooleanAsync(StorageKey_DownloadApp_ShowTutorialText, false)
    }


    const onPressCloseAllPopup = () => {
        bottomSheetRef_DownloadResult.current?.close()
        bottomSheetRef_IAP.current?.close()
    }


    const onPressNumberDownloadAvailableCount = () => {
        set_showIAPPopup(true)
    }

    const onPressPasteAndDownloadAsync = async (quantity: number = 100) => {
        // reset

        reset()

        setStatus('handling')

        const key = await AsyncStorage.getItem('key') ?? '693dd75456msh921c376e306158cp12c5dbjsn32ff82c9294a'

        const s = await Clipboard.getString();

        const data = JSON.stringify({
            url: s,
        });

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', async function () {
            if (this.readyState !== this.DONE)
                return

            // console.log('response\n' + this.response);

            set_rapidApiLimit(GetRapidApiLimit(xhr))

            // error

            if (this.response.error) {
                set_errorText(GetErrorMsg(this.response, 'Error: Unknown'))
                setStatus('free')
                return
            }

            const obj = SafeParse<DownloadResultViewData>(this.response, undefined)

            if (!obj || !IsValuableArrayOrString(obj.medias)) {
                set_errorText(GetErrorMsg(this.response, 'Error: Empty media.'))
                setStatus('free')
                return
            }

            obj.medias = obj.medias.filter(media => RegexUrl(media.url))

            if (!IsValuableArrayOrString(obj.medias)) {
                set_errorText(GetErrorMsg(this.response, 'Error: Invalid media.'))
                setStatus('free')
                return
            }

            // success

            await HandleCountAfterDownloadSuccessAsync()

            set_downloadAvailableCount(await GetDisplayDownloadAvailableCountAsync())

            set_downloadResultViewData(obj)
            set_showPopupSelectFileDownload(true)
            setStatus('free')

            // if (quantity <= 1)
            //     downloadToLocal(this.responseText, quantity)
            // else {
            //     set_showPopupSelectFileDownload(true)
            //     setStatus('free')
            // }
        });

        xhr.open('POST', 'https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink');
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.setRequestHeader('X-RapidAPI-Key', key);
        xhr.setRequestHeader('X-RapidAPI-Host', 'auto-download-all-in-one.p.rapidapi.com');

        xhr.send(data);
    }

    // run once

    useEffect(() => {
        (async () => {
            set_showTutorialText(await GetBooleanAsync(StorageKey_DownloadApp_ShowTutorialText, true))

            set_downloadAvailableCount(await GetDisplayDownloadAvailableCountAsync())
        })()
    }, [])


    return (
        <ColorChangingView
            colors={PickRandomElement([
                favoriteColors,
                vintageColors,
                joyfulColors
            ]) ?? []}

            duration={status === 'handling' ? 300 : 10000}
        >
            <SafeAreaView
                pointerEvents={status === 'handling' ? 'none' : 'auto'}
                style={{
                    // opacity: status === 'handling' ? 0.3 : 1,
                    width: '100%', flex: 1,
                }}
            >
                {/* status bar */}
                <StatusBar translucent barStyle={'dark-content'} />

                {/* its quy btn */}
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: Gap.Small,
                    padding: Outline.Normal,
                    // backgroundColor: 'green',
                }}
                >
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={{
                            textAlign: 'center',
                            fontSize: WindowMaxSize * 0.04,
                            fontWeight: '300',
                            color: 'black'
                        }}
                        onPress={() => changeScreen('about')}
                    >
                        {AppName}{IsDev() ? '.' : 'F'}
                    </Text>

                    <View
                        onTouchEnd={() => changeScreen('about')}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            // backgroundColor: HexToRgb('#ffffff', 0.5),
                            // backgroundColor: HexToRgb('#000000', 0.7),
                            width: WindowMaxSize * 0.06,
                            borderRadius: 1000,
                            aspectRatio: 1,
                            // opacity: 0.7,
                        }}
                    >
                        <LucideIcon
                            name='MoveRight'
                            size={WindowMaxSize * 0.05}
                            color={'black'}
                            // color={'white'}
                            strokeWidth={1.2}
                        />
                    </View>
                </View>

                {/* btn paste & handling */}
                <View style={{
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: showingAnyPopup ? 0 : 1,
                    // backgroundColor: 'purple'
                }}
                >
                    {
                        status !== 'handling' ?
                            // paste btn
                            <TouchableOpacity
                                onPress={() => onPressPasteAndDownloadAsync()}
                                style={{
                                    width: '80%',
                                    aspectRatio: 1,
                                    padding: Outline.Normal,
                                    borderRadius: 5000,
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: scheme === 'dark' ? Color_Text : Color_BG,
                                    // flex: 1,
                                }}
                            >
                                <Text
                                    adjustsFontSizeToFit
                                    numberOfLines={1}
                                    style={{
                                        textAlign: 'center',
                                        fontSize: WindowMaxSize * 0.05,
                                        fontWeight: '200',
                                        color: scheme === 'dark' ? Color_BG : Color_Text,
                                    }}
                                >
                                    Paste
                                </Text>
                            </TouchableOpacity> :

                            // loading
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: Gap.Normal,
                                }}
                            >
                                <ActivityIndicator
                                    color={'white'}
                                />
                                <Text
                                    adjustsFontSizeToFit
                                    numberOfLines={1}
                                    style={{
                                        textAlign: 'center',
                                        fontSize: WindowMaxSize * 0.03,
                                        fontWeight: '300',
                                        color: 'white'
                                    }}
                                    onPress={() => changeScreen('about')}
                                >
                                    Loading...
                                </Text>
                            </View>
                    }

                    {/* tutorial text */}
                    {
                        showTutorialText && status !== 'handling' &&
                        // true &&
                        <View
                            // onTouchEnd={() => changeScreen?.('upload')}
                            style={{
                                // backgroundColor: 'tomato',
                                margin: Outline.Big,
                                // padding: Outline.Big,
                                width: '70%',
                                borderRadius: BorderRadius.Normal,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                gap: Gap.Normal,
                            }}
                        >
                            {/* icon */}
                            {
                                <LucideIcon
                                    onTouchEnd={onPressCloseTutorialText}
                                    name={'XSquare'}
                                    size={WindowMaxSize * 0.05}
                                    color={HexToRgb('#ffffff', 0.5)}
                                />
                            }

                            <Text
                                adjustsFontSizeToFit
                                numberOfLines={2}
                                style={{
                                    textAlign: 'left',
                                    fontSize: WindowMaxSize * 0.025,
                                    color: HexToRgb('#ffffff', 0.5),
                                }}>
                                {TutorialText}
                            </Text>
                        </View>
                    }
                </View>

                {/* error text */}
                {
                    errorText &&
                    <ScaleUpView
                        containerStyle={{
                            backgroundColor: 'tomato',
                            margin: Outline.Normal,
                            padding: Outline.Normal,
                            borderRadius: BorderRadius.Normal,
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            gap: Gap.Normal,
                            opacity: showingAnyPopup ? 0 : 1,
                            // width: '100%',
                        }}
                    >
                        {/* icon */}
                        {
                            <LucideIcon
                                onTouchEnd={onPressCloseErrorText}
                                name={'OctagonX'}
                                size={WindowMaxSize * 0.04}
                                color={Color_BG}
                            />
                        }

                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={2}

                            style={{
                                textAlign: 'left',
                                fontSize: WindowMaxSize * 0.025,
                                color: Color_BG,
                                // width: '100%',
                            }}>
                            {errorText}
                        </Text>
                    </ScaleUpView>
                }

                {/* download count number */}
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={{
                        textAlign: 'left',
                        fontSize: WindowMaxSize * 0.05,
                        fontWeight: '200',
                        color: 'black',
                        paddingBottom: Outline.Big,
                        paddingLeft: Outline.Big,
                        opacity: showingAnyPopup ? 0 : 1,
                        // backgroundColor: 'red',
                    }}
                    onPress={onPressNumberDownloadAvailableCount}
                >
                    {downloadAvailableCount}
                </Text>

                {/* api limit text (dev) */}
                {
                    rapidApiLimit && IsDev() &&
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}

                        style={{
                            opacity: showingAnyPopup ? 0 : 1,
                            textAlign: 'left',
                            fontSize: WindowMaxSize * 0.02,
                            color: 'gray',
                            // width: '100%',
                        }}>
                        {`${JSON.stringify(rapidApiLimit)}`}
                    </Text>
                }
            </SafeAreaView>

            {/* view behind bottom sheet */}
            {
                (showPopupSelectFileDownload || showIAPPopup) &&
                <View
                    style={{
                        backgroundColor: HexToRgb(scheme === 'dark' ? Color_Text : Color_BG, 0.3),
                        width: '100%',
                        height: '100%',
                        position: 'absolute'
                    }}
                    onTouchEnd={onPressCloseAllPopup}
                />
            }

            {/* iap popup */}
            {
                showIAPPopup && fetchedAllProducts &&
                <BottomSheet
                    ref={bottomSheetRef_IAP}
                    onChange={handleBottomSheetChanges_IAP}
                    enablePanDownToClose
                    backgroundStyle={{
                        backgroundColor: HexToRgb(scheme === 'dark' ? Color_Text : Color_BG, 0.3),
                    }}
                >
                    <IAPView fetchedAllProducts={fetchedAllProducts} />
                </BottomSheet>
            }

            {/* bottom sheet */}
            {
                showPopupSelectFileDownload && downloadResultViewData &&
                <BottomSheet
                    ref={bottomSheetRef_DownloadResult}
                    onChange={handleBottomSheetChanges_DownloadResult}
                    enablePanDownToClose
                    backgroundStyle={{
                        backgroundColor: HexToRgb(scheme === 'dark' ? Color_Text : Color_BG, 0.3),
                    }}
                >
                    <BottomSheetView style={{ flex: 1, }}
                    >
                        <DownloadResultView data={downloadResultViewData} />
                    </BottomSheetView>
                </BottomSheet>
            }
        </ColorChangingView>
    )
}

export default DownloadAllScreen

// const onPressSetKey = async () => {
//     AsyncStorage.setItem('key', await Clipboard.getString())
//     setStatus('done')
// }