// NUMBER [CHANGE HERE]: 0

// Created Oct 2024 (coding Elephy)

// Setup: RevenueCat.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { IAPProduct } from "../SpecificType"
import { PRODUCT_CATEGORY, PurchasesStoreProduct } from "react-native-purchases"
import { RevenueCat } from "./RevenueCat"

export const useRevenueCatProduct = (targetProduct: IAPProduct | string, category?: PRODUCT_CATEGORY): {
    fetchedAllProducts: undefined | PurchasesStoreProduct[],
    fetchedTargetProduct: undefined | PurchasesStoreProduct,
    localPrice: string | undefined,
} => {
    const [fetchedAllProducts, setFetchedAllProducts] = useState<PurchasesStoreProduct[]>([])
    const fetchTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

    const fetchedTargetProduct = useMemo(() => {
        if (targetProduct === undefined)
            return undefined

        if (fetchedAllProducts.length === 0)
            return undefined

        if (typeof targetProduct === 'string')
            return fetchedAllProducts.find(i => i.identifier === targetProduct)
        else
            return fetchedAllProducts.find(i => i.identifier === targetProduct.sku)
    }, [fetchedAllProducts, targetProduct])

    const fetchListProducts = useCallback(async () => {
        const items = await RevenueCat.FetchAllProductsWithCheckLocalCacheAsync(category)

        if (Array.isArray(items))
            setFetchedAllProducts(items)
        else {
            fetchTimeout.current = setTimeout(fetchListProducts, 1000)
        }
    }, [category])

    useEffect(() => {
        (async () => {
            fetchListProducts()
        })()

        return () => {
            clearTimeout(fetchTimeout.current)
        }
    }, [])

    return {
        fetchedAllProducts,
        fetchedTargetProduct,
        localPrice: fetchedTargetProduct ? fetchedTargetProduct.priceString : undefined,
    } as const
}