import React, { } from 'react';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';
import { BorderRadius, Outline } from '../Constants/Constants_Outline';
import { GetWindowSize_Max } from '../../Common/UtilsTS';
import { Color_BG, Color_Text } from '../Hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetView } from '@gorhom/bottom-sheet';

const WindowMaxSize = GetWindowSize_Max()

const IAPView = ({
}: {
    }) => {
    const scheme = useColorScheme()
    const insets = useSafeAreaInsets()

    return (
        <BottomSheetView style={{ flex: 1, padding: Outline.Normal, paddingBottom: Math.max(insets.bottom, 10) }}
        >
            {/* 500 btn  */}
            <TouchableOpacity
                style={{
                    padding: Outline.Big,
                    backgroundColor: scheme === 'dark' ? Color_Text : Color_BG,
                    borderRadius: BorderRadius.Normal
                }}
            >
                <Text
                    style={{
                        color: scheme !== 'dark' ? Color_Text : Color_BG
                    }}>
                    500 Downloads
                </Text>
            </TouchableOpacity>
        </BottomSheetView>
    );

}

export default IAPView;