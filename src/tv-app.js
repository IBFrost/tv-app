// import stuff
import { LitElement, html, css } from "lit";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@lrnwebcomponents/video-player/video-player.js";
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = "";
    this.source = new URL("../assets/channels.json", import.meta.url).href;
    this.listings = [];
    this.activeItem = {
      id: null,
      title: null,
      presenter: null,
      description: null,
      video: null,
    };
    this.nextItem = {
      id: null,
      title: null,
      presenter: null,
      description: null,
      video: null,
    };
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return "tv-app";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object },
      nextItem: { type: Object },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        header {
          color: #000;
          padding: 16px;
          text-align: center;
        }

        .h1 {
          font-size: 32px;
          margin-bottom: 16px;
        }

        .channel-container {
          margin-left: 16px;
          margin-right: 16px;
          max-width: 100%;
          display: flex;
          flex-direction: row;
          flex-grow: 1;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: auto;
        }

        .main-content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          margin: 12px;
        }

        .player-container {
          border-radius: 8px;
          padding: 12px;
          flex-grow: 10;
          flex-basis: calc(66% - 32px); /* 66% minus padding on both sides */
          flex-shrink: 3;
          min-width: 445px;
          min-height: 250px;
        }

        .player {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 8px;
        }

        .discord {
          display: flex;
          padding: 12px;
          flex-grow: 10; /* Adjust the flex-grow value */
          min-width: 0; /* Allow the box to shrink beyond its content */
          flex-shrink: 2;
          min-height: 300px;
        }

        .discord widgetbot {
          overflow: hidden;
          background-color: rgb(54, 57, 62);
          border-radius: 8px;
          width: 100%;
          height: 100%;
          vertical-align: top;
        }

        .discord iframe {
          border-radius: 8px;
          border: none;
          width: inherit;
          height: 100%;
        }
        .video-descritpion {
          flex-grow: 10;
        }
      `,
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <header>
        <h1>${this.name}</h1>
      </header>

      <div class="channel-container">
        ${this.listings.map(
          (item) => html`
            <tv-channel
              id="${item.id}"
              title="${item.title}"
              presenter="${item.metadata.author}"
              description="${item.description}"
              video="${item.metadata.source}"
              @click="${this.itemClick}"
            >
            </tv-channel>
          `
        )}
      </div>
      <div class="main-content">
        <div class="player-container">
          <!-- video -->

          <video-player
            class="player"
            source="${this.createSource()}"
            accent-color="orange"
            dark
            track="https://haxtheweb.org/files/HAXshort.vtt"
          >
          </video-player>
          <div class="video-description">
            <tv-channel
              title="${this.activeItem.title}"
              presenter="${this.activeItem.presenter}"
              ><p>${this.activeItem.description}</p></tv-channel
            >
          </div>
        </div>

        <!-- discord / chat - optional -->
        <div class="discord">
          <widgetbot
            server="954008116800938044"
            channel="1106691466274803723"
            width="100%"
            height="100%"
            ><iframe
              title="WidgetBot Discord chat embed"
              allow="clipboard-write; fullscreen"
              src="https://e.widgetbot.io/channels/954008116800938044/1106691466274803723?api=a45a80a7-e7cf-4a79-8414-49ca31324752"
            ></iframe
          ></widgetbot>
          <script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed"></script>
        </div>
      </div>
      <!-- dialog -->
      <sl-dialog label=" ${this.nextItem.title}" class="dialog">
        <p class="dialog-description">
          ${this.nextItem.presenter} | ${this.nextItem.description}
        </p>
        <sl-button slot="footer" variant="primary" @click="${this.watchVideo}"
          >Watch</sl-button
        >
      </sl-dialog>
    `;
  }

  changeVideo() {
    // Update the iframe source URL when an item is clicked
    const iframe = this.shadowRoot.querySelector('video-player').querySelector("iframe");
    iframe.src = this.createSource();
    
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play()
  }

  extractVideoID(link) {
    try {
      const url = new URL(link);
      const searchParams = new URLSearchParams(url.search);
      return searchParams.get("v");
    } catch (error) {
      console.error("Invalid URL:", link);
      return null;
    }
  }

  createSource() {
    return (
      "https://www.youtube.com/embed/" +
      this.extractVideoID(this.activeItem.video)
    );
  }

  closeDialog() {
    const dialog = this.shadowRoot.querySelector(".dialog");
    dialog.hide();
  }

  watchVideo() {
    this.activeItem = {
      id: this.nextItem.id,
      title: this.nextItem.title,
      presenter: this.nextItem.presenter,
      description: this.nextItem.description,
      video: this.nextItem.video,
    };
    this.closeDialog();
    this.changeVideo();
    
  }

  itemClick(e) {
    this.nextItem = {
      id: e.target.id,
      title: e.target.title,
      presenter: e.target.presenter,
      description: e.target.description,
      video: e.target.video,
    };
    const dialog = this.shadowRoot.querySelector(".dialog");
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source)
      .then((resp) => (resp.ok ? resp.json() : []))
      .then((responseData) => {
        if (
          responseData.status === 200 &&
          responseData.data.items &&
          responseData.data.items.length > 0
        ) {
          this.listings = [...responseData.data.items];
        }
      });
  }
}

// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);