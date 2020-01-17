import { px } from "csx";
import { inject, observer } from "mobx-react";
import * as React from 'react';
import { Helmet } from "react-helmet";
import { IStores } from "stores";
import { style } from "typestyle";
import * as Modal from 'react-modal';
import { Gallery } from "components/Gallery";

const currencyClass = style({
  padding: px(10)
});

const moneyClass = style({
  color: "green"
});

interface ICurrencyProps {
  scheduler?: IStores["scheduler"];
}

@inject((stores: IStores) => ({
  scheduler: stores.scheduler
}))
@observer
export default class Scheduler extends React.Component<ICurrencyProps, {}> {
  state = {
    playerOpen: false,
    galleryOpen: false,
    settingsOpen:false
  }

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openGalleryModal = this.openGalleryModal.bind(this);
    this.openSettingsModal = this.openSettingsModal.bind(this);

   
  }

  closeModal() {
    this.setState({ playerOpen: false, galleryOpen: false, settingsOpen: false });
  }

  openModal() {
    this.setState({ playerOpen: true });
  }

  openGalleryModal() {
    this.setState({ galleryOpen: true });
  }

  openSettingsModal() {
    this.setState({ settingsOpen: true });
  }
  public render() {
    const { scheduler } = this.props;
    // tslint:disable-next-line:no-string-literal
    const rate = scheduler && scheduler.rates ? scheduler.rates.rates["JPY"] : "Not Found";
    return (
      <div className={currencyClass}>
        <Helmet>
          <title>Scheduler</title>
        </Helmet>
        Scheduler<br />
        USD -> JPY rate: $1 = <strong className={moneyClass}>¥{rate}</strong>
        <div>
          <Modal style={modalStyle} isOpen={this.state.playerOpen} onRequestClose={this.closeModal}>
            {/*<Player parent={this} closeModal={this.closeModal}></Player>*/}
          </Modal>
          <Modal
            style={modalStyle}
            isOpen={this.state.galleryOpen}
            onRequestClose={this.closeModal}
          >
            {<Gallery parent={this} closeModal={this.closeModal} />}
          </Modal>
          <Modal
            style={modalStyle}
            isOpen={this.state.settingsOpen}
            onRequestClose={this.closeModal}
          >
            {/*<Settings parent={this} closeModal={this.closeModal}></Settings>*/}
          </Modal>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                Scheduler
                <b>
                  <button onClick={this.openModal}>Open Player</button>
                </b>
                <b>
                  <button onClick={this.openGalleryModal}>Gallery</button>
                </b>
                <b>
                  <button onClick={this.openSettingsModal}>Settings</button>
                </b>
                {/*<TimeScale>Yo </TimeScale>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

var modalStyle = {
  overlay: {
    zIndex: 0,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 15, 15, 0.75)"
  },
  content: {
    zIndex: -5,
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    bottom: "10px",
    border: "1px solid #ccc",
    backgroundColor: "rgba(15, 15, 15, 0.95)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px"
  }
};
