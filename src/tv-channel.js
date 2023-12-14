// import stuff
import { LitElement, html, css } from "lit";

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = "";
    this.presenter = "";
    this.description = "";
    this.video = "";
    this.timecode = "";
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return "tv-channel";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      presenter: { type: String },
      video: { type: String },
      timecode: { type: String },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: inline-flex;
        flex-grow: 10;
        
      }

      .wrapper {
        line-height: 1em;
        width: 300px;
        margin-right: 4px;
        padding-left: 16px;
        padding-right: 16px;
        border: 1px solid #2c2c2c;
        border-radius: 8px;
        text-overflow: ellipsis;
        flex-direction: row;
      }

      .wrapper h5 {
        margin-top: 0;
        font-size: 1em;
        margin-bottom: 0.8888em;
        color: #363636;
        margin-bottom: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      p {
        font-size: 1em;
        padding: 0;
        margin-top: .2em;
        margin-bottom: .5em;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time{
        font-size: 1em;
        max-width: 75px;
        border-radius: 4px;
        color: #ffffff;
        text-align: center;
        background-color: #363636;
        margin: 12px;
        margin-left: 0;
        padding: 4px;
        overflow-y: hidden;
        overflow-x: hidden;
        
      }
      .details{
        line-height: 1em;
        overflow-y: hidden;
        overflow-x: hidden;
      }

      ::slotted(p) {
        line-height: 1em;
      }
    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
        <div class="time">
          <strong>${this.timecode} min</strong>
        </div>
        <div class="details">
          <h5>${this.title}</h5>
          <p>${this.description}</p>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
