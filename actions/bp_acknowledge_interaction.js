module.exports = {
  name: "DBM Dashboard Acknowledge Interaction",

  displayName: "Acknowledge Dashboard Interaction",

  section: "Bot Panel",

  subtitle(data, presets) {
    return `${presets.getVariableText(data.sourceInteraction, data.varName)}`;
  },

  meta: { version: "2.1.7", preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

  fields: ["sourceInteraction", "varName", "success", "message"],

  html(isEvent, data) {
    return `
    <retrieve-from-variable dropdownLabel="Source Interaction" selectId="sourceInteraction" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
    <br><br><br>
    <div style="padding-top: 8px;">
      <span class="dbminputlabel">Success</span><br>
      <select id="success" class="round">
        <option value="true" selected>True</option>
        <option value="false">False</option>
      </select>
      <br>
      <span class="dbminputlabel">Message</span>
      <input id="message" class="round" type="text">
    </div>
    `;
  },

  async action(cache) {
    const data = cache.actions[cache.index];

    const varName = this.evalMessage(data.varName, cache);
    const success = data.success === "true";
    const message = data.message;

    const interaction = this.getVariable(parseInt(data.sourceInteraction, 10), varName, cache);
    if(!interaction )
      return this.callNextAction(cache);

    const bot = this.getDBM().Bot.bot;
    const ws = bot.dashboard.ws;

    ws.sendPacket({
        op: 7,
        d: {
          interactionId: interaction.interactionId,
          success,
          message,
          key: interaction.varname,
          value: interaction.data
        }
    });

    this.callNextAction(cache);
  },
};
