"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const expo_1 = require("expo");
exports.Asset = expo_1.Asset;
// __DEV__ = true;
//Help:
//Expo's Asset implementation
//  https://github.com/expo/expo-sdk/blob/master/src/Asset.js#L118-L144
//FileSystem NativeModules' implementation
//Android
//  https://github.com/expo/expo/blob/master/android/app/src/main/java/abi18_0_0/host/exp/exponent/modules/api/FileSystemModule.java
//iOS
//  https://github.com/expo/expo/blob/9a9dfb4103cb0cd5bfff8a97710350321655059f/ios/versioned-react-native/ABI18_0_0/Exponent/Modules/Api/ABI18_0_0EXFileSystem.m
//
//FileSystem support thread: https://github.com/expo/expo/issues/108
//
//inspired from https://github.com/expo/expo-docs/issues/63#issuecomment-305944573
//
/**
 * Download a remote asset to app cache or app data
 *
 * @param  {Boolean} cache
 *                    true: downloads asset to app cache
 *                    false: downloads asset to app data
 * @return {Promise}
 */
expo_1.Asset.prototype.downloadAsyncWithoutHash = function ({ cache }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log("downloadAsyncWithoutHash", { cache });
        const path = `file://${react_native_1.NativeModules.ExponentFileSystem.documentDirectory}/${this.name}.${this.type}`;
        if (this.downloaded) {
            // __DEV__ ? console.log("asset already downloaded") : "";
            return;
        }
        else if (this.downloading) {
            // __DEV__ ? console.log("asset downloading"):"";
            yield new Promise((resolve, reject) => this.downloadCallbacks.push({ resolve, reject }));
            return;
        }
        else {
            // __DEV__ ? console.log("starting asset download"):"";
        }
        this.downloading = true;
        try {
            let exists, uri;
            ({ exists, uri } = yield react_native_1.NativeModules.ExponentFileSystem.getInfoAsync(path, {
                //cache
                //  true: checks if file exists in app cache
                //  false: checks if file exists in app data
                cache //shorthand for cache: cache
            }));
            if (__DEV__) {
                console.log(`${path} ${exists ? "already downloaded" : "not downloaded"}`);
                console.log("________________________");
                if (exists) {
                    console.log(`filepath: ${uri.replace("file://", "").replace(/%25/g, "%")}`);
                }
            }
            if (!exists) {
                // __DEV__ ? console.log("downloading it") : "";
                ({ uri } = yield react_native_1.NativeModules.ExponentFileSystem.downloadAsync(this.uri, path, {
                    //cache
                    //  true: stores file in app cache
                    //  false: stores file in app data
                    cache //shorthand for cache: cache
                }));
            }
            this.localUri = uri;
            this.downloaded = true;
            this.downloadCallbacks.forEach(({ resolve }) => resolve());
        }
        catch (e) {
            console.log("downloadAsyncWithoutHash", { e });
            this.downloadCallbacks.forEach(({ reject }) => reject(e));
            throw e;
        }
        finally {
            this.downloading = false;
            this.downloadCallbacks = [];
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5oYW5jZWRBc3NldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVuaGFuY2VkQXNzZXQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUE2QztBQUM3QywrQkFBNkI7QUFnRnBCLGdCQWhGQSxZQUFLLENBZ0ZBO0FBOUVkLGtCQUFrQjtBQUNsQixPQUFPO0FBQ1AsNkJBQTZCO0FBQzdCLHVFQUF1RTtBQUN2RSwwQ0FBMEM7QUFDMUMsU0FBUztBQUNULG9JQUFvSTtBQUNwSSxLQUFLO0FBQ0wsZ0tBQWdLO0FBQ2hLLEVBQUU7QUFDRixvRUFBb0U7QUFDcEUsRUFBRTtBQUNGLGtGQUFrRjtBQUNsRixFQUFFO0FBRUY7Ozs7Ozs7R0FPRztBQUNILFlBQUssQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEdBQUcsVUFBZSxFQUFFLEtBQUssRUFBRTs7UUFDakUsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbkQsTUFBTSxJQUFJLEdBQUcsVUFBVSw0QkFBYSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXRHLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQiwwREFBMEQ7WUFDMUQsT0FBTztTQUNSO2FBQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzNCLGlEQUFpRDtZQUNqRCxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekYsT0FBTztTQUNSO2FBQU07WUFDTCx1REFBdUQ7U0FDeEQ7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUV4QixJQUFJO1lBQ0YsSUFBSSxNQUFNLEVBQUUsR0FBRyxDQUFDO1lBQ2hCLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsTUFBTSw0QkFBYSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUU7Z0JBQzNFLE9BQU87Z0JBQ1AsNENBQTRDO2dCQUM1Qyw0Q0FBNEM7Z0JBQzVDLEtBQUssQ0FBQyw0QkFBNEI7YUFDbkMsQ0FBQyxDQUFDLENBQUM7WUFFSixJQUFJLE9BQU8sRUFBRTtnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztnQkFDM0UsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLE1BQU0sRUFBRTtvQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQzdFO2FBQ0Y7WUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLGdEQUFnRDtnQkFDaEQsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sNEJBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7b0JBQzlFLE9BQU87b0JBQ1Asa0NBQWtDO29CQUNsQyxrQ0FBa0M7b0JBQ2xDLEtBQUssQ0FBQyw0QkFBNEI7aUJBQ25DLENBQUMsQ0FBQyxDQUFDO2FBQ0w7WUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUM1RDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUE7WUFDM0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxDQUFDO1NBQ1Q7Z0JBQVM7WUFDUixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztDQUFBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVNb2R1bGVzIH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tIFwiZXhwb1wiO1xuXG4vLyBfX0RFVl9fID0gdHJ1ZTtcbi8vSGVscDpcbi8vRXhwbydzIEFzc2V0IGltcGxlbWVudGF0aW9uXG4vLyAgaHR0cHM6Ly9naXRodWIuY29tL2V4cG8vZXhwby1zZGsvYmxvYi9tYXN0ZXIvc3JjL0Fzc2V0LmpzI0wxMTgtTDE0NFxuLy9GaWxlU3lzdGVtIE5hdGl2ZU1vZHVsZXMnIGltcGxlbWVudGF0aW9uXG4vL0FuZHJvaWRcbi8vICBodHRwczovL2dpdGh1Yi5jb20vZXhwby9leHBvL2Jsb2IvbWFzdGVyL2FuZHJvaWQvYXBwL3NyYy9tYWluL2phdmEvYWJpMThfMF8wL2hvc3QvZXhwL2V4cG9uZW50L21vZHVsZXMvYXBpL0ZpbGVTeXN0ZW1Nb2R1bGUuamF2YVxuLy9pT1Ncbi8vICBodHRwczovL2dpdGh1Yi5jb20vZXhwby9leHBvL2Jsb2IvOWE5ZGZiNDEwM2NiMGNkNWJmZmY4YTk3NzEwMzUwMzIxNjU1MDU5Zi9pb3MvdmVyc2lvbmVkLXJlYWN0LW5hdGl2ZS9BQkkxOF8wXzAvRXhwb25lbnQvTW9kdWxlcy9BcGkvQUJJMThfMF8wRVhGaWxlU3lzdGVtLm1cbi8vXG4vL0ZpbGVTeXN0ZW0gc3VwcG9ydCB0aHJlYWQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9leHBvL2V4cG8vaXNzdWVzLzEwOFxuLy9cbi8vaW5zcGlyZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXhwby9leHBvLWRvY3MvaXNzdWVzLzYzI2lzc3VlY29tbWVudC0zMDU5NDQ1NzNcbi8vXG5cbi8qKlxuICogRG93bmxvYWQgYSByZW1vdGUgYXNzZXQgdG8gYXBwIGNhY2hlIG9yIGFwcCBkYXRhXG4gKlxuICogQHBhcmFtICB7Qm9vbGVhbn0gY2FjaGVcbiAqICAgICAgICAgICAgICAgICAgICB0cnVlOiBkb3dubG9hZHMgYXNzZXQgdG8gYXBwIGNhY2hlXG4gKiAgICAgICAgICAgICAgICAgICAgZmFsc2U6IGRvd25sb2FkcyBhc3NldCB0byBhcHAgZGF0YVxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuQXNzZXQucHJvdG90eXBlLmRvd25sb2FkQXN5bmNXaXRob3V0SGFzaCA9IGFzeW5jIGZ1bmN0aW9uKHsgY2FjaGUgfSkge1xuICBjb25zb2xlLmxvZyhcImRvd25sb2FkQXN5bmNXaXRob3V0SGFzaFwiLCB7IGNhY2hlIH0pO1xuICBjb25zdCBwYXRoID0gYGZpbGU6Ly8ke05hdGl2ZU1vZHVsZXMuRXhwb25lbnRGaWxlU3lzdGVtLmRvY3VtZW50RGlyZWN0b3J5fS8ke3RoaXMubmFtZX0uJHt0aGlzLnR5cGV9YDtcblxuICBpZiAodGhpcy5kb3dubG9hZGVkKSB7XG4gICAgLy8gX19ERVZfXyA/IGNvbnNvbGUubG9nKFwiYXNzZXQgYWxyZWFkeSBkb3dubG9hZGVkXCIpIDogXCJcIjtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAodGhpcy5kb3dubG9hZGluZykge1xuICAgIC8vIF9fREVWX18gPyBjb25zb2xlLmxvZyhcImFzc2V0IGRvd25sb2FkaW5nXCIpOlwiXCI7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gdGhpcy5kb3dubG9hZENhbGxiYWNrcy5wdXNoKHsgcmVzb2x2ZSwgcmVqZWN0IH0pKTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSB7XG4gICAgLy8gX19ERVZfXyA/IGNvbnNvbGUubG9nKFwic3RhcnRpbmcgYXNzZXQgZG93bmxvYWRcIik6XCJcIjtcbiAgfVxuICB0aGlzLmRvd25sb2FkaW5nID0gdHJ1ZTtcblxuICB0cnkge1xuICAgIGxldCBleGlzdHMsIHVyaTtcbiAgICAoeyBleGlzdHMsIHVyaSB9ID0gYXdhaXQgTmF0aXZlTW9kdWxlcy5FeHBvbmVudEZpbGVTeXN0ZW0uZ2V0SW5mb0FzeW5jKHBhdGgsIHtcbiAgICAgIC8vY2FjaGVcbiAgICAgIC8vICB0cnVlOiBjaGVja3MgaWYgZmlsZSBleGlzdHMgaW4gYXBwIGNhY2hlXG4gICAgICAvLyAgZmFsc2U6IGNoZWNrcyBpZiBmaWxlIGV4aXN0cyBpbiBhcHAgZGF0YVxuICAgICAgY2FjaGUgLy9zaG9ydGhhbmQgZm9yIGNhY2hlOiBjYWNoZVxuICAgIH0pKTtcblxuICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICBjb25zb2xlLmxvZyhgJHtwYXRofSAke2V4aXN0cyA/IFwiYWxyZWFkeSBkb3dubG9hZGVkXCIgOiBcIm5vdCBkb3dubG9hZGVkXCJ9YCk7XG4gICAgICBjb25zb2xlLmxvZyhcIl9fX19fX19fX19fX19fX19fX19fX19fX1wiKTtcbiAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgY29uc29sZS5sb2coYGZpbGVwYXRoOiAke3VyaS5yZXBsYWNlKFwiZmlsZTovL1wiLCBcIlwiKS5yZXBsYWNlKC8lMjUvZywgXCIlXCIpfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAvLyBfX0RFVl9fID8gY29uc29sZS5sb2coXCJkb3dubG9hZGluZyBpdFwiKSA6IFwiXCI7XG4gICAgICAoeyB1cmkgfSA9IGF3YWl0IE5hdGl2ZU1vZHVsZXMuRXhwb25lbnRGaWxlU3lzdGVtLmRvd25sb2FkQXN5bmModGhpcy51cmksIHBhdGgsIHtcbiAgICAgICAgLy9jYWNoZVxuICAgICAgICAvLyAgdHJ1ZTogc3RvcmVzIGZpbGUgaW4gYXBwIGNhY2hlXG4gICAgICAgIC8vICBmYWxzZTogc3RvcmVzIGZpbGUgaW4gYXBwIGRhdGFcbiAgICAgICAgY2FjaGUgLy9zaG9ydGhhbmQgZm9yIGNhY2hlOiBjYWNoZVxuICAgICAgfSkpO1xuICAgIH1cbiAgICB0aGlzLmxvY2FsVXJpID0gdXJpO1xuICAgIHRoaXMuZG93bmxvYWRlZCA9IHRydWU7XG4gICAgdGhpcy5kb3dubG9hZENhbGxiYWNrcy5mb3JFYWNoKCh7IHJlc29sdmUgfSkgPT4gcmVzb2x2ZSgpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiZG93bmxvYWRBc3luY1dpdGhvdXRIYXNoXCIse2V9KVxuICAgIHRoaXMuZG93bmxvYWRDYWxsYmFja3MuZm9yRWFjaCgoeyByZWplY3QgfSkgPT4gcmVqZWN0KGUpKTtcbiAgICB0aHJvdyBlO1xuICB9IGZpbmFsbHkge1xuICAgIHRoaXMuZG93bmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmRvd25sb2FkQ2FsbGJhY2tzID0gW107XG4gIH1cbn07XG5cbmV4cG9ydCB7IEFzc2V0IH07XG4iXX0=