<!-- 下準備として以下の準備を行います

.envに「GOOGLE_MAPS_API_KEY=あなたのAPIキー」と記述
コマンドで「php artisan make:controller GoogleMapApiController」を実行 -->

<!-- 以下の仮定を行います:

イベントの情報はeventsテーブルに保存されています。
このテーブルにはlocation, address, およびplace_idというカラムが存在します。 -->

<!-- api.phpには以下の設定を行います：

Route::get('/get-event-location/{id}', 'GoogleMapApiController@getEventLocation');
Route::patch('/update-event-location/{id}', 'GoogleMapApiController@updateEventLocation');
Route::post('/google-maps/search-location', 'GoogleMapApiController@searchLocation');
Route::get('/get-embed-map-url/{id}', 'GoogleMapApiController@getEmbedMapUrl'); -->


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use App\Models\Event;  // Eventモデルを使用するため

class GoogleMapApiController extends Controller
{
    private $googleMapsApiKey;

    public function __construct()
    {
        $this->googleMapsApiKey = env('GOOGLE_MAPS_API_KEY');
    }

    public function searchLocation(Request $request)
    {
        $query = $request->input('query');

        $client = new Client();
        $response = $client->get("https://maps.googleapis.com/maps/api/place/textsearch/json", [
            'query' => [
                'query' => $query,
                'key' => $this->googleMapsApiKey,
            ],
        ]);

        $results = json_decode($response->getBody(), true);

        if (isset($results['results'][0])) {
            return response()->json($results['results'][0]);
        } else {
            return response()->json([]);
        }
    }

    public function getEventLocation($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        return response()->json([
            'location' => $event->location,
            'address' => $event->address,
            'place_id' => $event->place_id,
        ]);
    }

    public function updateEventLocation(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        $event->location = $request->input('location');
        $event->address = $request->input('address');
        $event->place_id = $request->input('place_id');
        $event->save();

        return response()->json(['message' => 'Location updated successfully']);
    }

    public function getEmbedMapUrl($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        $embedUrl = "https://www.google.com/maps/embed/v1/place?key={$this->googleMapsApiKey}&q={$event->location},{$event->address}";

        return response()->json(['embedUrl' => $embedUrl]);
    }

}
