// NUMBER [CHANGE HERE]: 0

import { useEffect, useState } from "react"
import { PurchasesStoreProduct } from "react-native-purchases"
import { IAPProduct } from "../SpecificType"

// Created Oct 2024 (coding Elephy)

// Setup: RevenueCat.ts

export const useRevenueCatProduct = (product: IAPProduct) => {
    const [fetchedProduct, setFetchedProduct] = useState<PurchasesStoreProduct | undefined>()

    useEffect(() => {
        (async () => {
            // const items = await RevenueCat.GetAllProductsWithCheckLocalCacheAsync([product])

            // if (Array.isArray(items))
            //     setFetchedProduct(items)

            // console.log(items);
        })()
    }, [])

    return fetchedProduct
}