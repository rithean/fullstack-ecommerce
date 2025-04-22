<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand']);

        // Search by name or description
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // Filter by brand
        if ($brandId = $request->input('brand_id')) {
            $query->where('brand_id', $brandId);
        }

        // Sort by field
        $sortBy = $request->input('sort_by', 'id'); // default is id
        $sortDir = $request->input('sort_dir', 'asc'); // default is ascending

        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $products = $query->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $products
        ], 200);
    }


    public function featuredCollections()
    {
        $collections = Collection::where('is_featured', 1)->get();

        if ($collections->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No featured Collections'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $collections
        ], 200);
    }

    public function banners()
    {
        $banners = Banner::all();

        if ($banners->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No banners found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $banners
        ], 200);
    }

    public function bestCollection()
    {
        $products = Product::with(['category', 'brand'])->where('is_best', 1)->get();

        if ($products->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'No best collection found'], 404);
        }

        return response()->json(['status' => true, 'data' => $products], 200);
    }

    public function limitedEdition()
    {
        $products = Product::with(['category', 'brand'])->where('is_limited', 1)->get();

        if ($products->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'No limited edition products found'], 404);
        }

        return response()->json(['status' => true, 'data' => $products], 200);
    }

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
            'message' => 'Product created successfully.'
        ], 201);
    }

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
            'message' => 'Product updated successfully.'
        ], 200);
    }

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
            'message' => 'Product deleted successfully.'
        ], 200);
    }
}
