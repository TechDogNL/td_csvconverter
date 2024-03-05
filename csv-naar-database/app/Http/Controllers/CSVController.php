<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CSV;

class CSVController extends Controller
{
    function getCSV(Request $req)
    {
          // return $req->file('file')->store('csv');
          $file = $req->file('file');

          // Read the CSV file and store its contents in an array, using semicolon as the delimiter
          // $contents = array_map(function($line) {
          //     return explode(';', $line);
          $contents = array_map(function($line) {
              return str_getcsv($line, ';');
  
          }, file($file));
          // Pass the data to the view
          return view('export', ['contents' => $contents]);
    }
    function postCSV(Request $req)
    {
        $csv = new csv;
        $csv->name=$req->name;
        $result =$csv->save();
        if($result)
        {
            return ["Result"=>"data has been send"];
        }
        else
        {
            return ["Result"=>"data as failed to send"];
        }
        
    }
}
