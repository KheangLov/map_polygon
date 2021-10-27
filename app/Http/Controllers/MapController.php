<?php

namespace App\Http\Controllers;

use App\Models\Map;
use Illuminate\Http\Request;

class MapController extends Controller
{
    function save(Request $req)
    {
        Map::insert($req->all());
        return response()->json(['success' => true]);
    }

    function list(Request $req)
    {
        return response()->json(['success' => true, 'data' => Map::paginate(2000)]);
    }
}
