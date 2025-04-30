<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Logo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LogoController extends Controller
{
    /**
     * Get the current logo (only one allowed).
     */
    public function index()
    {
        $logo = Logo::orderBy('id', 'ASC')->get();

        if (!$logo) {
            return response()->json([
                'status' => false,
                'message' => 'Logo is empty'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $logo
        ], 200);
    }

    /**
     * Store a new logo and replace the old one if it exists.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $existingLogo = Logo::first();
        if ($existingLogo) {
            $oldPath = str_replace('/storage/', '', $existingLogo->image);
            Storage::disk('public')->delete($oldPath);
            $existingLogo->delete();
        }

        $filename = time() . '_' . $request->file('image')->getClientOriginalName();
        $path = $request->file('image')->storeAs('uploads/logos', $filename, 'public');

        Logo::create([
            'image' => '/storage/' . $path
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Logo uploaded successfully.',
        ], 201);
    }

    /**
     * Show a specific logo by ID.
     */
    public function show(string $id)
    {
        $logo = Logo::find($id);

        if (!$logo) {
            return response()->json([
                'status' => false,
                'message' => 'Logo not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $logo
        ], 200);
    }

    /**
     * Update an existing logo by ID (replace image).
     */
    public function update(Request $request, string $id)
    {
        $logo = Logo::find($id);

        if (!$logo) {
            return response()->json([
                'status' => false,
                'message' => 'Logo not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $oldPath = str_replace('/storage/', '', $logo->image);
        Storage::disk('public')->delete($oldPath);

        $filename = time() . '_' . $request->file('image')->getClientOriginalName();
        $path = $request->file('image')->storeAs('uploads/logos', $filename, 'public');

        $logo->update([
            'image' => '/storage/' . $path
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Logo updated successfully.',
        ]);
    }

    /**
     * Delete logo by ID and remove image file.
     */
    public function destroy(string $id)
    {
        $logo = Logo::find($id);

        if (!$logo) {
            return response()->json([
                'status' => false,
                'message' => 'Logo not found'
            ], 404);
        }

        $oldPath = str_replace('/storage/', '', $logo->image);
        Storage::disk('public')->delete($oldPath);

        $logo->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logo deleted successfully.'
        ]);
    }
}
