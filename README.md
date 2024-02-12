# Bot Panel w/ Discord Bot Maker Integration Guide
This is the setup guide for using [Bot Panel](https://botpanel.xyz) with [Discord Bot Maker](https://store.steampowered.com/app/682130/Discord_Bot_Maker/).

# Instillation

1. Have DBM installed and a bot project open.
2. Visit the [Bot Panel Developer Dashboard](https://dev.botpanel.xyz).
3. Log in to the developer dashboard.
4. Navigate to the `Manage Applications` page and click `Add Application`.
   <br><br>
   ![Image](https://github.com/dbm-dashboard/dbm/blob/50804e145d2b6f663523fa12399537dca0b600c6/.github/botpanel_dbm_step1.png?raw=true)
6. Complete all fields.
7. Downlaod the files from the [/actions](https://github.com/dbm-dashboard/dbm/tree/main/actions) directory and place them in your project's `actions` folder.
8. Download the files from the [/events](https://github.com/dbm-dashboard/dbm/tree/main/events) directory and place them in your project's `events` folder.
9. Download the extension from the [/extension](https://github.com/dbm-dashboard/dbm/tree/main/events) directory and place it in your project's `extensions` folder.
10. From the developer dashboard, take note of your application id and application secret. Do not share your secret with others.
11. In your DBM project, in the application navigation menu click the `Extensions` dropdown, and select `DBM Dashboard`.
12. Copy and paste your application id and secret into the field, and hit `Save`.
13. From this point to see if everything is configured properly, restart your bot and open your console. You should see the message `[DBM Dashboard] Successfully authenticated with application "APPLICATION_NAME" (APPLICATION_ID)!`
