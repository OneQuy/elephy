import React, { useMemo, useRef, useState } from 'react';
import { FlatList, Text, useColorScheme, View } from 'react-native';
import { DownloadResultViewData, MediaDownloadItem } from '../Constants/Types';
import MediaItemView from './MediaItemView'
import { BorderRadius, Gap, Outline } from '../Constants/Constants_Outline';
import { ExtractAllNumbersInText, GetWindowSize_Max, IsValuableArrayOrString } from '../../Common/UtilsTS';
import ImageBackgroundOrView from '../../Common/Components/ImageBackgroundOrView';
import { Color_BG, Color_Success, Color_Text } from '../Hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LucideIcon } from '../../Common/Components/LucideIcon';

const WindowMaxSize = GetWindowSize_Max()

const DownloadResultView = ({
    data
}: {
    data: DownloadResultViewData
}) => {
    // console.log('data', typeof data, data);

    const [downloadingAllPercentTxt, set_downloadingAllPercentTxt] = useState<string | undefined>()

    const scheme = useColorScheme()
    const insets = useSafeAreaInsets()

    const totalProgress = useRef<number[]>([])

    const sortedMedias: MediaDownloadItem[] = useMemo(() => {
        if (!IsValuableArrayOrString(data.medias))
            return data.medias

        return data.medias.sort((a: MediaDownloadItem, b: MediaDownloadItem) => {
            const numsInA = ExtractAllNumbersInText(a.quality)
            const numsInB = ExtractAllNumbersInText(b.quality)

            if (!IsValuableArrayOrString(numsInA) || !IsValuableArrayOrString(numsInB))
                return -1
            else {
                const valueA = numsInA.length >= 2 ? numsInA[0] * numsInA[1] : numsInA[0]
                const valueB = numsInB.length >= 2 ? numsInB[0] * numsInB[1] : numsInB[0]

                return valueB - valueA
            }
        })
    }, [data.medias])

    const downloadAllItemCount: number = useMemo(() => {
        if (!sortedMedias)
            return 0

        return sortedMedias.filter(item => {
            return (item.type === 'video' || item.type === 'image')
        }).length
    }, [sortedMedias])

    const onDownloadProgressOfItem = (percent: number, itemIndex: number) => {
        if (downloadingAllPercentTxt === undefined || downloadAllItemCount <= 0) {
            set_downloadingAllPercentTxt(undefined)
            totalProgress.current = []
            return
        }

        totalProgress.current[itemIndex] = percent

        let total = 0

        for (let num of totalProgress.current)
            total += num

        const totalpercent = total / downloadAllItemCount;

        if (totalpercent < 1)
            set_downloadingAllPercentTxt((totalpercent * 100).toFixed() + '%')
        else
            set_downloadingAllPercentTxt('Done!')

        // console.log(totalProgress.current, downloadAllItemCount)
    }

    const onPressDownloadAll = () => {
        if (downloadingAllPercentTxt?.includes('%') || downloadingAllPercentTxt === 'Done!')
            return

        set_downloadingAllPercentTxt('0%')
        totalProgress.current = new Array(sortedMedias.length).fill(0);
    }

    const renderCell = ({ item, index }: { item: MediaDownloadItem, index: number }) => (
        <MediaItemView
            data={data}
            item={item}
            activeDownloadAllMode={downloadingAllPercentTxt !== undefined}
            onDownloadProgress={(p) => onDownloadProgressOfItem(p, index)}
        />
    );

    return (
        <View style={{ flex: 1, alignItems: 'center', gap: Gap.Normal, marginTop: Outline.Normal, marginBottom: insets.bottom }}>
            {/* image title */}
            <ImageBackgroundOrView
                source={{ uri: data.thumbnail }}
                // source={{ uri: undefined }}
                style={{
                    height: WindowMaxSize * 0.08,
                    aspectRatio: 1,
                    borderRadius: BorderRadius.Normal,
                    overflow: 'hidden',
                }}
            />

            {/* title */}
            <Text
                numberOfLines={3}
                adjustsFontSizeToFit
                style={{
                    textAlign: 'center',
                    color: 'black',
                    fontSize: WindowMaxSize * 0.03,
                    marginHorizontal: Outline.Normal,
                }}
            >
                {data.title}
            </Text>

            {/* download all */}
            {
                downloadAllItemCount > 0 &&
                <View style={{ width: '100%', alignItems: 'center', gap: Gap.Small, justifyContent: 'flex-end', paddingHorizontal: Outline.Big, flexDirection: 'row' }}>

                    {
                        downloadingAllPercentTxt === 'Done!' &&
                        <LucideIcon
                            name={'Check'}
                            color={Color_Success}
                            strokeWidth={2}
                        />
                    }

                    <Text
                        onPress={onPressDownloadAll}

                        style={{
                            backgroundColor: scheme !== 'dark' ? Color_BG : Color_Text,
                            padding: Outline.Normal,
                            borderRadius: 5,
                            overflow: 'hidden',
                            textAlign: 'center',
                            color: scheme === 'dark' ? Color_BG : Color_Text,
                            fontSize: WindowMaxSize * 0.02,
                        }}
                    >
                        {
                            downloadingAllPercentTxt === undefined ?
                                'Download all' :
                                downloadingAllPercentTxt
                        }
                    </Text>
                </View>
            }

            <FlatList
                data={sortedMedias}
                renderItem={renderCell}
                keyExtractor={(item) => item.url}
                numColumns={1}
                style={{ maxHeight: WindowMaxSize * 0.5, width: '100%' }}
                contentContainerStyle={{ gap: Gap.Normal, padding: Outline.Big, paddingTop: 0 }}
            />
        </View>
    );

}

export default DownloadResultView;