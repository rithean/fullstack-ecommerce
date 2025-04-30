<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::orderBy('id', 'ASC')->get();

        if ($collections->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Collections are empty'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $collections
        ], 200);
    }

    public function featuredCollections()
    {
        $collections = Collection::orderBy('id', 'ASC')->limit(4)->get();

        return response()->json([
            'status' => true,
            'data' => $collections
        ]);
    }

    public function bestCollections()
    {
        $collections = Collection::where('is_best', 1)
            ->orderBy('id', 'ASC')
            ->limit(2)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $collections
        ]);
    }

    public function discountCollections()
    {
        $collections = Collection::orderBy('id', 'ASC')
            ->where('is_discount', 1)
            ->limit(1)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $collections
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:16384',
            'is_best' => 'nullable|integer|in:0,1',
            'is_discount' => 'nullable|integer|in:0,1',
            'status' => 'nullable|integer|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'description', 'is_best', 'is_discount', 'status']);

        if ($request->hasFile('image')) {
            $filename = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('uploads/collections', $filename, 'public');
            $data['image'] = '/storage/' . $path;
        }

        Collection::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Collection created successfully'
        ], 201);
    }

    public function show($id)
    {
        $collection = Collection::find($id);

        if (!$collection) {
            return response()->json([
                'status' => false,
                'message' => 'Collection not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $collection
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::find($id);

        if (!$collection) {
            return response()->json([
                'status' => false,
                'message' => 'Collection not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:16384',
            'is_best' => 'nullable|integer|in:0,1',
            'is_discount' => 'nullable|integer|in:0,1',
            'status' => 'nullable|integer|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'description', 'is_best', 'is_discount', 'status']);

        if ($request->hasFile('image')) {
            if ($collection->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $collection->image));
            }

            $filename = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('uploads/collections', $filename, 'public');
            $data['image'] = '/storage/' . $path;
        }

        if (!$collection->update($data)) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update collection'
            ], 500);
        }

        return response()->json([
            'status' => true,
            'message' => 'Collection updated successfully'
        ], 200);
    }

    public function destroy($id)
    {
        $collection = Collection::find($id);

        if (!$collection) {
            return response()->json([
                'status' => false,
                'message' => 'Collection not found'
            ], 404);
        }

        if ($collection->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $collection->image));
        }

        if (!$collection->delete()) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete collection'
            ], 500);
        }

        return response()->json([
            'status' => true,
            'message' => 'Collection deleted successfully'
        ]);
    }
}
