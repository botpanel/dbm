const { join } = require("path");
const fs = require("fs");
const WebSocket = require("ws");

module.exports = {
  //---------------------------------------------------------------------
  // Editor Extension Name
  //
  // This is the name of the editor extension displayed in the editor.
  //---------------------------------------------------------------------

  name: "Bot Panel",

  //---------------------------------------------------------------------
  // Is Editor Extension
  //
  // Must be true to appear in the main editor context menu.
  // This means there will only be one copy of this data per project.
  //---------------------------------------------------------------------

  isEditorExtension: true,

  //---------------------------------------------------------------------
  // Save Button Text
  //
  // Customizes the text of the "Save Extension" at the bottom
  // of the extension window.
  //---------------------------------------------------------------------

  saveButtonText: "Exit",

  //---------------------------------------------------------------------
  // Extension Fields
  //
  // These are the fields for the extension. These fields are customized
  // by creating elements with corresponding Ids in the HTML. These
  // are also the names of the fields stored in the command's/event's JSON data.
  //---------------------------------------------------------------------

  fields: [],

  //---------------------------------------------------------------------
  // Default Fields
  //
  // The default values of the fields.
  //---------------------------------------------------------------------

  defaultFields: {},

  //---------------------------------------------------------------------
  // Extension Dialog Size
  //
  // Returns the size of the extension dialog.
  //---------------------------------------------------------------------

  size: function () {
    return { width: 500, height: 500 };
  },

  //---------------------------------------------------------------------
  // Extension HTML
  //
  // This function returns a string containing the HTML used for
  // the context menu dialog.
  //---------------------------------------------------------------------

  html: function (data) {
    return `
    <!-- Keep this here so intellij editors can recognize this as jsx and enable syntax highlighting. -->
    <div a={}></div>
    <style>
      .container {
          background-color: #292929;
          color: white;
          width: 100%;
          height: 100%;
          overflow: auto;
          padding: 10px;
      }
      
      .box {
          margin: 10px;
          padding: 10px;
          background-color: #1e1e1e;
          border-radius: 5px;
      }
      
      .error-box {
          border: 1px solid red;
          display: none;
      }
      
      .message-box {
          display: none;
          border: 1px solid green;
      }
      
      .title {
          margin: 0px;
          padding: 0px;
          font-size: 20px;
      }
      
      .text {
          margin: 0px;
          padding: 0px;
          font-size: 12px;
      }
      
      .input {
          padding: 5px 10px;
          margin: 5px;
          margin-left: 0px;
          width: 100%;
          border-radius: 5px;
          border: 1px solid #1e1e1e;
          background-color: #292929;
          color: white;
      }
      
      .button {
          border-radius: 5px;
          background-color: #1e1e1e;
          color: white;
          border: 1px solid green;
          padding: 5px;
          margin: 5px;
          margin-left: 0px;
      }
      
      .button:hover {
          background-color: #292929;
      }
    </style>
    <div class="container">
      <div class="box">
        <h1 class="title">DBM Dashboard</h1>
        <p class="text">This is the extension for <a href="https://dbmdashboard.com">DBM Dashboard</a>.</p>
      </div>
      <div class="box error-box" id="error-container">
        <h1 class="title">Error</h1>
        <p class="text" id="error"></p>
      </div>
      <div class="box message-box" id="message-container">
        <p class="text" id="message"></p>
      </div>
      
      <div class="box">
        <h3 class="title">Authentication</h3>
        <p class="text">Please enter your application id and secret into the boxes below</p>
        <input id="applicationId" class="input" type="text" placeholder="Application ID">
        <input id="applicationSecret" class="input" type="password" placeholder="Application Secret">
        <input type="button" class="button" value="Save" id="saveButton">
      </div>
    </div>
    `
  },

  //---------------------------------------------------------------------
  // Extension Dialog Init Code
  //
  // When the HTML is first applied to the extension dialog, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init: function (document, globalObject) {
    const secret = document.getElementById("applicationSecret");
    const id = document.getElementById("applicationId");

    const error = document.getElementById("error");
    const message = document.getElementById("message");

    if (fs.existsSync(join(__dirname, "../", "dashboard-config.json"))) {
      const data = JSON.parse(fs.readFileSync(join(__dirname, "../", "dashboard-config.json"), 'utf-8'));
      secret.value = data.secret || "";
      id.value = data.id || "";
    }

    document.getElementById("saveButton").addEventListener("click", () => {
      if (!secret.value || !id.value) {
        error.innerText = "Please enter a valid application id and secret.";
        error.parentElement.style.display = "block";
        return;
      }

      const data = {
        secret: secret.value,
        id: id.value
      };

      fs.writeFileSync(join(__dirname, "../", "dashboard-config.json"), JSON.stringify(data));

      error.parentElement.style.display = "none";

      message.innerText = "Saved!";
      message.parentElement.style.display = "block";
    });
  },

  //---------------------------------------------------------------------
  // Extension Dialog Close Code
  //
  // When the dialog is closed, this is called. Use it to save the data.
  //---------------------------------------------------------------------

  close: function (document, data, globalObject) {

  },

  //---------------------------------------------------------------------
  // Editor Extension Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //
  // This is absolutely necessary for editor extensions since it
  // allows us to setup modifications for the necessary functions
  // we want to change.
  //
  // The client object can be retrieved from: `const bot = DBM.Bot.bot;`
  // Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
  //---------------------------------------------------------------------

  mod: async function (DBM) {
    const debug = false;
    const WebSocket = require("ws");
    const { Bot, Events } = DBM;
    const { onReady } = Bot;

    const OPCODES = {
      AUTHENTICATE: 0,
      AUTH_SUCCESS: 1,
      ERROR: 2,
      GUILD_INTERACTION: 4,
      REQUEST_GUILD_DATA: 5,
      MODIFY_GUILD_DATA: 6,
      HEARTBEAT: 8,
    };

    let applicationId, applicationSecret;
    const config = join(__dirname, "../", "dashboard-config.json");

    if (config) {
      const data = require(config);
      applicationId = data.id;
      applicationSecret = data.secret;
    }

    console.log("[DBM Dashboard] Waiting for bot to start...");

    Bot.onReady = async function dashboardOnReady(...params) {
      const bot = DBM.Bot.bot;
      bot.dashboard = {};

      console.log("[DBM Dashboard] Initialized.");

      const connect = () => {
        const ws = new WebSocket("wss://botpanel.xyz/api/ws");

        ws.on("open", () => {
          console.log("[DBM Dashboard] Connected to dashboard.");
        });

        ws.on("close", () => {
          console.log("[DBM Dashboard] Connection closed. retrying...");
          setTimeout(connect, 5000);
        });

        ws.on("error", (err) => {
          console.log(`[DBM Dashboard] Error: ${err}`);
          console.log("[DBM Dashboard] Retrying...");
          setTimeout(connect, 5000);
        });

        ws.on("message", (message) => handleMessage(message, ws));

        bot.dashboard.ws = ws;
      }

      connect();

      const operationHandlers = {
        [OPCODES.AUTHENTICATE]: ({ applicationId, applicationSecret }) => {
          console.log("[DBM Dashboard] Attempting to authenticate...");
          bot.dashboard.ws.send(JSON.stringify({
            op: OPCODES.AUTHENTICATE,
            d: {
              connectAs: "application",
              applicationId,
              applicationSecret
            }
          }));
        },
        [OPCODES.AUTH_SUCCESS]: ({ data, ws }) => {
          console.log(`[DBM Dashboard] Successfully authenticated with application "${data.d.name}" (${applicationId})!`);
          setInterval(() => {
            ws.send(JSON.stringify({
              op: OPCODES.HEARTBEAT
            }));
          }, data.d.heartbeatInterval);
        },
        [OPCODES.ERROR]: ({ data }) => {
          console.log(`[DBM Dashboard] Error: ${data.d.error}`);
        },
        [OPCODES.GUILD_INTERACTION]: async ({ data, ws }) => {
          const { guildId, interactionId } = data.d;

          const guild = await bot.guilds.fetch({ guild: guildId, withCounts: false }).catch(() => null);
          let serverData = fs.readFileSync(join(__dirname, "../", "data", "servers.json"), "utf-8");

          try {
            serverData = JSON.parse(serverData);
          } catch (e) {
            return console.log(`[DBM Dashboard] Error parsing servers.json: ${e}`);
          }

          ws.send(JSON.stringify({
            op: OPCODES.REQUEST_GUILD_DATA,
            d: {
              interactionId,
              data: serverData[guildId] || {},
              inGuild: !!guild
            }
          }));
        },
        [OPCODES.MODIFY_GUILD_DATA]: ({ data }) => {
          Events.dbmDashboardDataUpdate(data.d);
        }
      };

      const handleMessage = async (message, ws) => {
        const data = JSON.parse(message);
        if (debug)
          console.log(`[DBM Dashboard] Received message: ${message}`);

        const handler = operationHandlers[data.op];
        if (handler) {
          try {
            await handler({ data, ws, applicationId, applicationSecret });
          } catch (e) {
            console.log(`[DBM Dashboard] Error handling message: ${e}`);
          }
        }
      }
      onReady.apply(this, ...params);
    }
  },
};