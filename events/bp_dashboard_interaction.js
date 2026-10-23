module.exports = {
  name: "Bot Panel Dashboard Data Changed",
  isEvent: true,

  fields: ["Interaction (Temporary Variable Name)"],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    DBM.Events.dbmDashboardDataUpdate = function dbmDashboardDataUpdate(data) {
      const dashboardEvents =
        Bot.$evts?.["Bot Panel Dashboard Data Changed"] || [];
      const legacyEvents = Bot.$evts?.["DBM Dashboard Data Changed"] || [];

      for (const event of [...dashboardEvents, ...legacyEvents]) {
        const temp = {};
        if (event.temp) temp[event.temp] = data;

        Actions.invokeEvent(event, null, temp);
      }
    };
  },
};
