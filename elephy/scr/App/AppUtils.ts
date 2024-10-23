import { GetNumberIntAsync, GetNumberIntAsync_WithCheckAndResetNewDay, IncreaseNumberAsync, IncreaseNumberAsync_WithCheckAndResetNewDay } from "../Common/AsyncStorageUtils"
import { GetRemoteConfigWithCheckFetchAsync } from "../Common/RemoteConfig"
import { ProductId_Standard } from "../Common/SpecificConstants"
import { IAPProduct } from "../Common/SpecificType"
import { ExtractAllNumbersInText, IsValuableArrayOrString, SafeArrayLength, SafeValue } from "../Common/UtilsTS"
import { StorageKey_DownloadApp_BoughtDowloadCountRemain, StorageKey_DownloadApp_TodayTotalDownloadedSuccessCount } from "./Constants/StorageKey"

export const HandleCountAfterDownloadSuccessAsync = async (): Promise<void> => {
    // bought

    const boughtDowloadCountRemain = await GetNumberIntAsync(StorageKey_DownloadApp_BoughtDowloadCountRemain, 0)

    if (boughtDowloadCountRemain > 0) {
        await IncreaseNumberAsync(StorageKey_DownloadApp_BoughtDowloadCountRemain, 0, -1)
        return
    }

    // no bought

    await IncreaseNumberAsync_WithCheckAndResetNewDay(StorageKey_DownloadApp_TodayTotalDownloadedSuccessCount, 0, 1)

    // console.log('aaa', i);
}

export const GetAdditionalDownloadsNumberAsync = async (product: IAPProduct): Promise<number> => {
    const returnDefault = () => {
        if (product.sku === ProductId_Standard)
            return 300
        else // mega
            return 5000
    }

    const config = await GetRemoteConfigWithCheckFetchAsync()

    if (!config)
        return returnDefault()

    const allNumbers = ExtractAllNumbersInText(config.additionalDownloads)

    if (SafeArrayLength(allNumbers) < 2)
        return returnDefault()

    if (product.sku === ProductId_Standard)
        return allNumbers[0]
    else // mega
        return allNumbers[1]
}

export const AddDownloadsAsync = async (add: number): Promise<void> => {
    await IncreaseNumberAsync(StorageKey_DownloadApp_BoughtDowloadCountRemain, 0, add)
}

export const GetDisplayDownloadAvailableCountAsync = async (): Promise<number> => {
    const boughtDowloadCountRemain = await GetNumberIntAsync(StorageKey_DownloadApp_BoughtDowloadCountRemain, 0)

    if (boughtDowloadCountRemain > 0)
        return boughtDowloadCountRemain

    const remoteConfig = await GetRemoteConfigWithCheckFetchAsync()
    const dailyFreeDownloadCount = SafeValue(remoteConfig?.dailyFreeDownloadCount, 2)

    const todayTotalDownloadedSuccessCount = await GetNumberIntAsync_WithCheckAndResetNewDay(StorageKey_DownloadApp_TodayTotalDownloadedSuccessCount, 0)

    // console.log(dailyFreeDownloadCount,  todayTotalDownloadedSuccessCount);

    return Math.max(0, dailyFreeDownloadCount - todayTotalDownloadedSuccessCount)
}