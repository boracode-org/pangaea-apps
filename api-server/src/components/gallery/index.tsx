import { PropTypes, Component } from "react";
import * as React from "react";
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
import * as ReactDOMServer from "react-dom/server";
import "whatwg-fetch";
import * as DropzoneComponent from "react-dropzone-component";
import * as InlineEdit from "react-edit-inline";

import { ScrollView, Page, Container } from "react-layout-components"; // https://github.com/rofrischmann/react-layout-components/issues/27
import Box from "react-layout-components";
import { Constants } from "../../stores/Constants";

var componentConfig = {
  iconFiletypes: [".mp4"], //'.jpg', '.png', '.gif',
  showFiletypeIcon: true,
  postUrl: "/upload",
  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className="dz-preview dz-file-preview">
      <div className="dz-details">
        <div className="dz-filename">
          <span data-dz-name="true" />
        </div>
        <img data-dz-thumbnail="true" />
      </div>
      <div className="dz-progress">
        <span className="dz-upload" data-dz-uploadprogress="true" />
      </div>
      <div className="dz-success-mark">
        <span>✔</span>
      </div>
      <div className="dz-error-mark">
        <span>✘</span>
      </div>
      <div className="dz-error-message">
        <span data-dz-errormessage="true" />
      </div>
    </div>
  )
};

// idea, add two playlist items  at each tick, placing default item when there is nothing to display the beginning
export class Gallery extends React.Component<any, any> {
  eventHandlers: { complete: (file: any) => void };

  constructor(props) {
    super(props);
    this.state = { galleryItems: [] };

    this.eventHandlers = {
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
    this.updateVideoList = this.updateVideoList.bind(this);
    this.changeName = this.changeName.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
  }

  async updateVideoList() {
    var ext = "";
    if (this.props.types) {
      ext = "?extensions=" + this.props.types;
    }
    fetch(Constants.SERVER_URL + "/gallery" + ext, {
      mode: "no-cors"
    })
      .then(response => {
        return response.json();
      })
      .then(k => {
        console.log("/gallery", k);
        this.setState({ galleryItems: k });
      })
      .catch(e => {
        console.log("error", e);
      });
  }

  componentDidMount() {
    this.updateVideoList();
    // componentDidMount is called by react when the component
    // has been rendered on the page. We can set the interval here:
  }

  componentWillUnmount() {}

  changeName(item, valueMessage) {
    var value = valueMessage["message"];
    console.log("changeName", {
      item,
      valueMessage,
      value,
      galleryItems: this.state.galleryItems
    });
    var vidIndex = this.state.galleryItems.findIndex((k, i, arr) => k.name == item.name);
    console.log("changeName", { item, vidIndex });

    fetch("/changeName" + "?oldName=" + item.name + "&newName=" + value)
      .then(response => {
        return response.json();
      })
      .then(items => {
        console.log("/gallery", items);
        this.setState({ galleryItems: items });
      })
      .catch(e => {});
  }

  deleteVideo(item) {
    // console.log("delete", { k })
    fetch("/deleteVideo" + "?name=" + item.name)
      .then(response => {
        return response.json();
      })
      .then(items => {
        console.log("/gallery", items);
        this.setState({ galleryItems: items });
      })
      .catch(e => {});
  }
  render() {
    return (
      <div style={{ backgroundColor: "white" }}>
        <h3 style={{ color: "blue" }}>Gallery </h3>
        <ScrollView style={{ height: 600 }}>
          <Container borderWidth="10" borderColor="red" borderTop borderRight padding="10">
            <Box wrap row alignItems="flex-start" justifyContent="space-around">
              {this.state.galleryItems.map((k, i) => (
                <Box
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
                  <Box flex="5">
                    <img src={"/upload/?filename=" + k.thumbnail} width="140" height="100" />
                  </Box>
                  <Box
                    flex="1"
                    style={{
                      backgroundColor: "white",
                      fontSize: 10,
                      wordWrap: "break-word"
                    }}
                  >
                    <b>Size: &nbsp; &nbsp; </b>
                    {k.size}
                  </Box>
                  <Box
                    flex="2"
                    style={{
                      backgroundColor: "white",
                      fontSize: 10,
                      wordWrap: "break-word",
                      width: "80%"
                    }}
                  >
                    <InlineEdit
                      activeClassName="editing"
                      text={decodeURI(k.name)}
                      paramName="message"
                      onSelect={() => {}}
                      change={e => {
                        this.changeName(k, e);
                      }}
                      style={{
                        backgroundColor: "yellow",
                        minWidth: 150,
                        display: "inline-block",
                        margin: 0,
                        padding: 0,
                        fontSize: 15,
                        outline: 0,
                        border: 0
                      }}
                    />
                  </Box>
                  <Box
                    flex="1"
                    style={{
                      backgroundColor: "white",
                      fontSize: 10,
                      wordWrap: "break-word",
                      width: "100%"
                    }}
                  >
                    <button style={{ left: 20 }} onClick={() => this.deleteVideo(k)}>
                      Delete
                    </button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </ScrollView>
        <button onClick={this.props.closeModal}>Close</button>
      </div>
    );
  }
}
