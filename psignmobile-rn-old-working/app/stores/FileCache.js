"use strict";
// import RNFetchBlob from "react-native-fetch-blob";
Object.defineProperty(exports, "__esModule", { value: true });
//download cache..
const activeDownloads = {};
function downloadVideo(fromUrl, toFile) {
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
exports.downloadVideo = downloadVideo;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZUNhY2hlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRmlsZUNhY2hlLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscURBQXFEOztBQVVyRCxrQkFBa0I7QUFDbEIsTUFBTSxlQUFlLEdBQWdCLEVBQUUsQ0FBQztBQUN4QyxTQUFnQixhQUFhLENBQUMsT0FBZSxFQUFFLE1BQWM7SUFDM0Qsd0JBQXdCO0lBQ3hCLCtEQUErRDtJQUMvRCx5Q0FBeUM7SUFDekMsNkJBQTZCO0lBQzdCLHFCQUFxQjtJQUNyQiwyREFBMkQ7SUFDM0QsNEVBQTRFO0lBQzVFLG9FQUFvRTtJQUNwRSxVQUFVO0lBQ1YseUJBQXlCO0lBQ3pCLFNBQVM7SUFDVCxzQkFBc0I7SUFDdEIsMkRBQTJEO0lBQzNELFNBQVM7SUFDVCx1QkFBdUI7SUFDdkIsbUJBQW1CO0lBQ25CLHdDQUF3QztJQUN4QyxVQUFVO0lBQ1YsTUFBTTtJQUNOLE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFyQkQsc0NBcUJDO0FBRUQsb0JBQW9CO0FBRXBCLFNBQVMsVUFBVSxDQUFDLFFBQVE7SUFDMUIsWUFBWTtJQUNaLG9CQUFvQjtJQUNwQiw2Q0FBNkM7SUFDN0MsbUVBQW1FO0lBQ25FLG9CQUFvQjtJQUNwQix5Q0FBeUM7SUFDekMsUUFBUTtBQUNWLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUk5GZXRjaEJsb2IgZnJvbSBcInJlYWN0LW5hdGl2ZS1mZXRjaC1ibG9iXCI7XG5cbi8vIGNvbnN0IHsgZnMgfSA9IFJORmV0Y2hCbG9iO1xuXG4vLyBleHBvcnQgY29uc3QgYmFzZUNhY2hlRGlyID0gZnMuZGlycy5DYWNoZURpciArIFwiL3ZpZGVvY2FjaGVcIjtcblxuaW50ZXJmYWNlIElWaWRlb0NhY2hlIHtcbiAgW2tleTogc3RyaW5nXTogUHJvbWlzZTxzdHJpbmc+O1xufVxuXG4vL2Rvd25sb2FkIGNhY2hlLi5cbmNvbnN0IGFjdGl2ZURvd25sb2FkczogSVZpZGVvQ2FjaGUgPSB7fTtcbmV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZFZpZGVvKGZyb21Vcmw6IHN0cmluZywgdG9GaWxlOiBzdHJpbmcpIHtcbiAgLy8gdXNlIHRvRmlsZSBhcyB0aGUga2V5XG4gIC8vIGFjdGl2ZURvd25sb2Fkc1t0b0ZpbGVdID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAvLyAgIFJORmV0Y2hCbG9iLmNvbmZpZyh7IHBhdGg6IHRvRmlsZSB9KVxuICAvLyAgICAgLmZldGNoKFwiR0VUXCIsIGZyb21VcmwpXG4gIC8vICAgICAudGhlbihyZXMgPT4ge1xuICAvLyAgICAgICBpZiAoTWF0aC5mbG9vcihyZXMucmVzcEluZm8uc3RhdHVzIC8gMTAwKSAhPT0gMikge1xuICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFpbGVkIHRvIHN1Y2Nlc3NmdWxseSBkb3dubG9hZCB2aWRlbzogXCIgKyBmcm9tVXJsKTtcbiAgLy8gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gc3VjY2Vzc2Z1bGx5IGRvd25sb2FkIHZpZGVvXCIpO1xuICAvLyAgICAgICB9XG4gIC8vICAgICAgIHJlc29sdmUodG9GaWxlKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgICAuY2F0Y2goZXJyID0+IHtcbiAgLy8gICAgICAgcmV0dXJuIGRlbGV0ZUZpbGUodG9GaWxlKS50aGVuKCgpID0+IHJlamVjdChlcnIpKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgICAuZmluYWxseSgoKSA9PiB7XG4gIC8vICAgICAgIC8vIGNsZWFudXBcbiAgLy8gICAgICAgZGVsZXRlIGFjdGl2ZURvd25sb2Fkc1t0b0ZpbGVdO1xuICAvLyAgICAgfSk7XG4gIC8vIH0pO1xuICByZXR1cm4gYWN0aXZlRG93bmxvYWRzW3RvRmlsZV07XG59XG5cbi8vVG8gZGVsZXRlIGEgZmlsZS4uXG5cbmZ1bmN0aW9uIGRlbGV0ZUZpbGUoZmlsZVBhdGgpIHtcbiAgLy8gcmV0dXJuIGZzXG4gIC8vICAgLnN0YXQoZmlsZVBhdGgpXG4gIC8vICAgLnRoZW4ocmVzID0+IHJlcyAmJiByZXMudHlwZSA9PT0gXCJmaWxlXCIpXG4gIC8vICAgLnRoZW4oZXhpc3RzID0+IGV4aXN0cyAmJiBmcy51bmxpbmsoZmlsZVBhdGgpKSAvL2lmIGZpbGUgZXhpc3RcbiAgLy8gICAuY2F0Y2goZXJyID0+IHtcbiAgLy8gICAgIC8vIHN3YWxsb3cgZXJyb3IgdG8gYWx3YXlzIHJlc29sdmVcbiAgLy8gICB9KTtcbn1cbiJdfQ==