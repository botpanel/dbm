const { join } = require("path");
const fs = require("fs");

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
        
        <input type="button" class="button" value="Save Configuration" id="saveButton">
      </div>
      
      <div style="w-full; height: 1px; background-color: white; margin: 10px;"></div>
      
      <div class="box">
        <h1 class="title">Developer Options</h1>
        
        <h3 class="title" style="margin-top: 10px;">WebSocket URL</h3>
        <p class="text">For development purposes only. Do not edit this value.</p>
        <input id="websocketUrl" class="input" type="text" placeholder="WebSocket URL">
        
        <h3 class="title" style="margin-top: 10px;">Debug Mode</h3>
        <p class="text">Enable or disable debug logging.</p>
        <select id="debugMode" class="input">
          <option value="1">Enable</option>
          <option value="0">Disable</option>
        </select>
        
        <input type="button" class="button" value="Save Development Options" id="devSaveButton">
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

    const websocketUrl = document.getElementById("websocketUrl");
    const debugMode = document.getElementById("debugMode");

    const error = document.getElementById("error");
    const message = document.getElementById("message");

    if (fs.existsSync(join(__dirname, "../", "dashboard-config.json"))) {
      const data = JSON.parse(fs.readFileSync(join(__dirname, "../", "dashboard-config.json"), "utf-8"));
      secret.value = data.secret || "";
      id.value = data.id || "";

      websocketUrl.value = data.websocketUrl || "wss://wss.botpanel.xyz";
      debugMode.value = data.debugMode || "0";
    }

    document.getElementById("devSaveButton").addEventListener("click", () => {
      if (!websocketUrl.value) {
        error.innerText = "Please ensure all fields have a value.";
        error.parentElement.style.display = "block";
        return;
      }

      const writeObject = {};

      const currentData = fs.readFileSync(join(__dirname, "../", "dashboard-config.json"), "utf-8");
      if (currentData) {
        const parsedData = JSON.parse(currentData);
        for (const key in parsedData) {
          if (parsedData.hasOwnProperty(key)) {
            writeObject[key] = parsedData[key];
          }
        }
      }

      writeObject.websocketUrl = websocketUrl.value;
      writeObject.debugMode = debugMode.value;

      fs.writeFileSync(join(__dirname, "../", "dashboard-config.json"), JSON.stringify(writeObject));

      error.parentElement.style.display = "none";
      message.innerText = "Saved!";
      message.parentElement.style.display = "block";
    });

    document.getElementById("saveButton").addEventListener("click", () => {
      if (!secret.value || !id.value) {
        error.innerText = "Please ensure all fields have a value.";
        error.parentElement.style.display = "block";
        return;
      }

      const writeObject = {};

      const currentData = fs.readFileSync(join(__dirname, "../", "dashboard-config.json"), "utf-8");
      if (currentData) {
        const parsedData = JSON.parse(currentData);
        for (const key in parsedData) {
          if (parsedData.hasOwnProperty(key)) {
            writeObject[key] = parsedData[key];
          }
        }
      }

      writeObject.secret = secret.value;
      writeObject.id = id.value;

      fs.writeFileSync(join(__dirname, "../", "dashboard-config.json"), JSON.stringify(writeObject));

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
    const WebSocket = require("ws");
    const WS_VERSION = "1.1.0";
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

    const log = ({ message, isErr = false }) => {
      console.log(`[${isErr ? "BotPanel Error" : "BotPanel"}] (${new Date().toLocaleString()}) - ${message}`);
    }

    let applicationId, applicationSecret, debug, wssURL;
    const config = join(__dirname, "../", "dashboard-config.json");

    if (config) {
      const data = require(config);
      applicationId = data.id;
      applicationSecret = data.secret;
      debug = data.debugMode === "1";
      wssURL = data.websocketUrl || "wss://wss.botpanel.xyz";
    } else {
      return log({ message: "No configuration file found. Please configure the extension.", isErr: true });
    }

    log({ message: "Loaded configuration, waiting for bot to start." });

    Bot.onReady = async function dashboardOnReady(...params) {
      const bot = DBM.Bot.bot;
      bot.dashboard = {};
      let allowReconnect = true;

      log({ message: "Mounted." });
      let isReconnecting = false;

      const connect = () => {
        log({ message: "Attempting to connect to dashboard..." });
        const ws = new WebSocket(wssURL);

        const timeout = setTimeout(() => {
          log({ message: "Failed to connect to dashboard. Retrying in 5 seconds..." });
          ws.terminate();
          if (allowReconnect) {
            isReconnecting = true;
            setTimeout(connect, 5000);
          }
        }, 5000);

        ws.on("open", () => {
          log({ message: "Connected to dashboard." });
          clearTimeout(timeout);
          isReconnecting = false;
        });

        ws.on("close", () => {
          if (!isReconnecting) {
            log({ message: "Disconnected from dashboard." });
            if (allowReconnect) {
              isReconnecting = true;
              setTimeout(connect, 5000);
            }
          }
        });

        ws.on("error", (err) => {
          if (!isReconnecting) {
            log({ message: `Error connecting to dashboard: ${err}`, isErr: true });
            if (allowReconnect) {
              isReconnecting = true;
              setTimeout(connect, 5000);
            }
          }
        });

        ws.on("message", (message) => handleMessage(message, ws));

        bot.dashboard.ws = ws;

        bot.dashboard.ws.sendPacket = ({ op, d }) => {
          if (!Bot.bot.dashboard.ws) return log({ message: "Attempted to send packet before connection was established.", isErr: true });
          Bot.bot.dashboard.ws.send(JSON.stringify({ op, d }));
          if(debug)
            log({ message: `TX: ${JSON.stringify({ op, d })}` });
        }
      }

      connect();

      const operationHandlers = {
        [OPCODES.AUTHENTICATE]: ({ applicationId, applicationSecret }) => {
          log({ message: "Authenticating with dashboard..." });
          bot.dashboard.ws.sendPacket({
            op: OPCODES.AUTHENTICATE,
            d: {
              connectAs: "application",
              applicationId,
              applicationSecret,
              version: WS_VERSION
            }
          });
        },
        [OPCODES.AUTH_SUCCESS]: ({ data, ws }) => {
          log({ message: `Successfully authenticated with application "${data.d.name}" (${applicationId})!` });
          setInterval(() => {
            ws.send(JSON.stringify({
              op: OPCODES.HEARTBEAT
            }));
          }, data.d.heartbeatInterval);
        },
        [OPCODES.ERROR]: ({ data }) => {
          if (data.d.error === "Invalid websocket version. UPDATE EXTENSION.") allowReconnect = false;
        },
        [OPCODES.GUILD_INTERACTION]: async ({ data, ws }) => {
          const { guildId, interactionId, include } = data.d;

          const guild = await bot.guilds.fetch({ guild: guildId, withCounts: false }).catch(() => null);
          let serverData = fs.readFileSync(join(__dirname, "../", "data", "servers.json"), "utf-8");

          try {
            serverData = JSON.parse(serverData);
          } catch (e) {
            return log({ message: `Error parsing server data: ${e}`, isErr: true });
          }

          let roles, channels;
          if (include.some(i => ["textChannels", "voiceChannels", "categories"].includes(i)))
            channels = await guild?.channels.fetch().catch(() => null);
          if (include.includes("roles"))
            roles = await guild?.roles.fetch().catch(() => null);

          const textChannels = channels ? channels.filter(c => c.type === "GUILD_TEXT").map(c => { return { id: c.id, name: c.name, position: c.position } }) : [];
          const voiceChannels = channels ? channels.filter(c => c.type === "GUILD_VOICE").map(c => { return { id: c.id, name: c.name, position: c.position } }) : [];
          const categories = channels ? channels.filter(c => c.type === "GUILD_CATEGORY").map(c => { return { id: c.id, name: c.name, position: c.position } }) : [];

          roles = roles ? roles.map(r => { return { id: r.id, name: r.name, position: r.position, managed: r.managed } }) : [];

          ws.send(JSON.stringify({
            op: OPCODES.REQUEST_GUILD_DATA,
            d: {
              interactionId,
              data: serverData[guildId] || {},
              inGuild: !!guild,
              ...(roles && { roles }),
              ...(textChannels && { textChannels }),
              ...(voiceChannels && { voiceChannels }),
              ...(categories && { categories })
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
          log({ message: `RX: ${JSON.stringify(data)}` });

        const handler = operationHandlers[data.op];
        if (handler) {
          try {
            await handler({ data, ws, applicationId, applicationSecret });
          } catch (e) {
            log({ message: `Error handling operation ${data.op}: ${e}`, isErr: true });
          }
        }
      }
      onReady.apply(this, ...params);
    }
  },
};
