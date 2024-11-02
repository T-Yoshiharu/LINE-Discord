function sendDiscordMessage(name, message, json, groupN) {
  // ウェブフック
  var webhookURL = json.Discord[groupN];

  // Discord webhookに投げるメッセージの内容
  // 自分の個人メンションがある場合はメンションを付ける
  if (message.includes("@Haru")) {
    var options = {
      "content": `<@${json.MyIDs.MyDiscord_ID}>\n` + name + " ; " + message
    };
  } else {
    var options = {
      "content": name + " ; " + message
    };
  };

  // データを作って投げる
  var response = UrlFetchApp.fetch(
    webhookURL,
    {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(options),
      muteHttpExceptions: true,
    }
  );
  // こちらはステータスコードを返す必要はない
}
