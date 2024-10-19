export type Screen = 'download' | 'about'

export type DownloadResultViewData = {
    thumbnail: string,
    title: string,
    medias: MediaDownloadItem[],
    duration?: string,
}

export type MediaDownloadItem = {
    url: string,
    quality?: string, // 480p 720p // 1080x1114k
    type?: string, // image / video / audio
    extension?: string,  // jpg mp4
    duration?: string,
}