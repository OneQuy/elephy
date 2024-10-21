import React, { } from 'react';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';
import { BorderRadius, Gap, Outline } from '../Constants/Constants_Outline';
import { GetWindowSize_Max } from '../../Common/UtilsTS';
import { Color_BG, Color_Text } from '../Hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { AllIAPProducts } from '../../Common/SpecificConstants';

const WindowMaxSize = GetWindowSize_Max()

const IntroText = `⭐ Add a set number of downloads with no expiration.

⭐ Only count when the file is downloaded or shared successfully.`

const IAPView = ({
}: {
    }) => {
    const scheme = useColorScheme()
    const insets = useSafeAreaInsets()

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
                AllIAPProducts.map((iap) => {
                    return (
                        < TouchableOpacity
                            key={iap.sku}
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
                                {iap.displayName}
                            </Text>
                            <Text
                                style={{
                                    color: scheme !== 'dark' ? Color_Text : Color_BG,
                                    fontSize: WindowMaxSize * 0.03,
                                }}>
                                10.000đ
                            </Text>
                        </TouchableOpacity>
                    )
                })
            }
        </BottomSheetView >
    );

}

export default IAPView;