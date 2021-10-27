<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::view('form','mapview');
Route::post('submit', [App\Http\Controllers\MapController::class, 'save']);
Route::view('getform','getmapview');
Route::view('draw','draw_polygon');
Route::get('review', [App\Http\Controllers\MapController::class, 'list']);
