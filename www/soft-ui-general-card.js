import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
class SoftUiGeneralCard extends LitElement {
  
  static get properties() {
    return {
      hass: {},
      config: {},
      active: {}
    };
  }
  
  constructor() {
    super();
  }
  
  render() {

    
    var innershadow = this.config.innershadow == "enable" ? true : false;
    var iconemboss = this.config.iconemboss == "enable" ? true : false;
    var background = this.config.background ? this.config.background : "transparent";
   
 

    var min = this.config.min ? this.config.min : "0";
    var max = this.config.max ? this.config.max : "100";
    
    
    return html`
          <div class="${innershadow ? 'card_shadow' : 'card_no_shadow'}" style="background:${background};">
            <div class="${innershadow ? 'inner-main' : 'inner-main_no_shadow'}">
            ${this.config.entities.map(ent => {
                 const stateObj = this.hass.states[ent.entity];
                 
                 const value = 100 * (this.hass.states[ent.entity].state - ent.min) / (ent.max - ent.min);

                return stateObj ? html`
                    <div class="frame_1">
                              <div class="grid-container">
                              ${ent.cardtype == "sensor" ? html`
                                    <div class="${iconemboss? 'icon_noclick icon_shadow' : 'icon_noclick'} @click=${e => this._moreinfo(stateObj)}">
                                        <ha-icon icon="${ent.icon  || stateObj.attributes.icon}" style:"/>
                                      </div>
                                      <div class="left_row text">${ent.name || stateObj.attributes.friendly_name} ${Math.round(stateObj.state)} ${stateObj.attributes.unit_of_measurement}</div>  
                                      <div class="left_row">
                                        <div class="back_bar">
                                          <div class="bar_value" style="width:${value}%;"></div>
                                        </div>
                              ` : html`
                              `}
                              ${ent.cardtype == "button" ? html`
                                    <div class="${iconemboss? 'icon icon_shadow click' : 'icon click'}" style="${stateObj.state =="on" ? 'background-color: var(--active-background-button-color);' : 'background-color: var(--deactive-background-button-color); border: solid 1px var(--button-border-standard);'}" @click=${e => this._switch(stateObj)}>
                                        <ha-icon icon="${ent.icon  || stateObj.attributes.icon}" style="color:${stateObj.state =="on" ? 'var(--state-icon-secondary-color);' : 'var(state-icon-color);'}"/>
                                      </div>
                                      <div class="left_row text ">${ent.name || stateObj.attributes.friendly_name} ${stateObj.state} </div>  
                                      <div class="left_row label">${ent.label}</div> 
                                        </div>
                              ` : html`
                              `}
                              ${ent.cardtype == "sensor-script" ? html`
                                    <div class="${iconemboss? 'icon icon_shadow click' : 'icon click'}" style="${this.hass.states[ent.display_value].state > 0 ? 'background-color: var(--active-background-button-color);' : 'background-color: var(--deactive-background-button-color); border: solid 1px var(--button-border-standard);'}" @click=${e => this._switch(stateObj)}>
                                        <ha-icon icon="${ent.icon  || stateObj.attributes.icon}" style="color:${this.hass.states[ent.display_value].state > 0 ? 'var(--state-icon-secondary-color);' : 'var(state-icon-color);'}"/>
                                      </div>
                                      <div class="left_row text ">${ent.name || stateObj.attributes.friendly_name}</div> 
                                      ${this.hass.states[ent.display_value].state > 0 ? html`
                                      <div class="left_row label">luci accese: ${this.hass.states[ent.display_value].state }</div> 
                                      ` : html`
                                      <div class="left_row label">luci spente</div> 
                                      `}
                                        </div>
                              ` : html`
                              `}
                              ${ent.cardtype == "script" ? html`
                                    <div class="${iconemboss? 'icon icon_shadow click' : 'icon click'}" style="background-color: var(--active-background-button-color);" @click=${e => this._switch(stateObj)}>
                                        <ha-icon icon="${ent.icon  || stateObj.attributes.icon}" style="color: var(--state-icon-secondary-color);"/>
                                      </div>
                                      <div class="left_row text ">${ent.name || stateObj.attributes.friendly_name}</div>  
                                      <div class="left_row label">${ent.label}</div> 
                                        </div>
                              ` : html`
                              `}
                              
                `: html``; 
            })}
            </div>
        </div>
    `;
  }
    
  _switch(state) {
    this.hass.callService("homeassistant", "toggle", {
      entity_id: state.entity_id    
    });
    } 


  
  setConfig(config) {
    if (!config.entities) {
      throw new Error("You need to define entities");

  } 


    this.config = config;
  }

  getCardSize() {
    return this.config.entities.length + 1;
  }
  
  static get styles() {
    return css`

        
        .grid-container {
          display: grid;
          grid-template-columns: 55px auto;
          grid-template-rows: 50% 50%;
          grid-template-areas:
            'menu main'
            'menu footer';
          grid-gap: 1px;
          background-color: transparent;
          padding: 1px;
          
        }
        
        .grid-container > div {
          text-align: left;
          font-size: 14px;
        }

        .main: {
          justify-self: stretch;
          
        }
        .left_row {
          margin-left:15px;
          margin-right:15px;
        }

        
        .click {
          cursor: pointer;
        }

        .icon_shadow {
          box-shadow: -3px -3px 3px 0 rgba(255,255,255,.2),6px 6px 6px 0 rgba(0,0,0,.1);
          border: solid 1px rgba(255,255,255, .2)
          
        }

        ha-icon {

          width:26px;
          height:26px;
          display: block;

          margin-left: auto;
          margin-right: auto;
          
        }

        .icon_noclick {
          position: relative;
          background-color: var(--icon-temperature-background-color);
          border-radius:15px;
          display: block;
          padding-top:17px;
          grid-area: menu;
          margin: 0 auto;
          width:58px;
          height:42px;
          text-align: center;
          text-decoration: none;
          overflow: hidden;
        }

        .textright {
          text-align: right;
        }

        .icon {
          position: relative;

          border-radius:15px;
          display: block;
          padding-top:17px;
          grid-area: menu;
          margin: 0 auto;
          width:58px;
          height:42px;
          text-align: center;
          -webkit-transition-duration: 0.4s; /* Safari */
          transition-duration: 0.4s;
          text-decoration: none;
          overflow: hidden;

        }
        .icon:hover  {
          background-color: var(--active-background-button-color);
        }
        
        .icon:after {
          content: "";
          background: #90EE90;
          display: block;
          position: absolute;
          padding-top: 300%;
          padding-left: 350%;
          margin-left: -20px!important;
          margin-top: -120%;
          opacity: 0;
          transition: all 0.8s
        }

        .icon:active:after {
          padding: 0;
          margin: 0;
          opacity: 1;
          transition: 0s
        }

        icon:hover {
          background-color: yellow;
        }

       .back_bar {
          grid-area: footer;
          background-color: rgba(0,0,20,0.1);
          width:100%;
          border-radius: 3px;
          
          
        }
        
       .bar_value {
          background-image: linear-gradient(to right, #74cbf2, #4f8df6);
          border-radius: 15px;
          height: 6px;
          margin-top:10px;
        }

        .text {
          grid-area: main;
          color: var(--primary-text-color);
          display: block;
          padding-top:10px;
          font-size: 12px;
          font-weight: bold;
          font-family: Helvetica;
          letter-spacing: '-0.01em';
          
        }

        .label {
          grid-area: footer;
          color: var(--primary-text-color);
          display: block;
          font-size: 8px;
          font-family: Helvetica;
          letter-spacing: '-0.01em';
        }

        .card_shadow {
          height:100%;
          border-radius:20px;
          display:flex;
          flex-direction: row;
          justify-self: stretch;
          box-shadow: inset -6px -6px 6px 0 rgba(255,255,255,.5), inset 6px 6px 6px 0 rgba(0,0,0,.1); 
        }

        .card_no_shadow {
          height:100%;
          border-radius:20px;
          display:flex;
          flex-direction: row;
          justify-self: stretch;
          
        }

        .inner-main {
            width:100%;
            display:flex;
            flex-direction:column;
            justify-self: stretch;

            margin-left:15px;
            margin-top:10px;
            margin-right:15px;
            margin-bottom:10px;
        }

        .inner-main_no_shadow {
          width:100%;
          display:flex;
          flex-direction:column;
          justify-self: stretch;

          }

        .frame_1 {
          
          display:inline-block;
          justify-self: stretch;
          border-radius:20px;
          height: 70px;
        } 


    `;
  }  
  
}

customElements.define('soft-ui-general-card', SoftUiGeneralCard);
