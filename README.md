# Bot Panel w/ Discord Bot Maker Integration Guide
This is the setup guide for using [Bot Panel](https://botpanel.xyz) with [Discord Bot Maker](https://store.steampowered.com/app/682130/Discord_Bot_Maker/).

# Installation

1. Have DBM installed and a bot project open.
2. Visit the [Bot Panel Developer Dashboard](https://dev.botpanel.xyz).
3. Log in to the developer dashboard.
4. Navigate to the `Manage Applications` page and click `Add Application`.
   <br><br>
   ![Image](https://github.com/botpanel/dbm/blob/50804e145d2b6f663523fa12399537dca0b600c6/.github/botpanel_dbm_step1.png?raw=true)
6. Complete all fields.
7. Download the files from the [/actions](https://github.com/botpanel/dbm/tree/main/actions) directory and place them in your project's `actions` folder.
8. Download the files from the [/events](https://github.com/botpanel/dbm/tree/main/events) directory and place them in your project's `events` folder.
9. Download the extension from the [/extension](https://github.com/botpanel/dbm/tree/main/extension) directory and place it in your project's `extensions` folder.
10. Make sure you have restarted DBM after downloading and installing these mods.
11. From the developer dashboard, take note of your application id and application secret. Do not share your secret with others.
12. In your DBM project, in the application navigation menu click the `Extensions` dropdown, and select `DBM Dashboard`.
13. Copy and paste your application id and secret into the field, and hit `Save`.
14. From this point to see if everything is configured properly, restart your bot and open your console. You should see the message `[DBM Dashboard] Successfully authenticated with application "APPLICATION_NAME" (APPLICATION_ID)!`
15. Set up data receive event (Read below)

# Receiving Data

When a user modifies data on their dashboard, an interaction is sent from our server to your bot, much alike how discord interactions work. This interaction stores data such as the variable name, data, etc. **You must acknowledge every request for it to be marked as successful on your user's dashboard.** To do this create an event on your bot using the `DBM Dashboard Data Changed` event. This event has one temporary variable input, which is the `Interaction Object`, and is fired every time a user submits a data change request from their dashboard. When you receive this request, you can use the `Store Dashboard Interaction Info` action to store all necessary data and make changes to your bot's backend storage. Once all data changes have been made, make sure to acknowledge the interaction using the `Acknowledge Dashboard Interaction` action.

An example rawdata doing all of the above using DBM's built in server data database can be found [here](https://rawdata.dbm-network.org/raw-data/1535).

# Editing Your User Dashboard

Your user dashboard is what your bot users will see when they access their client dashboard. To manage your user dashboard, in your dev panel, select your application, and on the left navbar, select `Edit User Dashboard`. The user dashboard is built of components, which can be thought of as building blocks for your user dashboard. There are two types of components: a `Header Component` and an `Input Component`. The header component is meant for splitting the dashboard into different sections, and the input component is for retrieving data from the user. For input components, there is data validation. We try our best to validate data on both our frontend and backend before sending the updated data to your bot; however, it is still best practice to verify it yourself before updating it on your side.

When you're done editing your components, such as adding or rearranging them by dragging and dropping, make sure to save them by clicking the `Save` button that appears after changes are made. There are two options for saving components: `Publish Changes` and `Save Changes`. When you click `Save Changes`, the changes will be saved the next time you visit your dashboard editor, but not displayed to users. You, as the application owner, can view these changes on the client dashboard by clicking the `Switch to Developer View` button. This is useful if you want to test dashboard features before deploying them to all of your users. The other button, `Publish Changes`, will publish whatever saved version you have of your dashboard to all of your users.

# Application Verification

Verifiying your application is a vital step in completing your dashboard, made to establish user trust. Read more on this in the `Verification Status` tab on your application's navbar.

# Sharing your dashboard with your users

Sharing your dashboard with your users is as easy as sending them the link to your dashboard. After visiting it only once, it will forever be shown in their `Recent` section in the client dashboard.
