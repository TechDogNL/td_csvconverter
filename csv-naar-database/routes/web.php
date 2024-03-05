<?php

use App\Http\Controllers\CSVController;
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
Route::any('/export',[CSVController::class,'getCSV']);
// Route::post('/postCSV',[CSVController::class,'postCSV']);
