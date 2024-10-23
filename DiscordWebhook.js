function sendDiscordMessage(name, message, json, groupN) {
  // ウェブフック
  var webhookURL = json.Discord[groupN];

  // Discord webhookに投げるメッセージの内容
  var options = {
    "content": name + " ; " + message
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
