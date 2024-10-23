import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { BorderRadius, Gap, Outline } from '../Constants/Constants_Outline';
import { GetWindowSize_Max, ToCanPrint } from '../../Common/UtilsTS';
import { Color_BG, Color_Text } from '../Hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { PurchasesStoreProduct } from 'react-native-purchases';
import { RevenueCat } from '../../Common/RevenueCat/RevenueCat';
import useLocalText from '../Hooks/useLocalText';

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
    const [handlingProduct, setHandlingProduct] = useState<PurchasesStoreProduct | undefined>()
    const texts = useLocalText()

    const onPressPurchaseAsync = async (product: PurchasesStoreProduct) => {
        if (handlingProduct)
            return

        setHandlingProduct(product)
        
        const res = await RevenueCat.PurchaseAsync(product)
        
        if (res === undefined) { // success
            // Alert.alert('Yahooo!', texts.purchase_success.replace
        }
        else if (res !==  null) { // error
            Alert.alert('Error', ToCanPrint(res));
        }
        
        setHandlingProduct(undefined)
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
                    fontWeight: '600',
                    textAlign: 'center',
                }}>
                Additional Downloads
            </Text>

            {/* intro  */}
            <Text
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
                            disabled={handlingProduct !== undefined}
                            onPress={() => onPressPurchaseAsync(iap)}
                            style={{
                                padding: Outline.Big,
                                minHeight: WindowMaxSize * 0.07,
                                backgroundColor: scheme === 'dark' ? Color_Text : Color_BG,
                                borderRadius: BorderRadius.Normal,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            {/* quatity */}
                            <Text
                                style={{
                                    color: scheme !== 'dark' ? Color_Text : Color_BG,
                                    fontSize: WindowMaxSize * 0.03,
                                    fontWeight: '200',
                                }}>
                                +{iap.description}
                            </Text>
                            
                            {/* loading / price */}
                            {
                                handlingProduct === iap ?
                                    <ActivityIndicator /> :
                                    // price
                                    <Text
                                        style={{
                                            color: scheme !== 'dark' ? Color_Text : Color_BG,
                                            fontSize: WindowMaxSize * 0.02,
                                            fontWeight: '500'
                                        }}>
                                        {iap.priceString}
                                    </Text>
                            }
                        </TouchableOpacity>
                    )
                })
            }
        </BottomSheetView >
    );

}

export default IAPView;