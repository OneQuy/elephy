import { GetNumberIntAsync, GetNumberIntAsync_WithCheckAndResetNewDay, IncreaseNumberAsync, IncreaseNumberAsync_WithCheckAndResetNewDay } from "../Common/AsyncStorageUtils"
import { GetRemoteConfigWithCheckFetchAsync } from "../Common/RemoteConfig"
import { SafeValue } from "../Common/UtilsTS"
import { StorageKey_DownloadApp_BoughtDowloadCountRemain, StorageKey_DownloadApp_TodayTotalDownloadedSuccessCount } from "./Constants/StorageKey"

export const HandleCountAfterDownloadSuccessAsync = async (): Promise<void> => {
    // bought

    const boughtDowloadCountRemain = await GetNumberIntAsync(StorageKey_DownloadApp_BoughtDowloadCountRemain, 0)

    if (boughtDowloadCountRemain > 0) {
        await IncreaseNumberAsync(StorageKey_DownloadApp_BoughtDowloadCountRemain, 0, -1)
        return
    }

    // no bought

    const i  =await IncreaseNumberAsync_WithCheckAndResetNewDay(StorageKey_DownloadApp_TodayTotalDownloadedSuccessCount, 0, 1)

    console.log('aaa', i);
    
}

export const GetDisplayDownloadAvailableCountAsync = async (): Promise<number> => {
    const boughtDowloadCountRemain = await GetNumberIntAsync(StorageKey_DownloadApp_BoughtDowloadCountRemain, 0)

    if (boughtDowloadCountRemain > 0)
        return boughtDowloadCountRemain

    const remoteConfig = await GetRemoteConfigWithCheckFetchAsync()
    const dailyFreeDownloadCount = SafeValue(remoteConfig?.dailyFreeDownloadCount, 2)

    const todayTotalDownloadedSuccessCount = await GetNumberIntAsync_WithCheckAndResetNewDay(StorageKey_DownloadApp_TodayTotalDownloadedSuccessCount, 0)

    console.log(dailyFreeDownloadCount,  todayTotalDownloadedSuccessCount);
    
    return Math.max(0, dailyFreeDownloadCount - todayTotalDownloadedSuccessCount)
}