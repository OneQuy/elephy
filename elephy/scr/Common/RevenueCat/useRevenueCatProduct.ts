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
            
            
            const items = await RevenueCat.GetProductsAsync(products)

            if (Array.isArray(items))
                setFetchedProducts(items)

            console.log(items);
        })()
    }, [])

    return products
}