import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { BorderRadius, Gap, Outline } from '../Constants/Constants_Outline';
import { GetWindowSize_Max, ToCanPrint } from '../../Common/UtilsTS';
import { Color_BG, Color_Text } from '../Hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { PurchasesStoreProduct } from 'react-native-purchases';
import { RevenueCat } from '../../Common/RevenueCat/RevenueCat';
import useLocalText from '../Hooks/useLocalText';
import { AddDownloadsAsync, GetAdditionalDownloadsNumberAsync } from '../AppUtils';
import { DefaultAdditionalNumbers } from '../Constants/AppConstants';
import { ProductId_Standard } from '../../Common/SpecificConstants';

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
    const [additionalNumbers, setAdditionalNumbers] = useState<number[]>(DefaultAdditionalNumbers)
    const texts = useLocalText()

    const onPressPurchaseAsync = async (product: PurchasesStoreProduct) => {
        if (handlingProduct)
            return

        setHandlingProduct(product)

        const res = await RevenueCat.PurchaseAsync(product)

        if (res === undefined) { // success
            const numToAdd = additionalNumbers[product.identifier === ProductId_Standard ? 0 : 1]
            Alert.alert('Yahooo!', texts.purchase_success.replace('###', numToAdd.toString()))
            await AddDownloadsAsync(numToAdd)
        }
        else if (res !== null) { // error
            Alert.alert('Error', ToCanPrint(res));
        }

        setHandlingProduct(undefined)
    }

    useEffect(() => {
        (async () => {
            setAdditionalNumbers(await GetAdditionalDownloadsNumberAsync())
        })()
    }, [])

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
                                +{additionalNumbers[iap.identifier === ProductId_Standard ? 0 : 1]} Downloads
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