// NUMBER [CHANGE HERE]: 0

import { useEffect, useState } from "react"
import Purchases, { PurchasesStoreProduct } from "react-native-purchases"

// Created Oct 2024 (coding Elephy)

// Setup: RevenueCat.ts

export const useRevenueCatProduct = (ids: string[]) => {
    const [products, setProducts] = useState<PurchasesStoreProduct[] | undefined>()

    useEffect(() => {
        (async () => {
            const items = await Purchases.getProducts(ids)

            setProducts(items)

            console.log(items);

        })()
    }, [])

    return products
}