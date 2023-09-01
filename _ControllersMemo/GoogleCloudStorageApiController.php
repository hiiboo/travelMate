<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Google\Cloud\Storage\StorageClient;

class GoogleCloudStorageApiController extends Controller
{
    public function uploadImage(Request $request)
    {
        // ファイルのバリデーションなどを行う場合はここで行う

        $config = [
            'keyFilePath' => config('filesystems.disks.gcs.key_file'),
            'scopes' => ['https://www.googleapis.com/auth/devstorage.read_write'],
        ];
        $storage = new StorageClient($config);

        // バケットを指定してファイルをアップロード
        $bucketName = config('filesystems.disks.gcs.bucket');
        $bucket = $storage->bucket($bucketName);

        $objectName = 'images/' . basename($request->file('image')->getClientOriginalName());
        $options = [
            'name' => $objectName,
            'predefinedAcl' => 'publicRead',
        ];
        $bucket->upload(
            fopen($request->file('image')->getPathname(), 'r'),
            $options
        );

        // アップロードされたファイルの URL を構築
        $url = "https://storage.googleapis.com/{$bucketName}/{$objectName}";

        return response()->json([
            'url' => $url,
        ]);
    }
    public function getUrlImage($event_id)
    {
        try {
            $event = Event::find($event_id);
            if (!$event) {
                return response()->json(['message' => 'Event not found'], 404);
            }

            $imageUrl = $event->image_url;  // image_urlは、Eventモデル内の適切なカラム名に置き換えてください

            return response()->json(['url' => $imageUrl]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching event image URL'], 500);
        }
    }
}
