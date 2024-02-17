# Bot Panel w/ Discord Bot Maker Integration Guide
This is the setup guide for using [Bot Panel](https://botpanel.xyz) with [Discord Bot Maker](https://store.steampowered.com/app/682130/Discord_Bot_Maker/).

# Installation

1. Have DBM installed and a bot project open.
2. Visit the [Bot Panel Developer Dashboard](https://dev.botpanel.xyz).
3. Log in to the developer dashboard.
4. Navigate to the `Manage Applications` page and click `Add Application`.
   <br><br>
   ![Image](https://github.com/dbm-dashboard/dbm/blob/50804e145d2b6f663523fa12399537dca0b600c6/.github/botpanel_dbm_step1.png?raw=true)
6. Complete all fields.
7. Download the files from the [/actions](https://github.com/dbm-dashboard/dbm/tree/main/actions) directory and place them in your project's `actions` folder.
8. Download the files from the [/events](https://github.com/dbm-dashboard/dbm/tree/main/events) directory and place them in your project's `events` folder.
9. Download the extension from the [/extension](https://github.com/dbm-dashboard/dbm/tree/main/events) directory and place it in your project's `extensions` folder.
10. Make sure you have restarted DBM after downloading and installing these mods.
11. From the developer dashboard, take note of your application id and application secret. Do not share your secret with others.
12. In your DBM project, in the application navigation menu click the `Extensions` dropdown, and select `DBM Dashboard`.
13. Copy and paste your application id and secret into the field, and hit `Save`.
14. From this point to see if everything is configured properly, restart your bot and open your console. You should see the message `[DBM Dashboard] Successfully authenticated with application "APPLICATION_NAME" (APPLICATION_ID)!`
15. Set up data receive event (Read below)

# Receiving Data

When a user modifies data on their dashboard, an interaction is sent from our server to your bot, much alike how discord interactions work. This interaction stores data such as the variable name, data, etc. **You must acknowledge every request for it to be marked as successful on your user's dashboard.** To do this create an event on your bot using the `DBM Dashboard Data Changed` event. This event has one temporary variable input, which is the `Interaction Object`, and is fired every time a user submits a data change request from their dashboard. When you receive this request, you can use the `Store Dashboard Interaction Info` action to store all necessary data and make changes to your bot's backend storage. Once all data changes have been made, make sure to acknowledge the interaction using the `Acknowledge Dashboard Interaction` action.

An example rawdata doing all of the above using DBM's built in server data database can be found [here](https://rawdata.dbm-network.org/raw-data/1535).
