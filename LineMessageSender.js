// LINEのアクセストークン
var channel_access_token = "I4gUXun1AD+GhXnGVYb7dkGVTzSoOivlW8OvzM30QbBdotjPHDWPF1GTuv5o4/PMaMmHTc4wBGVCGypPH4ROuZxEf33glVoCZkODhrsqFhgZELIhznBwBJ9nuqGr0poSGUeMCbILlHhwufI/o+rdJQdB04t89/1O/w1cDnyilFU="
// 
var group_ID = "グループID(後で設定します)";

function doPost(e) {
  //ここで場合分けする(GlitchからもDiscordのメッセをPostするので)
  var events = JSON.parse(e.postData.contents).events;
  events.forEach(function (event) {
    if (event.type == "message") {
      sendToDiscord(event); // D-bot
    } else if (event.type == "follow") {
      follow(event);
    } else if (event.type == "unfollow") {
      unFollow(event);
    } else if (event.type == "discord") {
      sendToLine(event); // L-bot
    }
  });
}

// D-bot
function sendToDiscord(e) {
  // LINEからユーザ名を取得するためのリクエストヘッダー
  var requestHeader = {
    "headers": {
      "Authorization": "Bearer " + channel_access_token
    }
  };
  var userID = e.source.userId;
  var groupid_tmp = e.source.groupId;

  // LINEにユーザープロフィールリクエストを送信(返り値はJSON形式)
  try {
    // グループの場合
    var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/group/" + groupid_tmp + "/member/" + userID, requestHeader); //Erroe原因
  } catch (e) {
    // 個人チャットの場合

    var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userID, requestHeader);
  }

  var message = e.message.text;
  // レスポンスからユーザーのディスプレイネームを抽出
  var name = JSON.parse(response.getContentText()).displayName;
  // 自分のメッセージだけ表示を変える
  if (userID == "Ubd780605663d70bcf6555e5dfc9573ef") {
    name = "### " + name;
  }
  sendDiscordMessage(name, message);
  // LINEにステータスコード200を返す(これがないと動かない)
  return response.getResponseCode();
}

// L-bot
function sendToLine(e) {
  // メッセージの内容(送信先と内容)
  var message = {
    "to": group_ID,
    "messages": [
      {
        "type": "text",
        "text": e.name + "「" + e.message + "」"
      }
    ]
  };
  // LINEにpostするメッセージデータ
  var replyData = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + channel_access_token
    },
    "payload": JSON.stringify(message)
  };
  // LINEにデータを投げる
  var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", replyData);
  // LINEにステータスコード200を返す
  return response.getResponseCode();
}

/* フォローされた時の処理 */
function follow(e) {
  // 今のところ空白だけど自由に実装してみると楽しい。
  // よくある「友だち追加ありがとうございます」はここで実装する。
  // 不特定多数にフォローされるような運用はしないのでスルー。
}

/* アンフォローされた時の処理 */
function unFollow(e) {
  // ここでは普通こちらからもフォローを切る処理を入れる。
  // ここも不特定多数にフォローされるような運用はしないのでスルー。
}
