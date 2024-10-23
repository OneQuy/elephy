import React, { } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { BorderRadius, Gap, Outline } from '../Constants/Constants_Outline';
import { GetWindowSize_Max } from '../../Common/UtilsTS';
import { Color_BG, Color_Text } from '../Hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { PurchasesStoreProduct } from 'react-native-purchases';

const WindowMaxSize = GetWindowSize_Max()

const IntroText = `⭐ Add a set number of downloads with no expiration.

⭐ Only count when the file is downloaded or shared successfully.`

const IAPView = ({
    fetchedAllProducts
}: {
    fetchedAllProducts: PurchasesStoreProduct[]
}) => {
    const scheme = useColorScheme()
    const insets = useSafeAreaInsets()

    // console.log(fetchedTargetProduct);

    if (!fetchedAllProducts) {
        return (
            <BottomSheetView style={{
                flex: 1,
                padding: Outline.Normal,
                paddingBottom: Math.max(insets.bottom, 100),
                gap: Gap.Normal,
            }}
            >
                <ActivityIndicator />
            </BottomSheetView>
        )
    }

    return (
        <BottomSheetView style={{
            flex: 1,
            padding: Outline.Normal,
            paddingBottom: Math.max(insets.bottom, 10),
            gap: Gap.Normal,
        }}
        >
            {/* title  */}
            <Text
                style={{
                    color: scheme !== 'dark' ? Color_Text : Color_BG,
                    fontSize: WindowMaxSize * 0.03,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>
                Additional Downloads
            </Text>

            {/* intro  */}
            <Text
                // adjustsFontSizeToFit
                // numberOfLines={2}
                style={{
                    color: scheme !== 'dark' ? Color_Text : Color_BG,
                    fontSize: WindowMaxSize * 0.02,
                    // fontWeight: 'bold',
                }}>
                {IntroText}
            </Text>

            {
                fetchedAllProducts.map((iap) => {
                    return (
                        < TouchableOpacity
                            key={iap.identifier}
                            style={{
                                padding: Outline.Big,
                                minHeight: WindowMaxSize * 0.08,
                                backgroundColor: scheme === 'dark' ? Color_Text : Color_BG,
                                borderRadius: BorderRadius.Normal,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: scheme !== 'dark' ? Color_Text : Color_BG,
                                    fontSize: WindowMaxSize * 0.03,
                                    fontWeight: 'bold',
                                }}>
                                +{iap.title}
                            </Text>
                            <Text
                                style={{
                                    color: scheme !== 'dark' ? Color_Text : Color_BG,
                                    fontSize: WindowMaxSize * 0.03,
                                }}>
                                {iap.priceString}
                            </Text>
                        </TouchableOpacity>
                    )
                })
            }
        </BottomSheetView >
    );

}

export default IAPView;