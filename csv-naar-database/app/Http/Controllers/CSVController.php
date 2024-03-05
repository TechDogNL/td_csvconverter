<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CSV;

class csvController extends Controller
{
    function sendCSV(Request $req)
    {
       
        $file = $req->file('file');

        $contents = array_map(function($line) {
            return str_getcsv($line, ';');

        }, file($file));

      
        return view('export', ['contents' => $contents]);
        
    }
    function addData(Request $req)
    {
        $names = $req->input('name');

        foreach ($names as $name) {
            $csv = new csv;
            $csv->name = $name;
            $csv->save();
        }
        // $csv = new csv;
        // $csv->name=$req->name;
        // $csv->save();
       
    }
}
