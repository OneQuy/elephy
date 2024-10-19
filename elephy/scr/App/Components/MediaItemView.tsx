import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Share, Image, Alert, useColorScheme } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { DownloadResultViewData, MediaDownloadItem } from '../Constants/Types'
import { LucideIcon, LucideIconName } from '../../Common/Components/LucideIcon'
import { Outline } from '../Constants/Constants_Outline'
import { CapitalizeWords, GetWindowSize_Max, IsValuableArrayOrString, TempDirName, ToCanPrint, ToCanPrintError } from '../../Common/UtilsTS'
import { Color_BG, Color_BG2, Color_Fail, Color_Success, Color_Text, Color_Text2 } from '../Hooks/useTheme'
import ImageBackgroundOrView from '../../Common/Components/ImageBackgroundOrView'
import { DownloadFileAsync, GetFLPFromRLP, IsExistedAsync } from '../../Common/FileUtils'
import { SaveToGalleryAsync } from '../../Common/CameraRoll'
import { createThumbnail } from 'react-native-create-thumbnail'
import { DownloadProgressCallbackResult } from 'react-native-fs'

const WindowMaxSize = GetWindowSize_Max()

enum State {
    None,
    DoneSuccess,
    FailedDownloaded,
    FailedSavedToPhoto,
}

const MediaItemView = ({
    data,
    item,
    activeDownloadAllMode,
    onDownloadProgress,
}: {
    data: DownloadResultViewData,
    item: MediaDownloadItem,
    activeDownloadAllMode: boolean,
    onDownloadProgress: (percent: number) => void,
}) => {
    const isAudio = item.type === 'audio'
    const isVideo = item.type === 'video'
    const isImage = item.type === 'image'

    const filepath: string = useMemo(() => {
        // temp/0.jpg

        const index = data.medias.indexOf(item)

        return TempDirName + '/' + item.type + '_' + index + '.' + item.extension
    }, [data, item])

    const scheme = useColorScheme()

    const [isHandlingDownload, set_isHandlingDownload] = useState(false)
    const [isHandlingShare, set_isHandlingShare] = useState(false)

    const [downloadedState, set_downloadedState] = useState(State.None)
    const [shareState, set_shareState] = useState(State.None)
    const [videoThumbPath, set_videoThumbPath] = useState('')
    const [imageSize, set_imageSize] = useState<number[] | undefined>()

    const [downloadPercentText, set_downloadPercentText] = useState('')
    const [shareDownloadPercentText, set_shareDownloadPercentText] = useState('')

    const [technicalError, set_technicalError] = useState<any>()

    const isHandlingAny = isHandlingDownload || isHandlingShare

    const downloadProgressCallbackResult = async (progress: DownloadProgressCallbackResult) => {
        if (!progress || progress.contentLength <= 0) {
            set_downloadPercentText('')
            onDownloadProgress(0)
            return
        }

        set_downloadPercentText((progress.bytesWritten / progress.contentLength * 100).toFixed())

        onDownloadProgress(progress.bytesWritten / progress.contentLength)
    }

    const shareDownloadProgressCallbackResult = async (progress: DownloadProgressCallbackResult) => {
        if (!progress || progress.contentLength <= 0) {
            set_shareDownloadPercentText('')
            return
        }

        set_shareDownloadPercentText((progress.bytesWritten / progress.contentLength * 100).toFixed())
    }

    const onPressDownloadAsync = async () => {
        if (isHandlingAny)
            return

        set_isHandlingDownload(true)
        set_downloadedState(State.None)
        set_downloadPercentText('')
        onDownloadProgress(0)
        set_technicalError(undefined)

        if (shareState !== State.DoneSuccess)
            set_shareState(State.None)

        let fileExisted = await IsExistedAsync(filepath, true)

        if (fileExisted) {
            console.log('file existed :', filepath);
        }

        let res = fileExisted ? null : await DownloadFileAsync(item.url, filepath, undefined, downloadProgressCallbackResult)

        if (res !== null) {
            set_isHandlingDownload(false)
            set_downloadedState(State.FailedDownloaded)
            set_technicalError(res)
            return
        }

        const flp = GetFLPFromRLP(filepath)

        // console.log(flp);

        res = await SaveToGalleryAsync(flp)

        if (res !== null) {
            set_isHandlingDownload(false)
            set_downloadedState(State.FailedSavedToPhoto)
            set_technicalError(res)
            return
        }

        // success

        set_isHandlingDownload(false)
        set_downloadedState(State.DoneSuccess)
        onDownloadProgress(1)
    }

    const onPressShareAsync = async () => {
        if (isHandlingAny)
            return

        // console.log('dl media', media);

        set_isHandlingShare(true)
        set_shareState(State.None)
        set_shareDownloadPercentText('')
        set_technicalError(undefined)

        if (downloadedState !== State.DoneSuccess)
            set_downloadedState(State.None)

        let fileExisted = await IsExistedAsync(filepath, true)

        if (fileExisted) {
            console.log('file existed :', filepath);
        }

        let res = fileExisted ? null : await DownloadFileAsync(item.url, filepath, undefined, shareDownloadProgressCallbackResult)

        if (res !== null) {
            set_isHandlingShare(false)
            set_shareState(State.FailedDownloaded)
            set_technicalError(res)

            // console.error(res);

            return
        }

        const flp = GetFLPFromRLP(filepath)

        try {
            await Share.share({
                title: 'Share',
                url: flp
            })
        }
        catch (e) {
            set_technicalError(e)
        }

        set_isHandlingShare(false)
        set_shareState(State.DoneSuccess)
    }

    const onPressFailTextAsync = async () => {
        if (!technicalError)
            return

        Alert.alert('Error', ToCanPrintError(technicalError))
    }

    // const duration: string = useMemo(() => {
    //     const s = item.duration ?? data.duration

    //     // console.log('aaa', item.duration, data.duration);

    //     if (typeof s === 'string')
    //         return s

    //     const dur = SafeValue(s, 0)

    //     return GetDayHourMinSecFromMs_ToString(dur * 1000)
    // }, [data, item])

    const qualityText: string = useMemo(() => {
        if (!item.quality || !IsValuableArrayOrString(item.quality))
            return '...'

        // common

        item.quality = CapitalizeWords(item.quality)

        item.quality = item.quality
            .replace('uhd', 'UHD')
            .replace('hd', 'HD')
            .replace('Hd', 'HD')
            .replace('sd', 'SD')
            .replace('Sd', 'SD')
            .replaceAll('_', ' ')

        // console.log(item.quality);


        // specific

        if (isAudio)
            return 'Audio'
        else if (isImage) {
            if (imageSize && imageSize.length === 2) {
                return imageSize[0] + 'x' + imageSize[1]
            }
            else {
                return item.quality
                    .replace('-', 'x')
                    .replace('p', '')
                    .replace('k', '')
            }
        }
        else if (isVideo) {
            if (item.quality.includes('aterm')) { // Watermark
                return item.quality
            }
            else {
                return item.quality
                    .replace('k', '')
            }
        }
        else
            return item.quality
    }, [isImage, imageSize, item, isVideo, isAudio])

    // active dl all mode

    useEffect(() => {
        if (!activeDownloadAllMode || isAudio)
            return

        onPressDownloadAsync()
    }, [activeDownloadAllMode])

    // create video thumb

    useEffect(() => {
        if (!isVideo)
            return

        createThumbnail({
            url: item.url,
            timeStamp: 1000,
        })
            .then(response => {
                set_videoThumbPath(response.path)
                // console.log('createThumbnail. path: ', response.path)
            })
            .catch((e) => {
                console.error('createThumbnail', ToCanPrint(e))
            })
    }, [isVideo, item.url])

    // get size image

    useEffect(() => {
        if (!isImage)
            return

        Image.getSize(item.url, (width: number, height: number) => {
            set_imageSize([width, height])
        }, (error: any) => {
            set_imageSize(undefined)
        })
    }, [isImage, item.url])

    const iconType: LucideIconName = useMemo(() => {
        if (isVideo)
            return 'Video'
        else if (isAudio)
            return 'Music'
        else if (isImage)// image
            return 'ImageIcon'
        else // other
            return 'File'
    }, [item.type, isVideo, isAudio, isImage])

    const getBtnIconColor = (state: State, isDownloadOrShare: boolean) => {
        if (isDownloadOrShare) {
            if (isHandlingShare)
                return (scheme === 'dark' ? Color_Text2 : Color_BG2)
        }
        else {
            if (isHandlingDownload)
                return (scheme === 'dark' ? Color_Text2 : Color_BG2)
        }

        if (state === State.DoneSuccess)
            return Color_Success
        else if (state !== State.None)
            return Color_Fail
        else
            return (scheme === 'dark' ? Color_BG : Color_Text)
    }

    // console.log(qualityText);

    return (
        <View style={[styles.master, { backgroundColor: scheme === 'dark' ? Color_Text : Color_BG }]}>
            {/* icon */}
            <View style={styles.typeView}>
                <LucideIcon name={iconType} color={scheme === 'dark' ? Color_BG : Color_Text} strokeWidth={1} />
            </View>

            {/* quality 480 720 & status fail */}
            <View style={styles.qualityView}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.qualityTxt, { color: scheme === 'dark' ? Color_BG : Color_Text }]}>
                    {qualityText}
                </Text>

                {/* status fail */}
                {
                    ((downloadedState !== State.None && downloadedState !== State.DoneSuccess) ||
                        (shareState !== State.None && shareState !== State.DoneSuccess)) &&
                    <Text
                        numberOfLines={1} adjustsFontSizeToFit style={styles.failTxt}
                        onPress={technicalError ? onPressFailTextAsync : undefined}
                    >
                        Failed. Please retry.
                    </Text>
                }
            </View>

            {/* image / video thumb */}
            {
                (isImage || (isVideo && IsValuableArrayOrString(videoThumbPath))) &&
                <ImageBackgroundOrView
                    style={styles.imageThumb}
                    resizeMode='contain'
                    source={{ uri: isImage ? item.url : videoThumbPath }}
                />
            }

            {/* download */}
            {
                (isVideo || isImage) &&
                <TouchableOpacity style={styles.buttonTO} onPress={onPressDownloadAsync}>
                    {
                        isHandlingDownload ?
                            <>
                                {
                                    !downloadPercentText ?
                                        <ActivityIndicator color={Color_Text2} /> :
                                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.percentTxt, { color: scheme === 'dark' ? Color_BG : Color_Text }]}>
                                            {downloadPercentText}%
                                        </Text>
                                }
                            </>
                            :
                            <LucideIcon
                                name={downloadedState === State.DoneSuccess ? 'Check' : 'ArrowDown'}
                                color={getBtnIconColor(downloadedState, true)}
                                strokeWidth={2}
                            />
                    }
                </TouchableOpacity>
            }

            {/* share */}
            <TouchableOpacity style={styles.buttonTO} onPress={onPressShareAsync}>
                {
                    isHandlingShare ?
                        <>
                            {
                                !shareDownloadPercentText ?
                                    <ActivityIndicator color={Color_Text2} /> :
                                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.percentTxt, { color: scheme === 'dark' ? Color_BG : Color_Text }]}>
                                        {shareDownloadPercentText}%
                                    </Text>
                            }
                        </>
                        :
                        <LucideIcon
                            name={shareState === State.DoneSuccess ? 'Check' : 'Share2Icon'}
                            color={getBtnIconColor(shareState, false)}
                            strokeWidth={2}
                        />
                }
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    master: {
        minHeight: WindowMaxSize * 0.09,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderRadius: 10,
        flex: 1,
        padding: Outline.Big,
        // margin: 5,
    },

    audioDuration: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
    },

    audioDurationTxt: {
        fontWeight: '200',
        fontSize: WindowMaxSize * 0.04,
        // fontWeight: '700',
        // textAlign: 'left',
        // flex: 1,
    },

    qualityView: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'pink',
    },

    qualityTxt: {
        fontSize: WindowMaxSize * 0.04,
        fontWeight: '700',
        color: 'black',
        marginRight: Outline.Normal,
        // width: '100%',
        // backgroundColor: 'pink'
    },

    failTxt: {
        fontSize: WindowMaxSize * 0.025,
        color: Color_Fail,
    },

    percentTxt: {
        fontSize: WindowMaxSize * 0.025,
        color: 'black',
    },

    typeView: {
        width: '10%',
        // backgroundColor: 'green',
    },

    // typeTxt: {
    //     fontSize: WindowMaxSize * 0.025,
    //     // fontWeight: 'bold',
    // },

    buttonTO: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageThumb: {
        height: WindowMaxSize * 0.06,
        aspectRatio: 1,
        // backgroundColor: 'red',
    },
});

export default MediaItemView