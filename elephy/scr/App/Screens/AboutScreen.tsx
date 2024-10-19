import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, SafeAreaView, StatusBar } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { UserID } from '../../Common/UserID'
import Clipboard from '@react-native-community/clipboard'
import useLocalText from '../Hooks/useLocalText'
import { CheckTapSetDevPersistence, IsDev } from '../../Common/IsDev'
import { ContactType } from '../../Common/SpecificType'
import { OpenStoreForRatingAsync, PressContactAsync } from '../../Common/SpecificUtils'
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView'
import { BorderRadius, Gap, Outline } from '../Constants/Constants_Outline'
import { AppName } from '../../Common/SpecificConstants'
import WealthText from '../../Common/Components/WealthText'
import { VersionAsNumber } from '../../Common/CommonConstants'
import OneQuyApp from '../../Common/Components/OneQuyApp'
import { TrackOneQuyApps } from '../../Common/Tracking'
import { Screen } from '../Constants/Types'
import { Color_BG, Color_BG2, Color_Text, Color_Text2, Color_Text3 } from '../Hooks/useTheme'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { LucideIcon } from '../../Common/Components/LucideIcon'

const EffectScaleUpOffset = 100

const FontSizeNormal = 15
const FontSizeSmall = 12

const AboutStyle = StyleSheet.create({
    master: {
        width: '100%',
        backgroundColor: Color_BG2,

        borderRadius: BorderRadius.Normal,

        flexDirection: 'row',
        padding: Outline.Normal,

        justifyContent: 'space-between',
        alignItems: 'center',

        gap: Gap.Normal,
    },

    master_Column: {
        backgroundColor: Color_BG2,
        borderRadius: BorderRadius.Normal,
        padding: Outline.Normal,
        justifyContent: 'center',
        width: '100%',
        gap: Gap.Small,
    },

    leftPanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: Gap.Small,
    },

    titleTxt: {
        color: Color_Text,
        fontSize: FontSizeNormal,
        fontWeight: 'bold'
    },

    contentTxt: {
        color: Color_Text2,
        fontSize: FontSizeNormal,
    },
})

const About = ({
    changeScreen
}: {
    changeScreen: (screen: Screen) => void,
}) => {
    const [isHandling, set_isHandling] = useState(false)
    const texts = useLocalText()

    // const [expiredSaleLine, set_expiredSaleLine] = useState<undefined | string>(undefined)
    // const { subscribedData, onSetSubcribeDataAsync, isReviewMode } = useContext(AppContext)

    // const [currentLifetimeProduct, set_currentLifetimeProduct] = useState<undefined | IAPProduct>(undefined)

    // const { isReadyPurchase, localPrice, initErrorObj, fetchedProducts } = useMyIAP(
    //     AllIAPProducts,
    //     async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
    //     async () => AsyncStorage.getItem(StorageKey_CachedIAP),
    //     currentLifetimeProduct
    // )

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { 
                flex: 1,
                backgroundColor: Color_BG,
             },

            scrollView: {
                gap: Gap.Normal,
                padding: Outline.Normal,
            },

            contactItemTitleTxt: {
                color: Color_Text2,
                fontSize: FontSizeSmall
            },

            contactItemContentTxt: {
                color: Color_Text3,
                fontSize: FontSizeNormal,
                textDecorationLine: 'underline',
            },

            normalBtnTxt: { fontSize: FontSizeNormal, },

            // purchaseBtn: {
            //     borderWidth: 0,
            //     borderRadius: BR,
            //     maxWidth: '50%',
            //     alignSelf: 'center',
            //     padding: Outline.Normal,
            // },

            // currentPriceTxt: Object.assign(
            //     {},
            //     SettingItemPanelStyle.explainTxt,
            //     {
            //         color: 'chartreuse',
            //         fontWeight: '800',
            //     } as StyleProp<TextStyle>
            // ),

            // crossOriginPriceTxt: Object.assign(
            //     {},
            //     SettingItemPanelStyle.explainTxt,
            //     {
            //         textDecorationLine: 'line-through',
            //         color: 'firebrick'
            //     } as StyleProp<TextStyle>
            // ),

            insideBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Normal,
                padding: Outline.Small,
                minWidth: '20%',
            },
        })
    }, [])

    // const renderPriceLine = useCallback(() => {
    //     const arr: WealthTextConfig[] = [
    //         {
    //             text: `${texts.current_price}: `,
    //             textStyle: SettingItemPanelStyle.explainTxt,
    //         },
    //         {
    //             text: `${localPrice ?? '...'}`,
    //             textStyle: style.currentPriceTxt,
    //         }
    //     ]

    //     const discountTxts = GetPercentDiscountTxtAndOriginLocalizedPriceTxt(IapProductMax, currentLifetimeProduct, fetchedProducts)

    //     if (discountTxts && expiredSaleLine) {
    //         // percent

    //         arr.push({
    //             text: ` (-${discountTxts.percentDiscountTxt}%, `,
    //             textStyle: SettingItemPanelStyle.explainTxt,
    //         })

    //         // origin price

    //         arr.push({
    //             text: discountTxts.originLocalizedPriceTxt,
    //             textStyle: style.crossOriginPriceTxt
    //         })

    //         // close bracket

    //         arr.push({
    //             text: ')',
    //             textStyle: SettingItemPanelStyle.explainTxt,
    //         })
    //     }

    //     return (
    //         <WealthText textConfigs={arr} />
    //     )
    // }, [localPrice, expiredSaleLine, fetchedProducts, texts, currentLifetimeProduct, SettingItemPanelStyle, style])

    // const onPressRestorePurchaseAsync = useCallback(async () => {
    //     set_isHandling(true)

    //     const products = await RestorePurchaseAsync()

    //     // LogStringify(products)

    //     let restoreResultForTracking = ''

    //     if (Array.isArray(products)) { // available products to restore
    //         const firstProduct = SafeGetArrayElement<Purchase>(products)

    //         if (firstProduct) {
    //             await onSetSubcribeDataAsync(firstProduct.productId)

    //             restoreResultForTracking = 'success_' + firstProduct.productId
    //         }
    //         else {
    //             restoreResultForTracking = 'no_product'

    //             Alert.alert(
    //                 texts.popup_error,
    //                 texts.restore_purchase_no_products +
    //                 (products.length > 0 ? '\n\n' + ToCanPrintError(products) : ''))
    //         }
    //     }
    //     else if (products !== null) { // error
    //         restoreResultForTracking = 'error'
    //         Alert.alert(texts.popup_error, texts.restore_purchase_no_products + '\n\n' + ToCanPrintError(products))
    //     }
    //     else { // user canceled
    //         restoreResultForTracking = 'cancel'
    //     }

    //     set_isHandling(false)

    //     TrackSimpleWithParam('restore_purchase', restoreResultForTracking, true)
    // }, [texts, onSetSubcribeDataAsync])

    const onPressCopyUserId = useCallback(() => {
        Clipboard.setString(UserID())
        Alert.alert(texts.copied + '!', 'Your User ID:\n\n' + UserID())
    }, [texts])

    const onPressCheatSetDev = useCallback(() => {
        const didSet = CheckTapSetDevPersistence()

        if (didSet)
            Alert.alert('dev!')
    }, [])

    // const onPressCheatResetProDev = useCallback(() => {
    //     onSetSubcribeDataAsync(undefined)
    // }, [onSetSubcribeDataAsync])

    const onPressUIContactAsync = useCallback(async (type: ContactType) => {
        if (isHandling)
            return

        set_isHandling(true)

        await PressContactAsync(texts, type)

        set_isHandling(false)
    }, [texts, isHandling])

    // const onPressUpgradeAsync = useCallback(async () => {
    //     if (isHandling || !isReadyPurchase || !currentLifetimeProduct)
    //         return

    //     set_isHandling(true)

    //     await PurchaseAndTrackingAsync(currentLifetimeProduct.sku, onSetSubcribeDataAsync)

    //     set_isHandling(false)
    // }, [
    //     onSetSubcribeDataAsync,
    //     isHandling,
    //     isReadyPurchase,
    //     currentLifetimeProduct,
    // ])

    // const renderReviewIAP = useCallback(() => {
    //     if (!isReviewMode)
    //         return undefined

    //     const arr = [
    //         {
    //             sku: 'vocaby_pro_best_sale',
    //             name: '1 Month'
    //         },
    //         {
    //             sku: 'vocaby_2_usd',
    //             name: '3 Month'
    //         },
    //         {
    //             sku: 'vocaby_lifetime',
    //             name: '6 Month'
    //         },
    //         {
    //             sku: 'vocaby_lifetime_pro',
    //             name: '12 Month'
    //         },
    //         {
    //             sku: 'vocaby_lifetime_max',
    //             name: 'Lifetime'
    //         }
    //     ]

    //     return arr.map(product => {
    //         return (
    //             <LucideIconTextEffectButton
    //                 key={product.sku}
    //                 unselectedColorOfTextAndIcon={Color_Text3}

    //                 selectedColorOfTextAndIcon={Color_BG}
    //                 selectedBackgroundColor={Color_Text3}

    //                 manuallySelected={currentLifetimeProduct?.sku === product.sku}

    //                 style={style.restoreBtn}

    //                 title={product.name}
    //                 titleProps={{ style: style.normalBtnTxt }}

    //                 onPress={() => {
    //                     const prod = AllIAPProducts.find(i => i.sku === product.sku)

    //                     if (prod)
    //                         set_currentLifetimeProduct(prod)
    //                 }}
    //             />
    //         )
    //     })
    // }, [isReviewMode, currentLifetimeProduct])

    // useEffect(() => {
    //     (async () => {
    //         set_isHandling(true)

    //         // fetch premium product id

    //         const remoteConfig = await GetRemoteConfigWithCheckFetchAsync(false)

    //         const premiumProduct = GetCurrentLifetimeProduct(remoteConfig)

    //         set_currentLifetimeProduct(premiumProduct)

    //         // sale expired line

    //         const saleEndTick = SafeValue(remoteConfig?.saleEndTick, 0)

    //         if (Date.now() < saleEndTick) {
    //             set_expiredSaleLine(`${texts.sale_ends.replace('###', SafeDateString(new Date(saleEndTick), '/'))}`)
    //         }

    //         // done

    //         set_isHandling(false)
    //     })()
    // }, [])

    return (
        <SafeAreaView pointerEvents={isHandling ? 'none' : 'auto'} style={style.master}>
            <StatusBar backgroundColor={Color_BG} barStyle={'dark-content'} />

            {/* back btn */}
            <View
                onTouchEnd={() => changeScreen('download')}
                style={{ justifyContent: 'center', marginLeft: Outline.Normal, }}
            >
                <LucideIcon name='MoveLeft' size={30} color={'black'} strokeWidth={1.5} />
            </View>
            <ScrollView contentContainerStyle={style.scrollView}>
                {/* pro upgrade */}
                {
                    // !subscribedData &&
                    // <ScaleUpView delay={EffectScaleUpOffset * 0}>
                    //     <View style={SettingItemPanelStyle.master_Column}>
                    //         {/* title */}
                    //         <Text style={SettingItemPanelStyle.titleTxt}>{texts.vocaby_lifetime}</Text>

                    //         {/* cheat review mode */}
                    //         {
                    //             isReviewMode &&
                    //             <View>
                    //                 {
                    //                     renderReviewIAP()
                    //                 }
                    //             </View>
                    //         }

                    //         {/* explain */}
                    //         <Text style={SettingItemPanelStyle.explainTxt}>{texts.vocaby_lifetime_explain}</Text>

                    //         {/* price */}
                    //         {
                    //             renderPriceLine()
                    //         }

                    //         {/* expired date */}
                    //         {
                    //             expiredSaleLine &&
                    //             <Text style={SettingItemPanelStyle.explainTxt}>{expiredSaleLine}</Text>
                    //         }

                    //         {/* isHandling */}
                    //         {
                    //             isHandling &&
                    //             <ActivityIndicator color={Color_Text3} />
                    //         }

                    //         {/* erroring */}
                    //         {
                    //             !isReadyPurchase &&
                    //             <Text style={SettingItemPanelStyle.explainTxt}>
                    //                 {
                    //                     '[Not ready to purchase]' +
                    //                     (initErrorObj === undefined ? '' : ` ${ToCanPrintError(initErrorObj)}`)
                    //                 }
                    //             </Text>
                    //         }

                    //         {/* btn upgrade*/}
                    //         {
                    //             !isHandling && isReadyPurchase && currentLifetimeProduct &&
                    //             <LucideIconTextEffectButton
                    //                 selectedBackgroundColor={Color_Text3}
                    //                 selectedColorOfTextAndIcon={Color_BG}

                    //                 notChangeToSelected
                    //                 manuallySelected={true}
                    //                 canHandlePressWhenSelected

                    //                 style={style.purchaseBtn}

                    //                 title={texts.upgrade}
                    //                 titleProps={{ style: style.normalBtnTxt }}

                    //                 onPress={onPressUpgradeAsync}
                    //             />
                    //         }
                    //     </View>
                    // </ScaleUpView>
                }

                {/* restore purchase */}
                {
                    // !subscribedData &&
                    // <ScaleUpView delay={EffectScaleUpOffset * 1}>
                    //     <View style={SettingItemPanelStyle.master}>
                    //         {/* title */}
                    //         <Text
                    //             style={SettingItemPanelStyle.titleTxt}
                    //         >
                    //             {texts.restore_purchase}
                    //         </Text>

                    //         {/* isHandling */}
                    //         {
                    //             isHandling &&
                    //             <ActivityIndicator color={Color_Text3} />
                    //         }

                    //         {/* btn restore */}
                    //         {
                    //             !isHandling &&
                    //             <LucideIconTextEffectButton
                    //                 unselectedColorOfTextAndIcon={Color_Text3}

                    //                 notChangeToSelected
                    //                 manuallySelected={false}

                    //                 style={style.restoreBtn}

                    //                 title={texts.restore}
                    //                 titleProps={{ style: style.normalBtnTxt }}

                    //                 onPress={onPressRestorePurchaseAsync}
                    //             />
                    //         }
                    //     </View>
                    // </ScaleUpView>
                }

                {/* Rate */}
                {
                    <ScaleUpView delay={EffectScaleUpOffset * 1}>
                        <View style={AboutStyle.master}>
                            {/* title */}
                            <Text
                                // onPress={IsDev() ? onPressCheatResetProDev : undefined}
                                style={AboutStyle.titleTxt}
                            >
                                {texts.rate_app.replace('###', AppName)}
                            </Text>

                            {/* isHandling */}
                            {
                                isHandling &&
                                <ActivityIndicator color={Color_Text3} />
                            }

                            {/* btn rate */}
                            {
                                !isHandling &&
                                <LucideIconTextEffectButton
                                    unselectedColorOfTextAndIcon={Color_BG}

                                    // notChangeToSelected
                                    manuallySelected={true}
                                    canHandlePressWhenSelected

                                    style={style.insideBtn}

                                    title={texts.rate}
                                    titleProps={{ style: style.normalBtnTxt }}

                                    onPress={OpenStoreForRatingAsync}
                                />
                            }
                        </View>
                    </ScaleUpView>
                }

                {/* contact */}
                <ScaleUpView delay={EffectScaleUpOffset * 2}>
                    <View style={AboutStyle.master_Column}>
                        {/* title community */}
                        {
                            /* <Text style={AboutStyle.titleTxt}>{texts.community}</Text>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={AboutStyle.contentTxt}>{texts.follow_community.replace('###', AppName)}</Text> */
                        }

                        {/* X */}
                        {/* <WealthText
                            onPressOverall={() => onPressUIContactAsync('twitter_app')}
                            textConfigs={[
                                {
                                    text: 'Twitter (X): ',
                                    textStyle: style.contactItemTitleTxt
                                },
                                {
                                    text: '@vocaby_app',
                                    textStyle: style.contactItemContentTxt
                                }
                            ]}
                        /> */}

                        {/* title */}
                        <Text style={AboutStyle.titleTxt}>{texts.contact_dev}</Text>

                        {/* email */}
                        <WealthText
                            onPressOverall={() => onPressUIContactAsync('email')}
                            textConfigs={[
                                {
                                    text: 'Email: ',
                                    textStyle: style.contactItemTitleTxt
                                },
                                {
                                    text: 'onequy@gmail.com',
                                    textStyle: style.contactItemContentTxt
                                }
                            ]}
                        />

                        {/* X (onequy) */}
                        <WealthText
                            onPressOverall={() => onPressUIContactAsync('twitter_onequy')}
                            textConfigs={[
                                {
                                    text: 'Twitter (X): ',
                                    textStyle: style.contactItemTitleTxt
                                },
                                {
                                    text: '@onequy',
                                    textStyle: style.contactItemContentTxt
                                }
                            ]}
                        />
                    </View>
                </ScaleUpView>

                {/* onequy apps */}
                <ScaleUpView delay={EffectScaleUpOffset * 3}>
                    <View style={AboutStyle.master_Column}>
                        {/* title */}
                        <Text onPress={IsDev() ? onPressCheatSetDev : undefined} style={AboutStyle.titleTxt}>{texts.onequy_apps}:</Text>

                        <OneQuyApp
                            onEvent={TrackOneQuyApps}
                            excludeAppName={AppName}
                            primaryColor={Color_Text}
                            counterPrimaryColor={Color_BG}
                            backgroundColor={Color_BG2}
                            counterBackgroundColor={Color_Text}
                            fontSize={FontSizeSmall}
                        />
                    </View>
                </ScaleUpView>

                {/* version + user id */}
                <WealthText
                    textConfigs={[
                        {
                            text: 'Version: v' + VersionAsNumber + ' - ',
                            textStyle: AboutStyle.contentTxt
                        },
                        {
                            text: 'User ID',
                            textStyle: style.contactItemContentTxt,
                            onPress: onPressCopyUserId,
                        }
                    ]}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default About