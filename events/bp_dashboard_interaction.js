module.exports = {
  name: "Bot Panel Dashboard Data Changed",
  isEvent: true,

  fields: ["Interaction (Temporary Variable Name)"],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    DBM.Events.dbmDashboardDataUpdate = function dbmDashboardDataUpdate(data) {
      if (!Bot.$evts["Bot Panel Dashboard Data Changed"] && !Bot.$evts["DBM Dashboard Data Changed"]) return;

      for (const event of [...Bot.$evts["Bot Panel Dashboard Data Changed"], ...Bot.$evts["DBM Dashboard Data Changed"]]) {
        const temp = {};
        if(event.temp) temp[event.temp] = data;

        Actions.invokeEvent(event, null, temp);
      }
    }
  },
};
