module.exports = {
  name: "DBM Dashboard Acknowledge Interaction",

  displayName: "Acknowledge Dashboard Interaction",

  section: "DBM Dashboard",

  subtitle(data, presets) {
    return `${presets.getVariableText(data.sourceInteraction, data.varName)}`;
  },

  meta: { version: "2.1.7", preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

  fields: ["sourceInteraction", "varName", "success"],

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
    </div>
    `;
  },

  async action(cache) {
    const data = cache.actions[cache.index];

    const varName = this.evalMessage(data.varName, cache);
    const success = data.success === "true";

    const interaction = this.getVariable(parseInt(data.sourceInteraction, 10), varName, cache);
    if(!interaction )
      return this.callNextAction(cache);

    const bot = this.getDBM().Bot.bot;
    const ws = bot.dashboard.ws;

    await new Promise((resolve) => {
      ws.send(JSON.stringify({
        op: 7,
        d: {
          interactionId: interaction.interactionId,
          success,
          key: interaction.varname,
          value: interaction.data
        }
      }), resolve);
    })

    this.callNextAction(cache);
  },
};
