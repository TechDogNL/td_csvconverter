<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ImportController extends Controller
{
    function index(Request $req)
    {
        // return $req->file('file')->store('csv');
        $file = $req->file('file');

        // Read the CSV file and store its contents in an array, using semicolon as the delimiter
        $contents = array_map(function($line) {
            return explode(';', $line);
        }, file($file));
        // Pass the data to the view
        return view('export', ['contents' => $contents]);
    }
}
