<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CsvController extends Controller
{
    public function createImport(): Response
    {
        return Inertia::render('Auth/Importcsv');
    }
    public function createExport()
    {
        return Inertia::render('Auth/Exportcsv');   
    }
    public function getscv(Request $req)
    {

    }
}
