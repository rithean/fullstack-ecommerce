<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slideshow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SlideshowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $slideshow = Slideshow::orderBy('id', 'ASC')->get();

        if ($slideshow->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Slideshow is empty'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $slideshow
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'status' => 'nullable|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'title',
            'subtitle',
            'description',
            'status'
        ]);

        if ($request->hasFile('image')) {
            $filename = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('uploads/slideshows', $filename, 'public');
            $data['image'] = '/storage/' . $path;
        }

        Slideshow::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Slideshow created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $slideshow = Slideshow::find($id);

        if (!$slideshow) {
            return response()->json([
                'status' => false,
                'message' => 'Slideshow not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $slideshow
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $slideshow = Slideshow::find($id);

        if (!$slideshow) {
            return response()->json([
                'status' => false,
                'message' => 'slideshow not found'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'subtitle' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'status' => 'nullable|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'title',
            'subtitle',
            'description',
            'status',
        ]);

        if ($request->hasFile('image')) {
            if ($slideshow->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $slideshow->image));
            }

            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path =  $file->storeAs('uploads/slideshows', $filename, 'public');
            $data['image'] = '/storage/' . $path;
        }

        $slideshow->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Slideshow updated successfully'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $slideshow = Slideshow::find($id);

        if (!$slideshow) {
            return response()->json([
                'status' => false,
                'message' => 'Slideshow not found'
            ], 404);
        }

        if ($slideshow->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $slideshow->image));
        }

        $slideshow->delete();

        return response()->json([
            'status' => true,
            'message' => 'Slideshow deleted successfully'
        ]);
    }
}
