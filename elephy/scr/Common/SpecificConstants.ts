// CHANGE ALL :) 
//
// Created on 17 may 2024 (Coding Vocaby)

import { createContext } from "react"
import { AppContextType, IAPProduct, OnSetSubcribeDataAsyncFuncParam } from "./SpecificType"


export const AndroidLink = "market://details?id=com.vocabulary_notification"
export const iOSLink = "https://apps.apple.com/us/app/vocabulary-notification-vocaby/id6502538703"
export const ShortLink = "https://onelink.to/45p9ky"
export const TwitterUrl = 'https://x.com/vocaby_app'

export const AppName = 'Elephy'

export const ShareAppContent =
    'Vocaby is your pocket English tutor, delivering vocabulary lessons directly to your mobile device through convenient notifications. Enhance your English skills effortlessly on the go!' +
    '\n\n' +
    '👉 Download now: ' +
    `${ShortLink}`


export const ProductId_Standard = 'elephy_1_usd'
export const ProductId_Mega = 'elephy_10_usd'

export const AllIAPProducts: IAPProduct[] = [
    {
        sku: ProductId_Standard,
        isConsumable: true,
    },
    {
        sku: ProductId_Mega,
        isConsumable: true,
    },
]

export const DefaultAppContext: AppContextType = { // CHANGE OPTIONAL
    subscribedData: undefined,
    isReviewMode: false,
    onSetSubcribeDataAsync: async (_: OnSetSubcribeDataAsyncFuncParam) => {
        console.error('[NE] ???');
    },
}

export const AppContext = createContext<AppContextType>(DefaultAppContext) // NO CHANGE