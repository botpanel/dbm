module.exports = {
  name: "Store DBM Dashboard Interaction Info",

  displayName: "Store Dashboard Interaction Info",

  section: "DBM Dashboard",

  subtitle(data, presets) {
    const info = [
      "Interaction ID",
      "Variable Name",
      "Guild ID",
      "New Value",
      "User ID",
      "Input Type",
    ];
    return `${presets.getVariableText(data.sourceInteraction, data.varName)} - ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    let dataType = "Unknown Type";
    switch (info) {
      case 0:
        dataType = "String";
        break;
      case 1:
        dataType = "String";
        break;
      case 2:
        dataType = "String";
        break;
      case 4:
        dataType = "String";
        break;
      case 5:
        dataType = "String";
        break;
    }
    return [data.varName2, dataType];
  },

  meta: { version: "2.1.7", preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

  fields: ["sourceInteraction", "varName", "info", "storage", "varName2"],

  html(isEvent, data) {
    return `
    <retrieve-from-variable dropdownLabel="Source Interaction" selectId="sourceInteraction" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

    <br><br><br>
    
    <div style="padding-top: 8px;">
      <span class="dbminputlabel">Source Info</span><br>
      <select id="info" class="round">
        <option value="0" selected>Interaction ID</option>
        <option value="1">Variable Name</option>
        <option value="2">Guild ID</option>
        <option value="3">New Value</option>
        <option value="4">User ID</option>
        <option value="5">Input Type</option>
      </select>
    </div>
    
    <br>
    
    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];

    const info = parseInt(data.info, 10);
    const varName = this.evalMessage(data.varName, cache);
    const varName2 = this.evalMessage(data.varName2, cache);
    const storage = parseInt(data.storage, 10);

    const interaction = this.getVariable(parseInt(data.sourceInteraction, 10), varName, cache);
    if (!interaction)
      return this.callNextAction(cache);

    switch (info) {
      case 0:
        this.storeValue(interaction.interactionId, storage, varName2, cache);
        break;
      case 1:
        this.storeValue(interaction.varname, storage, varName2, cache);
        break;
      case 2:
        this.storeValue(interaction.guildId, storage, varName2, cache);
        break;
      case 3:
        this.storeValue(interaction.data, storage, varName2, cache);
        break;
      case 4:
        this.storeValue(interaction.userId, storage, varName2, cache);
        break;
      case 5:
        this.storeValue(interaction.inputType, storage, varName2, cache);
        break;
    }

    this.callNextAction(cache);
  },
};
