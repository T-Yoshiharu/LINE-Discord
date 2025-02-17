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
