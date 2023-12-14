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
      id: "item-000-000-102",
      title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      presenter: "Rick Astley",
      description:
        "The official video for “Never Gonna Give You Up” by Rick Astley.",
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      timecode: 4,
    };
    this.nextItem = {
      id: null,
      title: null,
      presenter: null,
      description: null,
      video: null,
      timecode: null,
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
          padding-left: 8px;
          margin: 0 auto;
          max-width: 1344px;
          display: flex;
          color: #000;
          text-align: left;
          margin: 0 auto;
          width: 100%;
          position: relative;
          line-height: 24px;
          font-size: 16;
          font-family: Press_Start_2P
        }

        .h1 {
          font-size: 16px;
        }

        h2{
          line-height: 1em;
        }

        .channel-container {
          margin: 0 auto;
          max-width: 1344px;
          display: flex;
          justify-items: left;
          flex-direction: row;
          flex-grow: 1;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: auto;
          padding-left: 4px;
          padding-right: 4px;
          text-rendering: optimizeLegibility;
          width: 100%;
          margin: 0 auto;
          position: relative;
          animation-delay: 1s;
          animation-duration: 1s;
          line-height: 1;
          font-size: 1em;
        }

        .main-content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          margin: 16px;
          margin-left: 32px;
          margin-right: 32px;
        }

        .player-container {
          flex-grow: 10;
          flex-basis: calc(50% - 32px); /* 66% minus padding on both sides */
          flex-shrink: 3;
          min-width: 445px;
          min-height: 250px;
          padding: 12px;
          border-collapse: separate; 
          border-radius: 8px;
        }

        .player {
          border-radius: 8px;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 8px;
          max-height: 75%;
        }

        .discord {
          display: flex;
          padding: 12px;
          flex-grow: 10; /* Adjust the flex-grow value */
          min-width: 0; /* Allow the box to shrink beyond its content */
          flex-shrink: 3;
          min-height: 350px;
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
        .video-description {
          max-width: 80%;
          padding-left: 32px;
          display: inline-flex;
        }
        .video-description .wrapper{
          width: 80%;
        }
        img{
          width: 10%;
          border-radius: 12px;
          padding: 4px;
        }

      `,
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <header>
      <img src="https://ps.w.org/haxtheweb/assets/banner-772x250.png?rev=2316092" alt="HAX the Web Logo"><h1>${this.name}</h1>
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
              timecode="${item.metadata.timecode}"
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
      <tv-channel
        class="video-description"
        timecode=${this.activeItem.timecode}
      >
        <h2>${this.activeItem.title}</h2>
        <h3>${this.activeItem.presenter}</h3>
        <p>${this.activeItem.description}</p>
      </tv-channel>
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
    const iframe = this.shadowRoot
      .querySelector("video-player")
      .querySelector("iframe");
    iframe.src = this.createSource();

    this.shadowRoot
      .querySelector("video-player")
      .shadowRoot.querySelector("a11y-media-player")
      .play();
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

  watchVideo(e) {
    const dialog = this.shadowRoot.querySelector(".dialog");
    dialog.hide();
    this.activeItem = this.nextItem;
    this.shadowRoot
      .querySelector("video-player")
      .shadowRoot.querySelector("a11y-media-player")
      .play();
  }

  itemClick(e) {
    this.nextItem = {
      id: e.target.id,
      title: e.target.title,
      presenter: e.target.presenter,
      description: e.target.description,
      video: e.target.video,
      timecode: e.target.timecode,
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
