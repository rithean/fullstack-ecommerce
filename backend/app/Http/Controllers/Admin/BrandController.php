<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::orderBy('created_at', 'DESC')->get();

        if ($brands->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Brand is empty'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $brands
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'status' => 'nullable|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validator->errors()
            ], 422);
        }

        Brand::create([
            'name' => $request->name,
            'status' => $request->status ?? 1
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Brand created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'status' => false,
                'message' => 'Brand not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $brand
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'status' => false,
                'message' => 'Brand not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'status' => 'nullable|integer|in:0,1'
        ]);

        $brand->update([
            'name' => $request->name,
            'status' => $request->status
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Brand updated successfully'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'status' => false,
                'message' => 'Brand not found'
            ], 404);
        }

        $brand->delete();

        return response()->json([
            'status' => true,
            'message' => 'Brand deleted successfully'
        ], 200);
    }
}
