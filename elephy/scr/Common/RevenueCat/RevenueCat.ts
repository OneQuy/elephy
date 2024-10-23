// NUMBER [CHANGE HERE]: 0

// Created July 2024 (coding Vocaby)

// Install steps:
// 1. npm install --save react-native-purchases & npx pod install
// 2. <uses-permission android:name="com.android.vending.BILLING" />
// 3. Project Target -> Capabilities -> In-App Purchase
// 4. Add app https://app.revenuecat.com
//      4.1 App-Specific Share Secret: "App Information"  > "Manage" under the App-Specific Share Secret
//      4.2 Input file: SubscriptionKey_L4N6JM797Z.p8
//      4.3 Issuer ID: ff37b375-9d97-455f-8e63-03119b028cb8 (https://www.revenuecat.com/docs/assets/images/SCR-20240327-jygo-afa7c4d0a9d149e2975ebbabc689842c.png)
//      4.4 App Store Connect API:
//          4.4.1 Input file: AuthKey_8CL4MDR3H9.p8
//          4.4.2 Issuer ID: ff37b375-9d97-455f-8e63-03119b028cb8
//          4.4.3 Vendor number: 92639231 (https://www.revenuecat.com/docs/assets/images/SCR-20240327-kdtw-68de8f49409d1db164ffef1853c130cb.png)
// 5. Get API keys (ios & android)
// 6. Call PurchaseAsync('id')!

import { Platform } from "react-native";
import Purchases, { PRODUCT_CATEGORY, PurchasesStoreProduct } from "react-native-purchases";
import { CreateError, ExecuteWithTimeoutAsync, IsValuableArrayOrString, SafeArrayLength, TimeOutErrorObject, ToCanPrint, ToCanPrintError, UnknownErrorObject } from "../UtilsTS";
import { RevenueCat_Android, RevenueCat_iOS } from "../../../Keys";
import { GetArrayAsync, SetArrayAsync } from "../AsyncStorageUtils";
import { StorageKey_RevenueCatPackages } from "../../App/Constants/StorageKey";
import { FirebaseDatabaseTimeOutMs } from "../Firebase/FirebaseDatabase";
import { AllIAPProducts } from "../SpecificConstants";
import { UserID } from "../UserID";
import { Cheat } from "../Cheat";

const IsLog = __DEV__

const APIKeys = {
    apple: RevenueCat_iOS,
    google: RevenueCat_Android
};

export class RevenueCat {
    private static inited: boolean = false

    private static CheckInit() {
        if (this.inited)
            return

        if (IsLog) console.log('[RevenueCat] inited')

        this.inited = true

        if (Platform.OS === 'android') {
            Purchases.configure({ apiKey: APIKeys.google, appUserID: UserID() });
        } else {
            Purchases.configure({ apiKey: APIKeys.apple, appUserID: UserID() });
        }

        // Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    /**
     * @returns undefined if success
     * @returns null if user cancelled
     * @returns otherwise Error()
     */
    static PurchaseAsync = async (sku: string): Promise<Error | undefined | null> => {
        if (Cheat('force_iap_success')) {
            if (IsLog) console.log('[RevenueCat] CHEAT SUCCESS')
            return undefined
        }

        if (IsLog) console.log('[RevenueCat] purchasing....', sku)

        // init

        this.CheckInit()

        // load products

        const productsOrError = await this.FetchAllProductsWithCheckLocalCacheAsync();

        // error load products

        if (!Array.isArray(productsOrError))
            return productsOrError

        // find product

        const product = productsOrError.find(i => i.identifier === sku)

        if (!product)
            return new Error("Not found product: " + sku)

        // purchase

        try {
            const success = await Purchases.purchaseStoreProduct(product)

            if (IsLog) console.log('[RevenueCat] purchased success', ToCanPrint(success))

            return undefined // success
        }
        catch (e) {
            // @ts-ignore // user cancel

            if (e && e.userCancelled) {
                if (IsLog) console.log('[RevenueCat] purchased canceled')
                return null
            }

            // other error

            if (IsLog) console.log('[RevenueCat] purchased fail', ToCanPrintError(e))

            return CreateError(e)
        }
    }

    /**
     * ### note: only for getting ALL PRODUCTS
     * 
     * how it works:
     * 
     * * try get from store first (if success backup to local)
     * 
     * * fail? try to get local
     * @returns [{"currencyCode": "VND", "description": "500 Downloads", "discounts": [], "identifier": "elephy_1_usd", "introPrice": null, "price": 29000, "priceString": "29.000đ", "productCategory": "NON_SUBSCRIPTION", "productType": "CONSUMABLE", "subscriptionPeriod": null, "title": "500 Downloads"}]
     */
    static FetchAllProductsWithCheckLocalCacheAsync = async (category = PRODUCT_CATEGORY.NON_SUBSCRIPTION): Promise<PurchasesStoreProduct[] | Error> => {
        // init

        this.CheckInit()

        // get from store

        const res = await ExecuteWithTimeoutAsync(
            async () => await Purchases.getProducts(AllIAPProducts.map(i => i.sku), category),
            FirebaseDatabaseTimeOutMs
        )

        // fail => try get from local

        if (!IsValuableArrayOrString(res.result)) {
            const localProducts = await GetArrayAsync<PurchasesStoreProduct>(StorageKey_RevenueCatPackages)

            if (localProducts && SafeArrayLength(localProducts) === AllIAPProducts.length) {
                if (IsLog) console.log('[RevenueCat] FetchAllProductsWithCheckLocalCacheAsync from LOCAL, products count', SafeArrayLength(localProducts), localProducts.map(i => i.identifier).join('|'));
                return localProducts
            }
        }

        // errors

        if (res.isTimeOut) {
            if (IsLog) console.log('[RevenueCat] GetProductsAsync error timeout')
            return TimeOutErrorObject
        }

        if (!res.result) {
            if (IsLog) console.log('[RevenueCat] GetProductsAsync error (other)')
            return UnknownErrorObject
        }

        // sucess, save local

        const products = res.result

        await SetArrayAsync(StorageKey_RevenueCatPackages, products)

        if (IsLog) console.log('[RevenueCat] SUCCESS FetchAllProductsWithCheckLocalCacheAsync from STORE, products count', products.length, products.map(i => i.identifier).join('|'));

        // return

        return products
    };
}