//バイナリデータの画像をgyazoに送信し、urlを取得
function gyazoup(image, idjson) {
    const options = {
        "method": "post",
        "payload": {
            "access_token": idjson.Gyazo_token, //gyazoのアクセストークン
            "imagedata": image
        }
    };

    return UrlFetchApp.fetch("https://upload.gyazo.com/api/upload", options);
}
