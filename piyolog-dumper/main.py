import subprocess
import time

ADB_PATH = "/usr/local/bin/adb"

def tap(x, y):
    subprocess.call([ADB_PATH, "shell", "input", "tap", str(x), str(y)])


if __name__ == "__main__":

    # ぴよログ終了（起動してたらkill）
    subprocess.call([ADB_PATH, "shell", "am", "force-stop", "jp.co.sakabou.piyolog"])

    # ぴよログを起動
    subprocess.call([ADB_PATH, "shell", "am", "start", "-n", "jp.co.sakabou.piyolog/.InitialActivity"])
    time.sleep(15)

    # メニュー画面を開く
    tap(634, 1158)
    time.sleep(2)

    # エクスポート画面を開く
    tap(455, 920)
    time.sleep(2)

    # エクスポート詳細画面を開く
    tap(506.2, 756.4)
    time.sleep(2)

    # エクスポートを実行する
    tap(397.3, 898.2)
    time.sleep(2)

    # エクスポートを実行する（GDrive）
    tap(616, 114.9)
    time.sleep(2)

    # ぴよログ終了
    subprocess.call([ADB_PATH, "shell", "am", "force-stop", "jp.co.sakabou.piyolog"])

    print("export完了しました")
