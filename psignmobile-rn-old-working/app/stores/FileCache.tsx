// import RNFetchBlob from "react-native-fetch-blob";

// const { fs } = RNFetchBlob;

// export const baseCacheDir = fs.dirs.CacheDir + "/videocache";

interface IVideoCache {
  [key: string]: Promise<string>;
}

//download cache..
const activeDownloads: IVideoCache = {};
export function downloadVideo(fromUrl: string, toFile: string) {
  // use toFile as the key
  // activeDownloads[toFile] = new Promise((resolve, reject) => {
  //   RNFetchBlob.config({ path: toFile })
  //     .fetch("GET", fromUrl)
  //     .then(res => {
  //       if (Math.floor(res.respInfo.status / 100) !== 2) {
  //         console.log("Failed to successfully download video: " + fromUrl);
  //         throw new Error("Failed to successfully download video");
  //       }
  //       resolve(toFile);
  //     })
  //     .catch(err => {
  //       return deleteFile(toFile).then(() => reject(err));
  //     })
  //     .finally(() => {
  //       // cleanup
  //       delete activeDownloads[toFile];
  //     });
  // });
  return activeDownloads[toFile];
}

//To delete a file..

function deleteFile(filePath) {
  // return fs
  //   .stat(filePath)
  //   .then(res => res && res.type === "file")
  //   .then(exists => exists && fs.unlink(filePath)) //if file exist
  //   .catch(err => {
  //     // swallow error to always resolve
  //   });
}
