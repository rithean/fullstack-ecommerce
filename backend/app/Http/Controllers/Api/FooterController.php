<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Footer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FooterController extends Controller
{
    /**
     * Display the first footer.
     */
    public function index()
    {
        $footer = Footer::first();

        if (!$footer) {
            return response()->json([
                'status' => false,
                'message' => 'Footer not found.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $footer
        ], 200);
    }

    /**
     * Store a newly created footer.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
            'description' => 'required|string',
            'email' => 'required|email',
            'quick_links' => 'required|array',
            'social_links' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'description',
            'email',
            'quick_links',
            'social_links' // Fixed typo here
        ]);

        if ($request->hasFile('logo')) {
            $filename = time() . '_' . $request->file('logo')->getClientOriginalName();
            $path = $request->file('logo')->storeAs('uploads/footers', $filename, 'public');
            $data['logo'] = '/storage/' . $path;
        }

        Footer::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Footer created successfully.'
        ]);
    }

    /**
     * Show a specific footer by ID.
     */
    public function show(string $id)
    {
        $footer = Footer::find($id);

        if (!$footer) {
            return response()->json([
                'status' => false,
                'message' => 'Footer not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $footer
        ]);
    }

    /**
     * Update a specific footer.
     */
    public function update(Request $request, string $id)
    {
        $footer = Footer::find($id);

        if (!$footer) {
            return response()->json([
                'status' => false,
                'message' => 'Footer not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
            'description' => 'sometimes|required|string',
            'email' => 'sometimes|required|email',
            'quick_links' => 'sometimes|required|array',
            'social_links' => 'sometimes|required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'description',
            'email',
            'quick_links',
            'social_links'
        ]);

        if ($request->hasFile('logo')) {
            if ($footer->logo) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $footer->logo));
            }

            $file = $request->file('logo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads/footers', $filename, 'public');
            $data['logo'] = '/storage/' . $path;
        }

        $footer->update($data);

        return response()->json([
            'status' => true, // Fixed typo
            'message' => 'Footer updated successfully.',
        ], 200);
    }

    /**
     * Delete a specific footer.
     */
    public function destroy(string $id)
    {
        $footer = Footer::find($id);

        if (!$footer) {
            return response()->json([
                'status' => false,
                'message' => 'Footer not found.'
            ], 404);
        }

        if ($footer->logo) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $footer->logo));
        }

        $footer->delete();

        return response()->json([
            'status' => true,
            'message' => 'Footer deleted successfully.'
        ], 200);
    }
}
