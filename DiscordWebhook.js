const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
const discordProxyDomain = SCRIPT_PROPERTIES.getProperty("DISCORD-PROXY-DOMAIN")

function sendDiscordMessage(name, message, json, groupN, mention) {
  // ウェブフック
  var webhookURL = json.Discord[groupN];

  // Discord webhookに投げるメッセージの内容
  // 自分の個人メンションがある場合はメンションを付ける
  if (mention) {
    var options = {
      "content": `<@${json.MyIDs.MyDiscord_ID}>\n` + `${name} ; \n${message}\n---`
    };
  } else {
    var options = {
      "content": `${name} ;\n${message}\n---`
    };
  };

  // DiscordのWebhookURLをプロキシのURLに変換
  const proxiedWebhookUrl = webhookURL.replace(
    'discord.com',
    discordProxyDomain
  );

  // データを作って投げる
  var response = UrlFetchApp.fetch(
    proxiedWebhookUrl,
    {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(options),
      muteHttpExceptions: true,
    }
  );
  // こちらはステータスコードを返す必要はない
}
