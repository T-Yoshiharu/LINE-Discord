function sendDiscordMessage(name, message, json) {
  // ウェブフック
  var webhookURL = json.Discord_hook;
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
