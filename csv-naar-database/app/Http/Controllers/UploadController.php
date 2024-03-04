<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    function index(Request $req)
    {
        return $req->file('file')->store('csv:'); 
        //in store(hier de output laten zien van het bestand dus de tabel)
    }
}
