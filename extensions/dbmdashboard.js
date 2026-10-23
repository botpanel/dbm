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

  saveButtonText: "Save & Exit",

  //---------------------------------------------------------------------
  // Extension Fields
  //
  // These are the fields for the extension. These fields are customized
  // by creating elements with corresponding Ids in the HTML. These
  // are also the names of the fields stored in the command's/event's JSON data.
  //---------------------------------------------------------------------

  fields: [
    "applicationId",
    "applicationSecret",

    "varSelectType",
    "var_tempvar",
    "var_Input",

    "debugMode",
    "websocketUrl",
  ],

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
    return /* html */ `
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

      .subtitle {
        margin: 0px;
        padding: 0px;
        font-size: 15px;
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
        height: 30px;
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
      <h1 class="title">Bot Panel</h1>
      <p class="text">This is the extension for <a onclick="window.globalOpenLink('https://botpanel.xyz')">Bot Panel <i class="icon external"></i></a>.</p>
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
      <p class="text">Please enter your application's credentials below.</p>

      <input id="applicationId" value="${data.id ?? ""}" class="input" type="text" placeholder="Application ID">
      <input id="applicationSecret" value="${data.secret ?? ""}" class="input" type="password" placeholder="Application Secret">

      <br>

      <h1 class="subtitle" style="margin-top: 10px;">Dashboard Variable Input</h1>
      <p class="text">Variables are used for components on the dashboard.</p>
      <div style="display:flex;">
      <select id="varSelectType" initvalue="${data.varSelectType}" onchange="document.getElementById('var_Input').value = varValueTable[this.value] ?? ''" class="input">
      <option value="0">None</option>
      <option value="1">Use Server Variable</option>
      <option value="2">Use Global Variable</option>
      <option value="3">Call Command/Event</option>
      </select>

      <div id="div-var_Input">
      <input value="${data.varInput}" onchange="varValueTable[document.getElementById('varSelectType').value] = this.value" id="var_Input" class="input">
      </div>
      <div style="flex-shrink: 1" id="div-var_tempvar">
      <input value="${data.varTempVar}" id="var_tempvar" style="margin-left:2px" class="input" placeholder="Temp Var"></input>
      <br>
      </div>
      </div>
      <h id="varNote" class="text" style="margin-up:"300px" margin-left:-905px">The specified temp variable will be used for the dashboard's variables.</h>
      </div>

      <div style="w-full; height: 1px; background-color: white; margin: 10px;"></div>

      <div class="box">
      <h1 class="title">Developer Options</h1>

      <h3 class="subtitle" style="margin-top: 10px;">Debug Logging</h3>
      <p class="text">Enable or disable debug logging.</p>
      <select id="debugMode" initvalue="${data.debugMode ?? ""}" class="input">
      <option value="1">Enable</option>
      <option value="0">Disable</option>
      </select>

      <h3 class="subtitle" style="margin-top: 10px;">WebSocket URL</h3>
      <p class="text">For development purposes only. Do not edit this value.</p>
      <input id="websocketUrl" value="${data.websocketUrl ?? "wss://wss.botpanel.xyz"}" class="input" type="text" placeholder="WebSocket URL">
      </div>
      </div>
      `;
  },

  //---------------------------------------------------------------------
  // Extension Dialog Init Code
  //
  // When the HTML is first applied to the extension dialog, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init: function (document, globalObject) {
    varValueTable = {};

    secret = document.getElementById("applicationSecret");
    id = document.getElementById("applicationId");

    websocketUrl = document.getElementById("websocketUrl");
    debugMode = document.getElementById("debugMode");

    // debugMode.value = data.websocketUrl ?? "";

    varSelectType = document.getElementById("varSelectType");
    varInput = document.getElementById("var_Input");
    varTempVar = document.getElementById("var_tempvar");

    $("#varSelectType").val(varSelectType.getAttribute("initvalue"));
    $("#debugMode").val(debugMode.getAttribute("initvalue"));
    updateVarInput();

    const error = document.getElementById("error");
    const message = document.getElementById("message");

    function importLegacyConfig(filePath, callback) {
      let data;
      try {
        data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (e) {
        error.innerHTML = "Failed to import config file.";
        error.parentElement.style.display = "block";
        console.log("Failed to load config.", e);
        return;
      }
      secret.value = data.secret || "";
      id.value = data.id || "";

      $("#debugMode").val(data.debugMode || "0");
      websocketUrl.value = data.websocketUrl || "wss://wss.botpanel.xyz";

      $("#varSelectType").val(data.varSelectType || "0");
      varInput.value = data.varInput || "";
      varTempVar.value = data.varTempVar || "";

      updateVarInput();

      varValueTable[varSelectType.value] = varInput.value;

      message.parentElement.style.display = "block";
      message.innerHTML =
        "Config imported! Remember to save your project file.";

      if (callback) {
        callback();
      }
    }

    function updateVarInput() {
      const div_input = document.getElementById("div-var_Input");
      const div_tempvar = document.getElementById("div-var_tempvar");
      const varNote = document.getElementById("varNote");
      div_input.style = "display:none";
      div_tempvar.style = "display:none";
      varNote.style = "display:none";
      varSelectType.style = "";
      if (varSelectType.value >= 1) {
        div_input.style = "";
        varSelectType.style = "width: 60%";
        if (varSelectType.value == 1 || varSelectType.value == 2)
          varInput.placeholder = "Variable name";
        if (varSelectType.value == 3)
          ((varInput.placeholder = "ID"),
            (div_tempvar.style = ""),
            (varNote.style = ""));
      }
    }
    updateVarInput();

    varSelectType.addEventListener("change", updateVarInput);

    // detect old config

    const legacyConfigPath = join(__dirname, "../", "dashboard-config.json");
    if (fs.existsSync(legacyConfigPath)) {
      message.innerHTML =
        "<b>Old config file found. Would you like to migrate it?";
      message.parentElement.style.display = "block";
      const yes = document.createElement("button");
      const no = document.createElement("button");
      const discard = document.createElement("button");

      yes.className = "button";
      yes.style = "float: right";
      yes.innerText = "Yes";
      yes.id = "yes";

      no.className = "button";
      no.style = "float: right";
      no.innerText = "Ignore";
      no.id = "no";

      discard.className = "button";
      discard.style = "color: red; float: right";
      discard.innerText = "Delete";
      discard.id = "discard";

      message.appendChild(discard);
      message.appendChild(no);
      message.appendChild(yes);

      yes.addEventListener("click", () => {
        importLegacyConfig(legacyConfigPath, () => {
          fs.unlink(legacyConfigPath, (err) => {
            console.log("Failed to delete file:", err);
          });
        });
        message.parentElement.style.display = "none";
      });
      no.addEventListener("click", () => {
        message.parentElement.style.display = "none";
      });
      discard.addEventListener("click", () => {
        fs.unlink(legacyConfigPath, (err) => {
          console.log("Failed to delete file:", err);
        });
        message.parentElement.style.display = "none";
      });
    }
  },

  //---------------------------------------------------------------------
  // Extension Dialog Close Code
  //
  // When the dialog is closed, this is called. Use it to save the data.
  //---------------------------------------------------------------------

  close: function (document, writeObject, globalObject) {
    writeObject.secret = secret.value;
    writeObject.id = id.value;
    writeObject.varSelectType = varSelectType.value;
    writeObject.varInput = varInput.value;
    writeObject.varTempVar = varSelectType.value == 3 ? varTempVar.value : "";
    writeObject.websocketUrl = websocketUrl.value;
    writeObject.debugMode = debugMode.value;
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
    const WS_VERSION = "1.2.1";
    const { Bot, Events, Files } = DBM;
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
      console.log(
        `${isErr ? "\u001b[0;31m[BotPanel Error]\u001b[0m" : "[BotPanel]"} (${new Date().toLocaleString()}) - ${message}`,
      );
    };

    // log({ message: "Loaded configuration, waiting for bot to start." });

    Bot.onReady = async function dashboardOnReady(...params) {
      // load config
      let applicationId, applicationSecret, debug, wssURL;
      const config = Files?.data.settings?.["Bot Panel"];

      if (config) {
        const data = config.customData?.["Bot Panel"];
        applicationId = data.id;
        applicationSecret = data.secret;
        variableOptions = {
          option: data.varSelectType,
          input: data.varInput,
          tempVar: data.varTempVar,
        };
        debug = data.debugMode === "1";
        wssURL = data.websocketUrl || "wss://wss.botpanel.xyz";
      } else {
        return log({
          message: "Bot Panel has not been configured.",
          isErr: true,
        });
      }

      const bot = DBM.Bot.bot;
      bot.dashboard = {};
      let allowReconnect = true;
      let reconnectTime = 0;
      let isReconnecting = false;
      let heartbeat;

      const connect = () => {
        isReconnecting = false;
        log({ message: "Attempting to connect to dashboard..." });
        const ws = new WebSocket(wssURL);

        ws.on("open", () => {
          log({ message: "Connected to dashboard." });
          reconnectTime = 0;
          isReconnecting = false;
        });

        ws.on("close", () => {
          clearInterval(heartbeat);
          if (!isReconnecting) {
            log({ message: "Disconnected from dashboard." });
            if (allowReconnect) {
              reconnectTime += 5;
              log({
                message: `Retrying in ${reconnectTime} seconds...`,
                isErr: true,
              });
              isReconnecting = true;
              setTimeout(connect, reconnectTime * 1000);
            }
          }
        });

        ws.on("error", (err) => {
          if (!isReconnecting) {
            log({
              message: `Error connecting to dashboard: ${err}`,
              isErr: true,
            });
            if (allowReconnect) {
              reconnectTime += 5;
              log({
                message: `Retrying in ${reconnectTime} seconds...`,
                isErr: true,
              });
              ws.close();
              isReconnecting = true;
              setTimeout(connect, reconnectTime * 1000);
            }
          }
        });

        ws.on("message", (message) => handleMessage(message, ws));

        bot.dashboard.ws = ws;

        bot.dashboard.ws.sendPacket = ({ op, d }) => {
          if (!Bot.bot.dashboard.ws)
            return log({
              message:
                "Attempted to send packet before connection was established.",
              isErr: true,
            });
          Bot.bot.dashboard.ws.send(JSON.stringify({ op, d }));
          if (debug) log({ message: `TX: ${JSON.stringify({ op, d })}` });
        };
      };

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
              version: WS_VERSION,
            },
          });
        },
        [OPCODES.AUTH_SUCCESS]: ({ data, ws }) => {
          log({
            message: `Successfully authenticated with application "${data.d.name}" (${applicationId})!`,
          });
          clearInterval(heartbeat);
          heartbeat = setInterval(() => {
            bot.dashboard.ws.sendPacket({
              op: OPCODES.HEARTBEAT,
            });
          }, data.d.heartbeatInterval);
        },
        [OPCODES.ERROR]: ({ data }) => {
          if (data.d.error === "Invalid websocket version. UPDATE EXTENSION.")
            allowReconnect = false;
        },
        [OPCODES.GUILD_INTERACTION]: async ({ data, ws }) => {
          const { guildId, interactionId, include } = data.d;

          const guild = await bot.guilds
            .fetch({ guild: guildId, withCounts: false })
            .catch(() => null);

          let serverData = fs.readFileSync(
            join(__dirname, "../", "data", "servers.json"),
            "utf-8",
          );

          try {
            serverData = JSON.parse(serverData);
          } catch (e) {
            return log({
              message: `Error parsing server data: ${e}`,
              isErr: true,
            });
          }

          let roles, channels;
          if (
            include.some((i) =>
              ["textChannels", "voiceChannels", "categories"].includes(i),
            )
          )
            channels = await guild?.channels.fetch().catch(() => null);
          if (include.includes("roles"))
            roles = await guild?.roles.fetch().catch(() => null);

          const textChannels = channels
            ? channels
                .filter((c) => c.type === "GUILD_TEXT")
                .map((c) => {
                  return { id: c.id, name: c.name, position: c.position };
                })
            : [];

          const voiceChannels = channels
            ? channels
                .filter((c) => c.type === "GUILD_VOICE")
                .map((c) => {
                  return { id: c.id, name: c.name, position: c.position };
                })
            : [];

          const categories = channels
            ? channels
                .filter((c) => c.type === "GUILD_CATEGORY")
                .map((c) => {
                  return { id: c.id, name: c.name, position: c.position };
                })
            : [];

          roles = roles
            ? roles.map((r) => {
                return {
                  id: r.id,
                  name: r.name,
                  position: r.position,
                  managed: r.managed,
                };
              })
            : [];

          let variables = null;
          let cache = new DBM.Actions.ActionsCache([], guild);

          if (variableOptions.option && variableOptions.option > 0) {
            switch (variableOptions.option) {
              case "1": // server
                variables = DBM.Actions.getVariable(
                  2,
                  variableOptions.input,
                  cache,
                );
                break;
              case "2": // global
                variables = DBM.Actions.getVariable(
                  3,
                  variableOptions.input,
                  cache,
                );
                break;
              case "3": // command/event
                let actions;
                const allData = DBM.Files.data.commands.concat(
                  DBM.Files.data.events,
                );
                for (let i = 0; i < allData.length; i++) {
                  if (allData[i]?._id === variableOptions.input) {
                    actions = allData[i].actions;
                    break;
                  }
                }
                DBM.Actions.executeSubActions(actions, cache, () => {
                  variables = DBM.Actions.getVariable(
                    1,
                    variableOptions.tempVar,
                    cache,
                  );
                });
                break;
            }
          }

          bot.dashboard.ws.sendPacket({
            op: OPCODES.REQUEST_GUILD_DATA,
            d: {
              interactionId,
              guildName: guild?.name,
              data: serverData[guildId] || {},
              inGuild: !!guild,
              variables: variables ?? null,
              ...(roles && { roles }),
              ...(textChannels && { textChannels }),
              ...(voiceChannels && { voiceChannels }),
              ...(categories && { categories }),
            },
          });
        },
        [OPCODES.MODIFY_GUILD_DATA]: ({ data }) => {
          Events.dbmDashboardDataUpdate(data.d);
        },
      };

      const handleMessage = async (message, ws) => {
        const data = JSON.parse(message);
        if (debug) log({ message: `RX: ${JSON.stringify(data)}` });

        const handler = operationHandlers[data.op];
        if (handler) {
          try {
            await handler({ data, ws, applicationId, applicationSecret });
          } catch (e) {
            log({
              message: `Error handling operation ${data.op}: ${e}`,
              isErr: true,
            });
          }
        }
      };
      onReady.apply(this, ...params);
    };
  },
};
