<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\Temp;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CsvController extends Controller
{
    function sendcsv(Request $req)
    {
        // $Data = $req->input('csvData');
        // $temp = new Temp;
        // $temp->data = $Data;
        // $result = $temp->save();

        $Data ="test";
        $result =$Data;

        if ($result) {
            return ['result' => 'Data has been saved',$Data];
        } else {
            return ['result' => "Something went wrong",$Data];
        }
      
        // $getData = $req->input('csvData');
        //controllers houden niet de data tussen de request, als je een nieuwe request maakt dan begint het helemaal leeg
        //misschien cache gebruiken om data lokaal op te slaan
        // return $getData;
        // return response()->json(['message' => 'CSV data received successfully',$getData], 200);
    }

    function getcsv()
    {
        // return "hello".Temp::all();
    //    $result = DB::select('select * from temp');
    //     return $result;
    return  Product::all();
    Log::info("error");

    }

    function storeSession(Request $req)
    {
        $sesData = $req->input('csvData');
        Session::put('csv data', $sesData);
        Log::info('CSV data received:', ['csvData' => $sesData]);

        return response()->json(['message' => 'CSV data stored in session successfully'], 200);

    }
}
