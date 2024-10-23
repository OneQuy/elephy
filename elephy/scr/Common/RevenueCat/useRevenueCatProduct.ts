// NUMBER [CHANGE HERE]: 0

// Created Oct 2024 (coding Elephy)

// Setup: RevenueCat.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { IAPProduct } from "../SpecificType"
import { PRODUCT_CATEGORY, PurchasesStoreProduct } from "react-native-purchases"
import { RevenueCat } from "./RevenueCat"
import { IsValuableArrayOrString } from "../UtilsTS"

export const useRevenueCatProduct = (targetProduct?: IAPProduct | string, category?: PRODUCT_CATEGORY): {
    fetchedAllProducts: undefined | PurchasesStoreProduct[],
    fetchedTargetProduct: undefined | PurchasesStoreProduct,
    fetchedError: undefined | Error,
    localPrice: string | undefined,
} => {
    const [fetchedAllProducts, setFetchedAllProducts] = useState<PurchasesStoreProduct[] | undefined>()
    const [fetchedError, setFetchedError] = useState<Error | undefined>()
    const fetchTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

    const fetchedTargetProduct = useMemo(() => {
        if (targetProduct === undefined)
            return undefined

        if (!IsValuableArrayOrString(fetchedAllProducts))
            return undefined

        if (typeof targetProduct === 'string')
            return fetchedAllProducts.find(i => i.identifier === targetProduct)
        else
            return fetchedAllProducts.find(i => i.identifier === targetProduct.sku)
    }, [fetchedAllProducts, targetProduct])

    const fetchListProducts = useCallback(async () => {
        console.log('fetching list all products...');
        
        const itemsOrError = await RevenueCat.FetchAllProductsWithCheckLocalCacheAsync(category)

        if (Array.isArray(itemsOrError)) {
            setFetchedAllProducts(itemsOrError)
            setFetchedError(undefined)
        }
        else {
            fetchTimeout.current = setTimeout(fetchListProducts, 1000)
            setFetchedError(itemsOrError)
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
        fetchedError,
        localPrice: fetchedTargetProduct ? fetchedTargetProduct.priceString : undefined,
    } as const
}