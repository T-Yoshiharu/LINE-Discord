// APIのキーやURLをJSONファイルから読み込む
const file = DriveApp.getFileById("1DeWtJjEuEhN-_PMQKO3YopuqfNOhNF-s");
const jsonStr = file.getBlob().getDataAsString("UTF-8");
const IDjson = JSON.parse(jsonStr);

// LINEのアクセストークン
const channel_access_token = IDjson.LINE_m_api;
const myID = IDjson.MyIDs.MyLINE_ID;
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
  var userID = e.source.userId; //ユーザID
  var groupid_tmp = e.source.groupId; //グループID
  let messageID = e.message.id; //メッセージID

  let groupName;

  // グループIDからグループ名の指定
  switch (e.source.type) {
    case "user":
      if (userID in IDjson.LINE) {
        groupName = IDjson.LINE[userID];
      } else {
        var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userID, requestHeader);
        var gName = JSON.parse(response.getContentText()).displayName;
        sendDiscordMessage("ユーザ名: " + gName, "ユーザID: " + userID, IDjson, "IDs"); //ユーザ名とIDを通知
      }
      break;
    case "group":
      if (groupid_tmp in IDjson.LINE) {
        groupName = IDjson.LINE[groupid_tmp];
      } else {
        // リストに登録が無い場合のデフォルト動作
        groupName = "Unknown";

        var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/group/" + groupid_tmp + "/summary", requestHeader);
        let gName = JSON.parse(response.getContentText()).groupName;
        sendDiscordMessage("グループ名: " + gName, "グループID: " + groupid_tmp, IDjson, "IDs"); //グループ名とIDを通知
      }
      break;
  }
  // 後で関数化してコードをきれいにする!!

  // LINEにユーザープロフィールリクエストを送信(返り値はJSON形式)
  try {
    // グループの場合
    var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/group/" + groupid_tmp + "/member/" + userID, requestHeader); //Erroe原因
  } catch (e) {
    // 個人チャットの場合
    var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userID, requestHeader);
  }

  var message = e.message.text;
  // メッセージ形式によってmessageの内容を作成
  switch (e.message.type) {
    case 'text': //テキストメッセージ
      message = e.message.text;
      break;

    case 'image': //画像メッセージ
      // 画像バイナリデータを取得
      const image = UrlFetchApp.fetch('https://api-data.line.me/v2/bot/message/' + messageID + '/content', requestHeader);
      const gyazo = JSON.parse(gyazoup(image.getBlob(), IDjson));
      message = gyazo.url;
      break;

    default:
      break;
  }

  // 自分がメンションされているかの判定
  let mentioned = false
  var mention_list = e.message.mention.mentionees;
  if (mention_list != undefined) {
    let me = mention_list.find(m => m.userId == myID)
    if (me != undefined) {
      mentioned = true;
    }
  }

  // レスポンスからユーザーのディスプレイネームを抽出
  var name = JSON.parse(response.getContentText()).displayName;
  // 自分のメッセージだけ表示を変える
  if (userID == myID) {
    name = "### " + name;
  }
  sendDiscordMessage(name, message, IDjson, groupName, mentioned);
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
