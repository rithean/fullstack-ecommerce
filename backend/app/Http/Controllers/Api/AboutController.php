<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;

class AboutController extends Controller
{
    public function index()
    {
        $aboutUs = About::first();

        return response()->json([
            'status' => true,
            'message' => 'About Us data fetched successfully',
            'data' => $aboutUs,
        ]);
    }
}
