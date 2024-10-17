//lineから送信された画像をバイナリデータで取得
function getImage(url) {
    return UrlFetchApp.fetch(url, {
        "method": "get",
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + TOKEN
        }
    });
}

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