function sendDiscordMessage(name, message) {
  // ウェブフック
  var webhookURL = "https://discord.com/api/webhooks/1292369311469408328/SH1tSGYxtcRFs_QzLP8JWbSQ8-7Ofm9FgqlRtyl1ehpmGfa1xHfRZ-fs0FdmB8D7S9GP";
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
