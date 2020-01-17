import * as React from "react";
import { Component } from "react";

import * as moment from "moment";
import {
  default as Video,
  Controls,
  Play,
  Mute,
  Seek,
  Fullscreen,
  Time,
  Overlay
} from "react-html5video";
import InlineEdit from "../libs/react-edit-inline";
// import Box, { ScrollView, Page, Container } from "react-layout-components"; // https://github.com/rofrischmann/react-layout-components/issues/27
import DropzoneComponent from "react-dropzone-component";
import Constants from "../Constants";
var ReactDOMServer = require("react-dom/server");
import * as _ from "lodash";

import { View, Text, Button, ScrollView } from "react-native-web";
import { Database } from "../Database";

var componentConfig = {
  iconFiletypes: [".mp4"], //'.jpg', '.png', '.gif',
  showFiletypeIcon: true,
  postUrl: Constants.SERVER_URL + "/upload"
  // previewTemplate: ReactDOMServer.renderToStaticMarkup(<div/>)
  //   <div className="dz-preview dz-file-preview">
  //     <div className="dz-details">
  //       <div className="dz-filename">
  //         <span data-dz-name="true" />
  //       </div>
  //       <img data-dz-thumbnail="true" />
  //     </div>
  //     <div className="dz-progress">
  //       <span className="dz-upload" data-dz-uploadprogress="true" />
  //     </div>
  //     <div className="dz-success-mark">
  //       <span>✔</span>
  //     </div>
  //     <div className="dz-error-mark">
  //       <span>✘</span>
  //     </div>
  //     <div className="dz-error-message">
  //       <span data-dz-errormessage="true" />
  //     </div>
  //   </div>
  // )
};

// idea, add two playlist items  at each tick, placing default item when there is nothing to display the beginning

class Gallery extends React.Component<any, any> {
  eventHandlers: {
    addedfile: (file: any) => void;
    complete: (file: any) => void;
  };
  state = {
    galleryItems: [],
    playlist: {},
    loading: false
  };

  constructor(props) {
    super(props);

    this.eventHandlers = {
      addedfile: async file => {
        //console.log(file);
        try {
          await Database.addMedia(file);
          var newPlaylist = this.state.playlist;
          var videourl = "/upload?filename=" + file.name;
          newPlaylist = [videourl];
          // this.setState({ playlist: newPlaylist });
          // this.setState({ start: new Date(), videourl: videourl, playlist: newPlaylist, currentVideo: videourl });
          // this.refs.video.load();
          // this.refs.video.play();
          // this.setState({})

          this.updateVideoList();
        } catch (e) {
          alert("Attempted to upload invalid file");
        }
      },
      complete: file => {
        var uploadfilename = file.name; // JSON.parse(file.xhr.response).name;
        console.log("DropzoneComponent complete", uploadfilename);
        var newPlaylist = this.state.playlist;
        var videourl = "/upload?filename=" + uploadfilename;
        newPlaylist = [videourl];
        // this.setState({ playlist: newPlaylist });
        // this.setState({ start: new Date(), videourl: videourl, playlist: newPlaylist, currentVideo: videourl });
        // this.refs.video.load();
        // this.refs.video.play();
        // this.setState({})
        this.updateVideoList();
      }
    };
    this.changeName = this.changeName.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
  }

  updateVideoList = async () => {
    this.setState({ loading: true });
    setTimeout(async () => {
      var ext = "";
      if (this.props.types) {
        ext = "?extensions=" + this.props.types;
      }
      // var galleryItems = await fetch(Constants.SERVER_URL + "/gallery" + ext).then(response => {
      //   console.log({ response });
      //   return response.json();
      // });
      var galleryItems = await Database.getGalleryItems();
      console.log({ galleryItems });

      console.log("/gallery", galleryItems);
      this.setState({ galleryItems, loading: false });
    }, 300);
  };

  componentDidMount() {
    this.updateVideoList();
    // componentDidMount is called by react when the component
    // has been rendered on the page. We can set the interval here:
  }

  componentWillUnmount() {}

  changeName = async (item, valueMessage) => {
    var value = valueMessage["message"];
    console.log("changeName", {
      item,
      valueMessage,
      value,
      galleryItems: this.state.galleryItems
    });
    var vidIndex = this.state.galleryItems.findIndex(
      (k, i, arr) => k.name == item.name
    );
    console.log("changeName", { item, vidIndex });

    await Database.changeMediaTitle(item, value);

    this.updateVideoList();

    // fetch(Constants.SERVER_URL + "/changeName" + "?oldName=" + item.name + "&newName=" + value)
    //   .then(response => {
    //     return response.json();
    //   })
    //   .then(items => {
    //     console.log("/gallery", items);
    //     this.setState({ galleryItems: items });
    //   })
    //   .catch(e => {});
  };

  async deleteVideo(item) {
    console.log("delete", { item });
    try {
      await Database.deleteMedia(item.objectId);
      alert("Successfully deleted Media: " + item.title);
      this.updateVideoList();
    } catch (e) {
      alert("Failed to delete media: " + e.message);
    }

    // fetch(Constants.SERVER_URL + "/deleteVideo" + "?name=" + item.name)
    //   .then(response => {
    //     return response.json();
    //   })
    //   .then(items => {
    //     console.log("/gallery", items);
    //     this.setState({ galleryItems: items });
    //   })
    //   .catch(e => {});
  }
  render() {
    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          width: "100%",
          padding: 5,
          borderRadius: 5
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            flex: 1,
            backgroundColor: "lightgray",
            justifyContent: "space-between",
            marginBottom: 10,
            padding: 5
          }}
        >
          <Text
            style={{
              color: "black",
              height: 40,
              fontWeight: "bold",
              fontSize: 20,
              textAlign: "center",
              verticalAlign: "center",
              paddingTop: 10
            }}
          >
            {`Gallery`.toUpperCase()}
          </Text>
          <View style={{ margin: 5 }}>
            <Button title="Close" onPress={this.props.closeModal} />
          </View>
        </View>

        <ScrollView style={{ height: 500, backgroundColor: "#FAFAFA" }}>
          <View />

          <View
            borderWidth="10"
            borderColor="red"
            borderTop
            borderRight
            padding="10"
          >
            <View
              style={{
                flex: 1,
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "flex-start"
              }}
            >
              {this.state.loading ? (
                <Text
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    verticalAlign: "center",
                    textAlign: "center",
                    alignContent: "center"
                  }}
                >
                  Loading Gallery ... please wait...
                </Text>
              ) : null}
              {this.state.galleryItems.length > 0 ? (
                this.state.galleryItems.map((k, i) => (
                  <View
                    key={i}
                    column
                    style={{
                      width: 150,
                      backgroundColor: "lightgrey",
                      marginBottom: 10,
                      marginRight: 10,
                      padding: 5
                    }}
                    onClick={() => {
                      if (this.props.onSelect) {
                        this.props.onSelect(this.state.galleryItems[i]);
                      }
                    }}
                  >
                    <View flex="5">
                      <img
                        src={
                          k.video_thumbnail
                            ? k.video_thumbnail.url
                            : "" /*Constants.SERVER_URL + "/upload/?filename=" + k.thumbnail*/
                        }
                        width="140"
                        height="100"
                      />
                    </View>
                    <View
                      flex="1"
                      style={{
                        backgroundColor: "white",
                        fontSize: 10,
                        wordWrap: "break-word"
                      }}
                    >
                      <b>Type - Size: &nbsp; &nbsp; </b>
                      <Text>
                        {k.type} - {k.video_size}
                      </Text>
                    </View>
                    <View
                      flex="2"
                      style={{
                        backgroundColor: "white",
                        fontSize: 10,
                        wordWrap: "break-word",
                        width: "100%"
                      }}
                    >
                      <b>Filename: &nbsp; &nbsp; </b>
                      <InlineEdit
                        activeClassName="editing"
                        text={k.title}
                        paramName="message"
                        onSelect={() => {}}
                        change={e => {
                          this.changeName(k, e);
                        }}
                        style={{
                          backgroundColor: "gray",
                          color: "white",
                          // minWidth: 150,
                          display: "inline-block",
                          margin: 0,
                          padding: 10,
                          fontSize: 15,
                          outline: 0,
                          border: 0
                        }}
                      />
                    </View>
                    <View
                      flex="1"
                      style={{
                        backgroundColor: "white",
                        fontSize: 10,
                        wordWrap: "break-word",
                        width: "100%"
                      }}
                    >
                      <Button
                        title="Delete"
                        color="red"
                        style={{ left: 20 }}
                        onPress={() => this.deleteVideo(k)}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text>
                  Sorry there are no items in your gallery, add some below
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            margin: 5,
            height: 200,
            border: "1px solid gray",
            padding: 5,
            backgroundColor: "lightgray"
          }}
        >
          <DropzoneComponent
            djsConfig={{
              autoProcessQueue: false,
              previewTemplate: ReactDOMServer.renderToStaticMarkup(<div />)
            }}
            config={componentConfig}
            eventHandlers={this.eventHandlers}
          />
        </View>
        <Button
          title="Close"
          onPress={this.props.closeModal}
          style={{ margin: 5 }}
        />
      </View>
    );
  }
}

export default Gallery;
