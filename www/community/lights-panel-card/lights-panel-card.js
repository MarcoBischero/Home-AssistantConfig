import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
class LightsPanelCard extends LitElement {
  
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
    var brightnessWidth = this.config.brightnessWidth ? this.config.brightnessWidth : "100px";
    var brightnessHeight = this.config.brightnessHeight ? this.config.brightnessHeight : "300px";
    var switchWidth = this.config.switchWidth ? this.config.switchWidth : "100px";
    var switchHeight = this.config.switchHeight ? this.config.switchHeight : "300px";
    var innershadow = this.config.innershadow == "enable" ? true : false;
    var iconemboss = this.config.iconemboss == "enable" ? true : false;
    
    var countText = this.config.countText ? this.config.countText : "luci accese";
    var entityCounter = 0;

    var background = this.config.background ? this.config.background : "transparent";
    var sidebackground = this.config.sidebackground ? this.config.sidebackground : "#f6f5fa";
    var lightcolor = this.config.lightcolor ? this.config.lightcolor : "#f2f0fa";
    var lightbackground = this.config.lightbackground ? this.config.lightbackground : "#a1a0a6";
    var borderradius = this.config.borderradius ? this.config.borderradius : "15px";
    var buttonborderradius = this.config.buttonborderradius ? this.config.buttonborderradius : "15px";
    var lightdistance = this.config.coverdistance ? this.config.coverdistance : "150px";


    return html`
        <div class="page" style="background:${background};">
          
          <div class="main">
            <div class="inner-main" style="width:${this.config.entities.length * 150}px;">
            ${this.config.entities.map(ent => {
                entityCounter++;
                var switchValue = 0;
                const stateObj = this.hass.states[ent.entity];
                switch(stateObj.state) {
                    case 'on':
                        switchValue = 1;
                        break;
                    case 'off':
                        switchValue = 0;
                        break;
                    default:
                        switchValue = 0;
                }
                return stateObj ? html`
                    <div class="light" style="--lightdistance: ${lightdistance};">
                      <div class="light-slider">
                        <h2>${ent.name || stateObj.attributes.friendly_name}</h2>
                        ${stateObj.attributes.supported_features > 9 ? html`
                            <h4 class="brightness">${stateObj.state === "off" ? 0 : Math.round(stateObj.attributes.brightness/2.55)}</h4>
                            <div class="range-holder" style="--slider-height: ${brightnessHeight}; --lightcolor: ${lightcolor}; --lightbackground: ${lightbackground}; --borderradius: ${borderradius};">
                              <input type="range" class="${stateObj.state}" style="--slider-width: ${brightnessWidth};--slider-height: ${brightnessHeight};" .value="${stateObj.state === "off" ? 0 : Math.round(stateObj.attributes.brightness/2.55)}" @change=${e => this._setBrightness(stateObj, e.target.value)}>
                            </div>
                        ` : html`
                            <h4>${stateObj.state}</h4>
                            <div class="switch-holder" style="--switch-height: ${switchHeight}; --lightcolor: ${lightcolor}; --lightbackground: ${lightbackground}; --borderradius: ${borderradius};">
                              <input type="range" class="${stateObj.state}" style="--switch-width: ${switchWidth};--switch-height: ${switchHeight};" value="0" min="0" max="1" .value="${switchValue}" @change=${e => this._switch(stateObj)}>
                            </div>
                        `}
                      </div>
                      <div class="toggle" style="--lightbackground: ${lightbackground}; --buttonborderradius: ${buttonborderradius};">
                        <input ?checked=${stateObj.state == "on"} type="checkbox" id='toggle${entityCounter}' class='toggle-btn' @change=${e => this._switch(stateObj)} />
                        <label for='toggle${entityCounter}'><span></span></label>
                      </div>  
                    </div>
                `: html``;
            })}
            </div>
          </div>
          <div class="side" style="background:${sidebackground};">
            <div class="header">
            </div>
            <div class="center">
              <h1>${this.config.title}</h1>
              <h3>${this._stateCount()} ${countText}</h3>
            </div>
          <div class="${innershadow ? 'card_shadow' : 'card_no_shadow'}" style="background:${background};">
            <div class="${innershadow ? 'inner-main' : 'inner-main_no_shadow'}">
            ${this.config.sidebuttons.map(ent => {
                 const sideBnt = this.hass.states[ent.entity];
                 return sideBnt ? html`
                    <div class="frame_1">
                              <div class="grid-container">
                              ${ent.cardtype == "button" ? html`
                                    <div class="${iconemboss? 'iconside icon_shadow click' : 'iconside click'}" 
                                                  style="${sideBnt.state =="on" ? 'background-color: var(--active-background-button-color); --buttonborderradius: ${buttonborderradius};' : 'background-color: var(--deactive-background-button-color); border: solid 1px var(--button-border-standard);'} --buttonborderradius: ${buttonborderradius};" @click=${e => this._switch(sideBnt)}>
                                        <ha-icon icon="${ent.icon  || sideBnt.attributes.icon}" 
                                                  style="color:${sideBnt.state =="on" ? 'var(--state-icon-secondary-color);' : 'var(state-icon-color);'}"/>
                                      </div>
                                      <div class="left_row text ">${ent.name || sideBnt.attributes.friendly_name} </div>  
                                      <div class="left_row label">${ent.label}</div> 
                                        </div>
                              ` : html`
                              `}
                              ${ent.cardtype == "script" ? html`
                                    <div class="${iconemboss? 'iconside icon_shadow click' : 'iconside click'}" style="background-color: var(--deactive-background-button-color); border: solid 1px var(--button-border-standard); --buttonborderradius: ${buttonborderradius};" @click=${e => this._switch(sideBnt)}>
                                        <ha-icon icon="${ent.icon  || sideBnt.attributes.icon}" style="color: var(--state-icon-primary-color);"/>
                                      </div>
                                      <div class="left_row text ">${ent.name || sideBnt.attributes.friendly_name}</div>  
                                      <div class="left_row label">${ent.label}</div> 
                                        </div>
                              ` : html`
                              `}
                              
                `: html``;
              })} 
        </div>
    `;
  }
    
  updated() {}
  
  _setBrightness(state, value) {
    this.hass.callService("homeassistant", "turn_on", {
        entity_id: state.entity_id,
        brightness: value * 2.55
    });
  }
  
  _stateCount() {
      let count = 0;
      this.config.entities.map(ent => {
          const stateObj = this.hass.states[ent.entity];
          if(stateObj.state === "on") {
              count++;
          }
      })
      return count;
  }
  
  _switch(state) {
      this.hass.callService("homeassistant", "toggle", {
        entity_id: state.entity_id    
      });
  }
  
  _navigate(path) {
      window.location.href = path;
  }
  
  setConfig(config) {
    if (!config.entities) {
      throw new Error("You need to define entities");
    }
    if (!config.title) {
      throw new Error("You need to define a title");
    }
    if (!config.icon) {
      throw new Error("You need to define a icon");
    }
    this.config = config;
  }

  getCardSize() {
    return this.config.entities.length + 1;
  }
  
  static get styles() {
    return css`


    .frame_1 {
          
      display:inline-block;
      justify-self: stretch;
      border-radius:20px;
      height: 70px;
      width: 290px

    }

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

    .card_shadow {

      height:100%;
      width: 98%;

      border-radius:20px;
      display:flex;
      flex-direction: row;
     // justify-self: stretch;
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
    
    .iconside {
      position: relative;

      border-radius: var(--buttonborderradius);
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
      .iconside:hover  {
        background-color: var(--active-background-button-color);
      }
      
      .iconside:after {
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

      .iconside:active:after {
        padding: 0;
        margin: 0;
        opacity: 1;
        transition: 0s
      }

      .click {
        cursor: pointer;
      }

      .icon_shadow {
        box-shadow: -3px -3px 3px 0 rgba(255,255,255,.2),6px 6px 6px 0 rgba(0,0,0,.1);
        border: solid 1px rgba(255,255,255, .2)
        
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

      .left_row {
        margin-left:15px;
        margin-right:15px;
      }

      ha-icon {

        width:26px;
        height:26px;
        display: block;

        margin-left: auto;
        margin-right: auto;
        
      }


        :host {
            
        }
        .page {
          width:100%;
          height:100%;
          display:flex;
          flex-direction: row;
        }
        .page > .side {
          padding: 15px;
          width: 300px;
          display:flex;
          flex-direction:column;
          background: transparent; 
          align-items:flex-end;
//          background: linear-gradient(235deg, rgba(28,122,226,1) 0%, rgba(66,230,222,1) 90%);
//          justify-content:space-between
        }
        .side .header {
          
        }

        .side .center {
          display:flex;
          flex-direction:column;
          
        }
        .side .center .icon {
          display:block;
          overflow:hidden;
        }
        .side .center .icon ha-icon {
          width: 80px;
          height: 80px;
          color: red;
        }
        .side .center  h1 {
          color: var(--primary-text-color);
          width: 290px;
          margin:20px 0 0 0;
          font-weight:400;
          font-size: 35px;
          line-height: 40px;
        }
        .side .center  h3 {
          color: var(--primary-text-color);
          margin:5px 0 0 0;
          font-size: 20px;
          font-weight: 400;
          margin-bottom: 20px;
          
        }
        
        .side .bottom {
        }
        
        .bottom_space {
          margin-top:20px; 
        }



        :host {
            
        }
        .page {
          width:100%; 
          // margin-top: 170px;
          // overflow: hidden;
          // overflow-x:scroll;
        }

        .page > .side {
          padding: 15px;
          width: 300px;
          display:flex;
          flex-direction:column;
          background: transparent; 
          align-items:flex-end;
//          background: linear-gradient(235deg, rgba(28,122,226,1) 0%, rgba(66,230,222,1) 90%);
//          justify-content:space-between
        }

        .side .header {
          
        }

        .side .center {
          display:flex;
          flex-direction:column;
          
        }
        .side .center .icon {
          display:block;
          overflow:hidden;
        }
        .side .center .icon ha-icon {
          width: 80px;
          height: 80px;
          color: red;
        }
        .side .center  h1 {
          color: var(--primary-text-color);
          width: 290px;
          margin:20px 0 0 0;
          font-weight:400;
          font-size: 35px;
          line-height: 40px;
        }
        .side .center  h3 {
          color: var(--primary-text-color);
          margin:5px 0 0 0;
          font-size: 20px;
          font-weight: 400;
          margin-bottom: 20px;
          
        }

        
        .side .bottom {
        }
        
        .bottom_space {
          margin-top:20px; 
        }
        
        .page > .main {
          width:86%; 
          // margin-top: 170px;
          // overflow: hidden;
          // overflow-x:scroll;
        }
        .page > .main > .inner-main {
          display:flex;
          flex-direction:row;
          align-items:center;
          height:100%;
          margin:auto;
        }
        .page > .main > .inner-main > .light {
          width: var(--lightdistance);
          display:inline-block;
        }
        
        .light .icon {
          margin: 0 auto;
          text-align:center;
          display:block;
          height: 40px;
          width: 40px;
          color: rgba(255,255,255,0.3);
          font-size: 30px;
          padding-top:5px;
        }
        .light .icon ha-icon {
          width:30px;
          height:30px;
        }
        .light .icon.on ha-icon {
          fill: #f7d959;
        }
        h2 {
          color: var(--primary-text-color);
          display: block;
          font-weight: 300;
          margin-bottom: 10px;
          text-align: center;
          font-size:20px;
          margin-top:0;
        }
        h4 {
          color: var(--primary-text-color);
          display: block;
          font-weight: 300;
          margin-bottom: 30px;
          text-align: center;
          font-size:16px;
          margin-top:0;
        }
        h4.brightness:after {
          content: "%";
          padding-left: 1px;
        }
        
        .range-holder {
          height: var(--slider-height);
          position:relative;
          display: block;
        }
        .range-holder input[type="range"] {
          outline: 0;
          border: solid 2px var(--lightbackground);
          border-radius: var(--borderradius);
          width: var(--slider-height);
          margin: 0;
          transition: box-shadow 0.2s ease-in-out;
          -webkit-transform:rotate(270deg);
          -moz-transform:rotate(270deg);
          -o-transform:rotate(270deg);
          -ms-transform:rotate(270deg);
          transform:rotate(270deg);
          overflow: hidden;
          height: var(--slider-width);
          -webkit-appearance: none;
          background-color: var(--lightbackground);
          position: absolute;
          top: calc(50% - (var(--slider-width) / 2));
          right: calc(50% - (var(--slider-height) / 2));
        }
        .range-holder input[type="range"]::-webkit-slider-runnable-track {
          height: var(--slider-width);
          -webkit-appearance: none;
          color: #636363;
          margin-top: -1px;
          transition: box-shadow 0.2s ease-in-out;
        }
        .range-holder input[type="range"]::-webkit-slider-thumb {
          width: 25px;
          border-right:10px solid var(--lightcolor);
          border-left:10px solid var(--lightcolor);
          border-top:20px solid var(--lightcolor);
          border-bottom:20px solid var(--lightcolor);
          -webkit-appearance: none;
          height: 80px;
          cursor: ns-resize;
          background: var(--lightcolor);
          box-shadow: -350px 0 0 350px var(--lightcolor), inset 0 0 0 80px #969696;
          border-radius: 0;
          transition: box-shadow 0.2s ease-in-out;
          position: relative;
          top: calc((var(--slider-width) - 80px) / 2);
        }
        // .range-holder input[type="range"].on::-webkit-slider-thumb {
        //     border-color: #1c7ae2;
        //     box-shadow: -350px 0 0 350px #1c7ae2, inset 0 0 0 80px #FFF;
        // }
        
        .switch-holder {
          height: var(--switch-height);
          position:relative;
          display: block;
        }
        .switch-holder input[type="range"] {
          outline: 0;
          border: 0;
          border-radius: var(--borderradius);
          width: calc(var(--switch-height) - 20px);
          margin: 0;
          transition: box-shadow 0.2s ease-in-out;
          -webkit-transform: rotate(270deg);
          -moz-transform: rotate(270deg);
          -o-transform: rotate(270deg);
          -ms-transform: rotate(270deg);
          transform: rotate(270deg);
          overflow: hidden;
          height: calc(var(--switch-width) - 20px);
          -webkit-appearance: none;
          background-color: var(--lightbackground);
          padding: 10px;
          position: absolute;
          top: calc(50% - (var(--switch-width) / 2));
          right: calc(50% - (var(--switch-height) / 2));
        }
        .switch-holder input[type="range"]::-webkit-slider-runnable-track {
          height: calc(var(--switch-width) - 20px);
          -webkit-appearance: none;
          color: #636363;
          margin-top: -1px;
          transition: box-shadow 0.2s ease-in-out;
        }
        .switch-holder input[type="range"]::-webkit-slider-thumb {
          width: calc(var(--switch-height) / 2);
          -webkit-appearance: none;
          height: calc(var(--switch-width) - 20px);
          cursor: ew-resize;
          background: red; 
          transition: box-shadow 0.2s ease-in-out;
          box-shadow: -340px 0 0 350px var(--lightbackground), inset 0 0 0 80px var(--lightcolor);
          position: relative;
          top: 0;
          border-radius: var(--borderradius);
        }
        // .switch-holder input[type="range"].on::-webkit-slider-thumb {
        //     box-shadow: -340px 0 0 350px #4d4d4d, inset 0 0 0 80px #1c7ae2;
        // }
        
        .toggle {
          margin-top:30px;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .toggle > input.toggle-btn {
          display: none;
        }
        .toggle > input.toggle-btn + label {
          border: 1px solid var(--lightbackground);
          background: var(--deactive-background-button-color);
          width:100px;
          height:100px;
          text-align:center;
          line-height:100px;
          cursor: pointer;
          border-radius: var(--buttonborderradius);
          color: var(--secondary-text-color);
          display:block;
          font-size:22px;
        }
        .toggle > input.toggle-btn:not(:checked) + label > span:before {
          content: 'Off';
        }
        .toggle > input.toggle-btn + label:active,
        .toggle > input.toggle-btn:checked + label {
          color: var(--text-primary-color);
          background: var(--active-background-button-color);
          border-color: var(--lightbackground);
        }
        .toggle > input.toggle-btn:checked + label > span:before {
          content: 'On';
        }
        .push {
          margin-top:10px;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .push > input.push-btn {
          display: none;
        }
        .push > input.push-btn + label {
          border: 0px solid rgba(57,128,228,0.4);
          background: var(--lightbackground);

          width:70px;
          height:50px;
          text-align:center;
          line-height:50px;
          cursor: pointer;
          border-radius: var(--buttonborderradius);
          color: #b2abcf;
          display:block;
          font-size:22px;
        }

        .push > input.push-btn + label:active,
        .push:hover > input.push-btn + label {
          background: var(--state-icon-active-color);
          color: #fff;
          border-color: #1c7ae2;
        }
    `;
  }  
  
}

customElements.define('lights-panel-card', LightsPanelCard);
