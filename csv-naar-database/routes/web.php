<?php

use App\Http\Controllers\csvController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::view('import','import');
Route::post('export',[csvController::class,'sendCSV']);
Route::post('add',[csvController::class,'addData']);
