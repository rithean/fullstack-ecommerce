<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['category', 'brand'])->orderBy('created_at', 'DESC')->get();

        if ($products->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Product is empty'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $products
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'price'        => 'required|numeric|min:0',
            'qty'          => 'required|numeric|min:0',
            'description'  => 'required|string',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'status'       => 'nullable|in:0,1',
            'category_id'  => 'required|exists:categories,id',
            'brand_id'     => 'required|exists:brands,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'price', 'qty', 'description', 'status', 'category_id', 'brand_id']);

        if ($request->hasFile('image')) {
            $filename = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('uploads/products', $filename, 'public');
            $data['image'] = '/storage/' . $path;
        }

        Product::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Product created successfully.',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with(['category', 'brand'])->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|required|string|max:255',
            'price'       => 'sometimes|required|numeric|min:0',
            'qty'         => 'sometimes|required|numeric|min:0',
            'description' => 'sometimes|required|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'status'      => 'nullable|in:0,1',
            'category_id' => 'sometimes|required|exists:categories,id',
            'brand_id'    => 'sometimes|required|exists:brands,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'price', 'qty', 'description', 'status', 'category_id', 'brand_id']);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->image));
            }

            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads/products', $filename, 'public');
            $data['image'] = '/storage/' . $path;
        }

        $product->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully.',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        if ($product->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $product->image));
        }

        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully.',
        ], 200);
    }
}
