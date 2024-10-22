// NUMBER [CHANGE HERE]: 0

import { useEffect, useState } from "react"
import { PurchasesStoreProduct } from "react-native-purchases"
import { RevenueCat } from "./RevenueCat"
import { IAPProduct } from "../SpecificType"

// Created Oct 2024 (coding Elephy)

// Setup: RevenueCat.ts

export const useRevenueCatProduct = (products: IAPProduct[]) => {
    const [fetchedProducts, setFetchedProducts] = useState<PurchasesStoreProduct[] | undefined>()

    useEffect(() => {
        (async () => {
            // [{"currencyCode": "VND", "description": "500 Downloads", "discounts": [], "identifier": "elephy_1_usd", "introPrice": null, "price": 29000, "priceString": "29.000đ", "productCategory": "NON_SUBSCRIPTION", "productType": "CONSUMABLE", "subscriptionPeriod": null, "title": "500 Downloads"}]
            
            const items = await RevenueCat.GetProductsAsync(products)

            if (Array.isArray(items))
                setFetchedProducts(items)

            console.log(items);
        })()
    }, [])

    return products
}